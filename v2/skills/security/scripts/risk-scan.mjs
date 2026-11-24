#!/usr/bin/env node
// scripts/risk-scan.mjs -- a smoke alarm for the mechanical security tells in a project's own files. Not a penetration test.
//
//   node scripts/risk-scan.mjs <file-or-folder>... [--json] [--strict] [--include-build]
//
// Exit 1 when any FAIL is found (with --strict, any WARN too). Dependency-free, Node 18+. It reads source and config
// only: no network, no install, no code execution. It does NOT replace a dependency audit (npm audit, OSV-Scanner), a
// full secret scan of git history (Gitleaks, TruffleHog), static analysis (Semgrep, CodeQL) or a human review of
// authorization logic: it finds the patterns a reviewer keeps rejecting so the reviewer can spend time on logic.
// `--include-build` also reads dist/, build/, .next/, out/ but only runs the secret rules there (a key can be absent from
// source and still ship in the bundle).
//
// Rules are our own wording and regexes, written after studying the OWASP cheat sheets (JWT, Docker, CI/CD, SSRF,
// Deserialization), the GitHub Actions hardening guide, the Electron security checklist and the MCP security notes; the
// basis for each rule is in references/ci-and-code-hardening-reference.md.
//
// Suppress one finding with a reason of 10+ characters on the same line or up to 2 lines above it:
//   // risk-allow: eval-dynamic -- evaluates a fixed string from our own build step
//   # risk-allow: gha-unpinned-action -- first-party action in this org
// A suppression with a shorter reason still silences the rule but raises `suppression-no-reason`.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const CODE_EXT = new Set([".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx", ".mts", ".py", ".rb", ".php", ".go", ".java", ".cs", ".kt", ".vue", ".svelte"]);
const DATA_EXT = new Set([".json", ".yml", ".yaml", ".toml", ".ini", ".cfg", ".properties", ".sh", ".bash", ".ps1"]);
const SKIP_DIRS = new Set(["worktrees", "node_modules", ".git", "coverage", ".turbo", ".vercel", ".cache", "vendor", "__pycache__", ".venv", "venv", "playwright-report", "test-results"]);
const BUILD_DIRS = new Set(["dist", "build", ".next", "out"]);
const SELF_FILES = /^risk-scan(\.test)?\.mjs$/;
const MIN_REASON_CHARS = 10;
const MAX_BYTES = 1_000_000;
const MAX_BUILD_BYTES = 5_000_000;
const PLACEHOLDER = /example|your[_-]?(?:key|token|secret)|x{4,}|placeholder|dummy|sample|changeme|<[a-z_ -]+>|\.{3}|0{6,}|redacted/i;

export function kindsOf(file) {
  const name = basename(file);
  const norm = file.replace(/\\/g, "/");
  const ext = extname(name).toLowerCase();
  const kinds = new Set();
  if (SELF_FILES.test(name)) return kinds;
  if (/(^|\/)\.github\/workflows\/[^/]+\.ya?ml$/.test(norm)) kinds.add("gha");
  if (/^dockerfile(\.|$)/i.test(name) || /\.dockerfile$/i.test(name)) kinds.add("docker");
  if (/^(docker-)?compose(\.[\w-]+)?\.ya?ml$/i.test(name)) kinds.add("docker");
  if (/^\.env(\.|$)/i.test(name) && !/\.(example|sample|template|dist)$/i.test(name)) kinds.add("env");
  if (/^(\.?mcp\.json|claude_desktop_config\.json|mcp_settings\.json)$/i.test(name)) kinds.add("mcp");
  if (/\.(pem|key|p12|pfx)$/i.test(name) || /^id_(rsa|dsa|ecdsa|ed25519)$/.test(name)) kinds.add("keyfile");
  if (CODE_EXT.has(ext)) kinds.add("code");
  if (CODE_EXT.has(ext) || DATA_EXT.has(ext) || kinds.has("env") || kinds.has("docker")) kinds.add("secrets");
  return kinds;
}

const lineOf = (text, index) => text.slice(0, index).split("\n").length;
const finding = (rule, severity, file, text, index, message) => ({ rule, severity, file, line: lineOf(text, index), message });

// ---------- secret formats (built from parts so this file never contains a live-looking key) ----------
const PRIVATE_KEY_MARK = "-----BEGIN " + "(?:RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY" + "(?: BLOCK)?-----";
const SECRET_FORMATS = [
  ["AWS access key id", /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{36,}\b|\bgithub_pat_[A-Za-z0-9_]{50,}\b/g],
  ["Stripe live secret key", /\b[sr]k_live_[0-9a-zA-Z]{20,}\b/g],
  ["Slack token", /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/g],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/g],
  ["Anthropic API key", /\bsk-ant-[A-Za-z0-9_-]{20,}\b/g],
  ["OpenAI API key", /\bsk-(?:proj-)?[A-Za-z0-9_-]{40,}\b/g],
  ["private key block", new RegExp(PRIVATE_KEY_MARK, "g")],
];

// ---------- generic line/regex rules ----------
const RULES = [
  { id: "public-env-secret", severity: "FAIL", kinds: ["secrets", "env"], re: /\b(?:VITE|NEXT_PUBLIC|REACT_APP|EXPO_PUBLIC|PUBLIC|NUXT_PUBLIC|GATSBY)_\w*(?:SECRET|PRIVATE_KEY|PASSWORD|SERVICE_ROLE)\w*/g,
    message: "A variable with this public prefix is compiled into the browser bundle, so anything named like a secret is published to every visitor. Keep it server-side." },
  { id: "jwt-alg-none", severity: "FAIL", kinds: ["code"], re: /\balg(?:orithm)?s?['"]?\s*[:=]\s*\[?\s*(?:['"][\w-]+['"]\s*,\s*)*['"]none['"]/gi,
    message: "Accepting the 'none' algorithm lets anyone forge a token. Hardcode the accepted algorithms (for example ES256) and reject none." },
  { id: "tls-verify-off", severity: "FAIL", kinds: ["code", "secrets"], re: /rejectUnauthorized\s*:\s*false|NODE_TLS_REJECT_UNAUTHORIZED\s*[=:]\s*['"]?0|\bverify\s*=\s*False\b|InsecureSkipVerify\s*:\s*true|CURLOPT_SSL_VERIFYPEER\s*,\s*(?:false|0)/g,
    message: "TLS certificate checking is switched off, so any network attacker can read and change this traffic. Fix the certificate instead." },
  { id: "command-injection", severity: "FAIL", kinds: ["code"], re: /\b(?:exec|execSync)\(\s*`[^`]*\$\{|\b(?:exec|execSync)\(\s*(?!['"]\s*(?:PRAGMA|SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|BEGIN|COMMIT)\b)(?:['"][^'"]*['"]\s*\+|\w+\s*\+)|\bos\.system\(\s*f['"]|\bos\.system\([^)]*(?:\+|%|\.format\()|child_process[\s\S]{0,80}shell\s*:\s*true/g,
    message: "A shell command is built from variables: an attacker-controlled value becomes extra commands. Use execFile/spawn with an argument array and no shell." },
  { id: "unsafe-deserialization", severity: "FAIL", kinds: ["code"], re: /\bpickle\.loads?\(|\byaml\.load\((?![^)]*Loader\s*=\s*(?:yaml\.)?(?:Safe|CSafe)Loader)|\bBinaryFormatter\b|TypeNameHandling\s*\.\s*(?:All|Auto|Objects|Arrays)\b|\bnode-serialize\b|\bunserialize\(\s*\$_(?:GET|POST|REQUEST|COOKIE)/g,
    message: "This deserializer can execute attacker-chosen code from untrusted data. Use a data-only format (JSON) or a safe loader with an allowlist." },
  { id: "cors-wildcard-credentials", severity: "FAIL", kinds: ["code"], file: (text) => /origin\s*:\s*['"]\*['"]|Access-Control-Allow-Origin['"]?\s*[,:]\s*['"]\*['"]/.test(text) && /credentials\s*:\s*true|Access-Control-Allow-Credentials['"]?\s*[,:]\s*['"]true['"]/i.test(text),
    re: /origin\s*:\s*['"]\*['"]|Access-Control-Allow-Origin['"]?\s*[,:]\s*['"]\*['"]/g,
    message: "A wildcard origin together with credentials lets any site act as a logged-in user. List the exact origins you trust." },
  { id: "electron-insecure-pref", severity: "FAIL", kinds: ["code"], re: /\b(?:nodeIntegration|allowRunningInsecureContent|enableRemoteModule|nodeIntegrationInWorker|nodeIntegrationInSubFrames)\s*:\s*true|\b(?:contextIsolation|sandbox|webSecurity)\s*:\s*false/g,
    message: "An insecure Electron web preference: remote or injected content can reach Node and the operating system. Keep contextIsolation and sandbox on, nodeIntegration off, webSecurity on." },
  { id: "docker-socket-mount", severity: "FAIL", kinds: ["docker"], re: /\/var\/run\/docker\.sock/g,
    message: "Mounting the Docker socket gives the container control of the host. Do not expose it, even read-only." },
  { id: "docker-privileged", severity: "FAIL", kinds: ["docker"], re: /\bprivileged\s*:\s*true|--privileged\b/g,
    message: "A privileged container has nearly the host's power. Drop all capabilities and add back only what is needed." },
  { id: "gha-write-all", severity: "FAIL", kinds: ["gha"], re: /permissions\s*:\s*write-all/g,
    message: "write-all gives the workflow token every permission. Set the minimum per job." },
  { id: "eval-dynamic", severity: "WARN", kinds: ["code"], re: /(?<![.\w])eval\s*\(\s*(?!['"`][^'"`$]*['"`]\s*\))|new Function\s*\(/g,
    message: "Evaluating a string as code is an injection route if any part comes from outside; use a parser or a lookup table." },
  { id: "inner-html", severity: "WARN", kinds: ["code"], re: /dangerouslySetInnerHTML|\.(?:inner|outer)HTML\s*=\s*(?!\s*['"`]\s*['"`])|\bv-html\b|\bdocument\.write\(/g,
    message: "Raw HTML insertion is the usual route to cross-site scripting; sanitise with a maintained library (for example DOMPurify) or set text content." },
  { id: "weak-hash", severity: "WARN", kinds: ["code"], re: /createHash\(\s*['"](?:md5|sha1)['"]\s*\)|hashlib\.(?:md5|sha1)\(|MessageDigest\.getInstance\(\s*['"](?:MD5|SHA-?1)['"]/gi,
    message: "MD5 and SHA-1 are broken for security use. For passwords use Argon2id, scrypt or bcrypt; for integrity use SHA-256 or better." },
  { id: "insecure-random-token", severity: "WARN", kinds: ["code"], line: (l) => /\bMath\.random\s*\(|\brandom\.(?:random|randint)\(/.test(l) && /token|secret|session|password|otp|nonce|apikey|api_key|reset|csrf/i.test(l),
    message: "A predictable random source is used for something secret. Use crypto.randomBytes / crypto.randomUUID (or secrets in Python)." },
  { id: "cookie-flags-off", severity: "WARN", kinds: ["code"], re: /\bhttpOnly\s*:\s*false|\bsecure\s*:\s*false|\bsameSite\s*:\s*['"]none['"]|\bSESSION_COOKIE_SECURE\s*=\s*False/gi,
    message: "A cookie flag that protects the session is switched off. Use HttpOnly, Secure and SameSite=Lax or Strict unless there is a written reason." },
  { id: "debug-on", severity: "WARN", kinds: ["code", "secrets"], re: /^\s*DEBUG\s*=\s*True\b|\bapp\.debug\s*=\s*True|\bdebug\s*:\s*true\b(?=[^\n]*\b(?:prod|production)\b)/gm,
    message: "Debug mode shows stack traces and sometimes a code console to visitors. Make it depend on the environment and default to off." },
  { id: "curl-pipe-shell", severity: "WARN", kinds: ["secrets", "docker", "gha"], re: /\b(?:curl|wget)\b[^|\n;]*\|\s*(?:sudo\s+)?(?:ba|z)?sh\b/g,
    message: "Piping a download into a shell runs whatever the server sends. Download, verify a checksum or signature, then run." },
  { id: "chmod-777", severity: "WARN", kinds: ["secrets", "docker", "gha"], re: /\bchmod\s+(?:-R\s+)?0?777\b/g,
    message: "World-writable files let any local user change what runs. Grant the narrowest mode." },
  { id: "electron-open-external", severity: "WARN", kinds: ["code"], re: /shell\.openExternal\(\s*(?!['"`]https?:\/\/[^'"`$]*['"`]\s*\))/g,
    message: "openExternal with a non-constant value can launch other protocols and local files. Allow only https URLs from a checked allowlist." },
  { id: "electron-webview", severity: "WARN", kinds: ["code"], re: /webviewTag\s*:\s*true|\ballowpopups\b/g,
    message: "webview tags and popups widen the attack surface; avoid them, or validate every option in will-attach-webview." },
  { id: "cors-wildcard", severity: "WARN", kinds: ["code"], file: (text) => !/credentials\s*:\s*true/.test(text), re: /origin\s*:\s*['"]\*['"]|Access-Control-Allow-Origin['"]?\s*[,:]\s*['"]\*['"]/g,
    message: "A wildcard CORS origin is fine only for fully public, credential-free data. Otherwise list the origins." },
  { id: "gha-pr-target", severity: "WARN", kinds: ["gha"], re: /^\s*(?:-\s*)?pull_request_target\b|\bpull_request_target\s*:/gm,
    message: "pull_request_target runs with secrets and a write token on code from forks. Avoid it, or never check out or run the pull request's code in it. workflow_run is a better way to separate privileges." },
  { id: "mcp-unpinned-npx", severity: "WARN", kinds: ["mcp"], re: /"command"\s*:\s*"(?:npx|bunx|uvx|pnpm dlx)"[^}]*?"args"\s*:\s*\[([^\]]*)\]/g,
    test: (m) => /"-y"|"--yes"/.test(m[1]) && !/["'][^"']*@(?:\^|~)?\d[^"']*["']/.test(m[1]) && !/["'][^"']*==\d[^"']*["']/.test(m[1]),
    message: "An MCP server started with npx -y and no version fetches whatever is latest each launch, so a hijacked package runs on your machine with your rights. Pin an exact version." },
];

function applyRule(rule, file, text) {
  if (rule.file && !rule.file(text)) return [];
  const out = [];
  if (rule.line) {
    let offset = 0;
    for (const l of text.split("\n")) {
      if (rule.line(l)) out.push(finding(rule.id, rule.severity, file, text, offset, rule.message));
      offset += l.length + 1;
    }
    return out;
  }
  for (const m of text.matchAll(rule.re)) {
    if (rule.test && !rule.test(m)) continue;
    out.push(finding(rule.id, rule.severity, file, text, m.index, rule.message));
  }
  return out;
}

// ---------- rules that need more than one pattern ----------
function secretFormats(file, text) {
  const out = [];
  for (const [label, re] of SECRET_FORMATS) {
    for (const m of text.matchAll(re)) {
      const around = text.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30);
      if (PLACEHOLDER.test(m[0]) || PLACEHOLDER.test(around)) continue;
      out.push(finding("hardcoded-secret", "FAIL", file, text, m.index, `Looks like a ${label} in a file that gets committed or shipped. Revoke it at the provider first, then remove it and scrub history.`));
    }
  }
  return out;
}

function envFileSecrets(file, text) {
  const out = [];
  let offset = 0;
  for (const l of text.split("\n")) {
    const m = /^\s*(?:export\s+)?([A-Z0-9_]*(?:SECRET|PASSWORD|TOKEN|PRIVATE_KEY|API_KEY|SERVICE_ROLE|DATABASE_URL)[A-Z0-9_]*)\s*=\s*(\S+)/.exec(l);
    if (m && !PLACEHOLDER.test(m[2]) && m[2].replace(/["']/g, "").length >= 8) {
      out.push(finding("committed-env-secret", "FAIL", file, text, offset, `${m[1]} has a real-looking value in a .env file. Keep real values out of the repository (commit a .env.example with empty values and gitignore the real file).`));
    }
    offset += l.length + 1;
  }
  return out;
}

function keyFile(file, text) {
  return [finding("private-key-file", "FAIL", file, text, 0, "A private key or certificate-bundle file is in the project tree. Remove it, rotate the key, and keep keys in a secret manager.")];
}

function sqlInterpolation(file, text) {
  const out = [];
  const call = /\b(?:query|execute|executemany|executescript|raw|queryRaw|\$queryRawUnsafe)\(\s*(`[^`\n]*|f['"][^'"\n]*|['"][^'"\n]*['"]\s*\+[^\n]*)/gi;
  for (const m of text.matchAll(call)) {
    const lit = m[1];
    if (!/\b(?:SELECT|INSERT|UPDATE|DELETE)\b/i.test(lit)) continue;
    const concat = /['"]\s*\+/.test(lit);
    const interpolated = /\$\{|\{[^}]+\}/.test(lit);
    if (!concat && !interpolated) continue;
    // names that conventionally hold a fixed fragment: ALL_CAPS constants and placeholder lists ("?, ?, ?")
    const fixedName = (e) => /^[A-Z][A-Z0-9_]*$/.test(e.trim()) || /placeholder|qmark|marks|_sql$|_clause$/i.test(e);
    const operands = concat ? [...lit.matchAll(/\+\s*([A-Za-z_][\w.]*)/g)].map((x) => x[1]) : [];
    const exprs = interpolated ? [...lit.matchAll(/\$?\{([^}]+)\}/g)].map((x) => x[1]) : [];
    const variable = [...operands, ...exprs].some((e) => !fixedName(e));
    const valuePosition = variable && (concat || /(?:=|<>|!=|<|>|\bLIKE|\bIN\s*\(|\bVALUES\s*\(|\bLIMIT|\bOFFSET)\s*'?\s*(?:\$\{|\{)/i.test(lit));
    out.push(valuePosition
      ? finding("sql-concat", "FAIL", file, text, m.index, "A value is joined into SQL text, which makes it injectable. Use parameterised queries (placeholders) for every value.")
      : finding("sql-identifier-interpolation", "WARN", file, text, m.index, "A column, table or clause is interpolated into SQL text. Safe only if the value comes from a fixed allowlist in code, never from a request; keep every data value as a placeholder."));
  }
  return out;
}

function jwtVerifyNoAlgorithms(file, text) {
  if (!/jsonwebtoken|\bjwt\b/i.test(text)) return [];
  const out = [];
  for (const m of text.matchAll(/\bjwt\.verify\s*\(/g)) {
    const open = m.index + m[0].length - 1;
    let depth = 0, end = open;
    for (; end < text.length; end++) {
      if (text[end] === "(") depth++;
      else if (text[end] === ")" && --depth === 0) break;
    }
    if (!/algorithms/.test(text.slice(open, end))) {
      out.push(finding("jwt-verify-no-algorithms", "WARN", file, text, m.index, "jwt.verify with no algorithms option trusts the token's own header to pick the algorithm. Pass algorithms: ['ES256'] (or the one you issue)."));
    }
  }
  return out;
}

function electronWindowHandlers(file, text) {
  const out = [];
  const win = /new BrowserWindow\s*\(/.exec(text);
  if (win && !/setWindowOpenHandler|will-navigate/.test(text)) {
    out.push(finding("electron-no-navigation-guard", "WARN", file, text, win.index, "A BrowserWindow is created with no setWindowOpenHandler or will-navigate handler in this file; remote pages could open windows or navigate the app away."));
  }
  const ipc = /ipcMain\.(?:handle|on)\s*\(/.exec(text);
  if (ipc && !/senderFrame|event\.sender|validateSender/.test(text)) {
    out.push(finding("electron-ipc-no-sender-check", "WARN", file, text, ipc.index, "An IPC handler with no sender check in this file; validate event.senderFrame.url / origin before acting."));
  }
  return out;
}

const GHA_UNTRUSTED = /\$\{\{\s*(?:github\.event\.(?:issue\.(?:title|body)|pull_request\.(?:title|body|head\.ref|head\.label|head\.repo\.default_branch)|comment\.body|review\.body|review_comment\.body|pages\.[\w.]*page_name|head_commit\.(?:message|author\.(?:email|name))|commits\[\d*\]\.(?:message|author\.(?:email|name))|discussion\.(?:title|body))|github\.head_ref)\s*\}\}/g;

function ghaChecks(file, text) {
  const out = [];
  const lines = text.split("\n");
  let offset = 0;
  let runIndent = -1;
  for (const l of lines) {
    const indent = l.search(/\S/);
    const runStart = /^(\s*)(?:-\s+)?run\s*:\s*(.*)$/.exec(l);
    if (runIndent >= 0 && indent !== -1 && indent <= runIndent) runIndent = -1;
    if (runStart) {
      const rest = runStart[2].trim();
      runIndent = /^[|>][+-]?$/.test(rest) ? runStart[1].length + (l.includes("- ") ? 2 : 0) : -1;
      if (rest && !/^[|>][+-]?$/.test(rest) && GHA_UNTRUSTED.test(rest)) {
        out.push(finding("gha-script-injection", "FAIL", file, text, offset, "A pull-request/issue field is expanded straight into a shell command, so a crafted title or branch name runs commands with this job's token. Pass it through an env: variable and use \"$VAR\" in the script."));
      }
      GHA_UNTRUSTED.lastIndex = 0;
    } else if (runIndent >= 0) {
      GHA_UNTRUSTED.lastIndex = 0;
      if (GHA_UNTRUSTED.test(l)) {
        out.push(finding("gha-script-injection", "FAIL", file, text, offset, "A pull-request/issue field is expanded straight into a shell command, so a crafted title or branch name runs commands with this job's token. Pass it through an env: variable and use \"$VAR\" in the script."));
      }
      GHA_UNTRUSTED.lastIndex = 0;
    }
    const uses = /^\s*(?:-\s+)?uses\s*:\s*['"]?([^\s'"#]+)/.exec(l);
    if (uses && !uses[1].startsWith("./") && !uses[1].startsWith("docker://") && !/@[0-9a-f]{40}$/.test(uses[1])) {
      out.push(finding("gha-unpinned-action", "WARN", file, text, offset, `${uses[1]} is not pinned to a full commit SHA; a moved tag runs new code in your pipeline. Pin the SHA (keep the version in a comment).`));
    }
    offset += l.length + 1;
  }
  if (/pull_request_target/.test(text) && /ref\s*:\s*\$\{\{\s*github\.(?:event\.pull_request\.head\.(?:sha|ref)|head_ref)/.test(text)) {
    const idx = text.search(/ref\s*:\s*\$\{\{\s*github\.(?:event\.pull_request\.head|head_ref)/);
    out.push(finding("gha-pr-target-checkout", "FAIL", file, text, idx, "pull_request_target checks out the pull request's own code with secrets and a write token available: a fork can steal them. Split into an unprivileged pull_request job and a privileged workflow_run job."));
  }
  if (!/^\s*permissions\s*:/m.test(text)) {
    out.push(finding("gha-no-permissions", "WARN", file, text, 0, "No permissions: block, so the token gets the repository default (often read-write). Set permissions: contents: read at the top and raise per job."));
  }
  return out;
}

function dockerChecks(file, text) {
  const out = [];
  if (!/^dockerfile/i.test(basename(file)) && !/\.dockerfile$/i.test(basename(file))) return out;
  const stages = new Set();
  let offset = 0;
  for (const l of text.split("\n")) {
    const from = /^\s*FROM\s+(?:--platform=\S+\s+)?(\S+)(?:\s+AS\s+(\S+))?/i.exec(l);
    if (from) {
      const image = from[1];
      if (from[2]) stages.add(from[2].toLowerCase());
      if (image.toLowerCase() !== "scratch" && !stages.has(image.toLowerCase()) && !/@sha256:/.test(image) && !image.includes("$") && (/:latest$/.test(image) || !/:/.test(image))) {
        out.push(finding("docker-unpinned-image", "WARN", file, text, offset, `${image} has no version tag (or uses :latest), so builds are not repeatable. Pin a version, ideally by digest.`));
      }
    }
    offset += l.length + 1;
  }
  if (/^\s*FROM\s/im.test(text) && !/^\s*USER\s+(?!root\b)\S+/im.test(text)) {
    out.push(finding("docker-runs-as-root", "WARN", file, text, 0, "No non-root USER instruction, so the process runs as root inside the container. Add a USER and run with --security-opt=no-new-privileges."));
  }
  return out;
}

// ---------- suppression ----------
function suppressions(text) {
  const found = [];
  for (const m of text.matchAll(/risk-allow:\s*([a-z0-9-]+)\s*--\s*([^*\n>]*)/g)) {
    found.push({ rule: m[1], line: lineOf(text, m.index), reasonChars: m[2].replace(/\s/g, "").length });
  }
  return found;
}

const TEST_FILE = /(\.test\.|\.spec\.|__tests__|[\\/]tests?[\\/])/i;
const TEST_DEMOTED = new Set(["hardcoded-secret", "command-injection", "sql-concat"]);

export function scanText(file, text, { buildOnly = false } = {}) {
  const kinds = buildOnly ? new Set(["secrets"]) : kindsOf(file);
  if (kinds.size === 0) return [];
  let findings = [];
  if (kinds.has("secrets")) findings.push(...secretFormats(file, text));
  if (buildOnly) return findings;
  if (kinds.has("env")) findings.push(...envFileSecrets(file, text));
  if (kinds.has("keyfile")) findings.push(...keyFile(file, text));
  if (kinds.has("gha")) findings.push(...ghaChecks(file, text));
  if (kinds.has("docker")) findings.push(...dockerChecks(file, text));
  if (kinds.has("code")) findings.push(...jwtVerifyNoAlgorithms(file, text), ...electronWindowHandlers(file, text), ...sqlInterpolation(file, text));
  for (const rule of RULES) {
    if (rule.kinds.some((k) => kinds.has(k))) findings.push(...applyRule(rule, file, text));
  }
  const seen = new Set();
  findings = findings.filter((f) => !seen.has(`${f.rule}:${f.line}`) && seen.add(`${f.rule}:${f.line}`));
  if (TEST_FILE.test(file)) {
    // Real projects keep fake keys and attack strings in tests of redaction and sanitising code; report them, do not block on them.
    findings = findings.map((f) => (f.severity === "FAIL" && TEST_DEMOTED.has(f.rule) ? { ...f, severity: "WARN", message: "(test file: if this is a fake value or an attack string under test, say so with risk-allow) " + f.message } : f));
  }
  const allowed = suppressions(text);
  findings = findings.filter((f) => !allowed.some((s) => s.rule === f.rule && f.line >= s.line && f.line <= s.line + 2));
  for (const s of allowed) {
    if (s.reasonChars < MIN_REASON_CHARS) {
      findings.push({ rule: "suppression-no-reason", severity: "WARN", file, line: s.line, message: `risk-allow for ${s.rule} needs a reason of at least ${MIN_REASON_CHARS} characters.` });
    }
  }
  return findings.sort((a, b) => a.line - b.line);
}

// ---------- files ----------
function walk(path, out, includeBuild, inBuild = false) {
  const st = statSync(path);
  if (st.isDirectory()) {
    for (const name of readdirSync(path)) {
      if (SKIP_DIRS.has(name)) continue;
      const build = BUILD_DIRS.has(name);
      if (build && !includeBuild) continue;
      walk(join(path, name), out, includeBuild, inBuild || build);
    }
  } else if (inBuild) {
    if (st.size <= MAX_BUILD_BYTES && /\.(?:js|mjs|cjs|css|html|json|map|txt)$/i.test(path)) out.push({ path, buildOnly: true });
  } else if (st.size <= MAX_BYTES && (kindsOf(path).size > 0)) {
    out.push({ path, buildOnly: false });
  }
}

export function scanPaths(paths, { includeBuild = false } = {}) {
  const files = [];
  for (const p of paths) {
    if (!existsSync(p)) throw new Error(`path not found: ${p}`);
    walk(p, files, includeBuild);
  }
  return files.flatMap(({ path, buildOnly }) => scanText(path, readFileSync(path, "utf8"), { buildOnly }));
}

export function summarize(findings, { strict = false } = {}) {
  const fail = findings.filter((f) => f.severity === "FAIL").length;
  const warn = findings.filter((f) => f.severity === "WARN").length;
  return { fail, warn, exitCode: fail > 0 || (strict && warn > 0) ? 1 : 0 };
}

// ---------- cli ----------
function main(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("--")));
  const paths = argv.filter((a) => !a.startsWith("--"));
  if (paths.length === 0) {
    console.error("usage: node risk-scan.mjs <file-or-folder>... [--json] [--strict] [--include-build]");
    return 2;
  }
  let findings;
  try {
    findings = scanPaths(paths, { includeBuild: flags.has("--include-build") });
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const summary = summarize(findings, { strict: flags.has("--strict") });
  if (flags.has("--json")) {
    console.log(JSON.stringify({ summary, findings }, null, 2));
  } else {
    for (const f of findings) console.log(`${f.severity} ${f.rule} ${f.file}:${f.line} ${f.message}`);
    console.log(`risk-scan: ${summary.fail} FAIL, ${summary.warn} WARN (a smoke alarm, not a penetration test)`);
  }
  return summary.exitCode;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
