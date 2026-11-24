import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { kindsOf, scanPaths, scanText, summarize } from "./risk-scan.mjs";

const rules = (file, text, opts) => scanText(file, text, opts).map((f) => f.rule);
const has = (file, text, rule) => rules(file, text).includes(rule);
const sev = (file, text, rule) => scanText(file, text).find((f) => f.rule === rule)?.severity;
const APP = "src/app.ts";
const GHA = ".github/workflows/ci.yml";
// fake credentials assembled from parts so this file holds nothing that looks live
const fake = {
  aws: "AK" + "IA" + "QWERTYUIOP" + "ASDFGH",
  gh: "ghp" + "_" + "a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8",
  stripe: "sk" + "_live_" + "4eC39HqLyjWDarjtT1zdp7dc",
  anthropic: "sk" + "-ant-" + "api03-Zk3Qm8Rt5Vw2Yx7Ab9Cd1Ef4Gh6",
  key: "-----BEGIN " + "RSA PRIVATE KEY" + "-----",
};

test("kindsOf classifies files and skips the scanner's own files", () => {
  assert.ok(kindsOf("src/a.ts").has("code"));
  assert.ok(kindsOf(".github/workflows/ci.yml").has("gha"));
  assert.ok(kindsOf("Dockerfile").has("docker"));
  assert.ok(kindsOf("docker-compose.yml").has("docker"));
  assert.ok(kindsOf(".env.production").has("env"));
  assert.ok(!kindsOf(".env.example").has("env"));
  assert.ok(kindsOf(".mcp.json").has("mcp"));
  assert.ok(kindsOf("certs/server.pem").has("keyfile"));
  assert.equal(kindsOf("README.md").size, 0);
  assert.equal(kindsOf("scripts/risk-scan.mjs").size, 0);
  assert.equal(kindsOf("scripts/risk-scan.test.mjs").size, 0);
});

test("hardcoded secrets FAIL, placeholders and examples do not", () => {
  assert.equal(sev(APP, `const k = "${fake.aws}";`, "hardcoded-secret"), "FAIL");
  assert.ok(has(APP, `token = "${fake.gh}"`, "hardcoded-secret"));
  assert.ok(has("config.json", `{"key": "${fake.stripe}"}`, "hardcoded-secret"));
  assert.ok(has(APP, `const a = "${fake.anthropic}"`, "hardcoded-secret"));
  assert.ok(has("deploy.sh", fake.key, "hardcoded-secret"));
  assert.ok(!has(APP, `const k = "${fake.aws.slice(0, 4)}EXAMPLEKEYEXAMPLE"`, "hardcoded-secret"));
  assert.ok(!has(APP, `// your_key_here sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx`, "hardcoded-secret"));
  assert.ok(!has(APP, `const k = process.env.API_KEY`, "hardcoded-secret"));
});

test("build output is scanned for secrets only", () => {
  const found = rules("dist/main.js", `var k="${fake.stripe}"; eval(x)`, { buildOnly: true });
  assert.deepEqual(found, ["hardcoded-secret"]);
});

test("public env prefix carrying a secret FAILs, a publishable key does not", () => {
  assert.equal(sev(APP, "const s = import.meta.env.VITE_STRIPE_SECRET_KEY", "public-env-secret"), "FAIL");
  assert.ok(has(".env.local", "NEXT_PUBLIC_DB_PASSWORD=hunter2hunter2", "public-env-secret"));
  assert.ok(has(APP, "process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE", "public-env-secret"));
  assert.ok(!has(APP, "import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY", "public-env-secret"));
  assert.ok(!has(APP, "process.env.NEXT_PUBLIC_API_URL", "public-env-secret"));
});

test("env files with real-looking values FAIL, empty or placeholder do not", () => {
  assert.ok(has(".env", "DATABASE_URL=postgres://u:pw@db.internal:5432/app", "committed-env-secret"));
  assert.ok(has(".env.production", "JWT_SECRET=9f8e7d6c5b4a39281706", "committed-env-secret"));
  assert.ok(!has(".env", "JWT_SECRET=", "committed-env-secret"));
  assert.ok(!has(".env", "JWT_SECRET=changeme-please", "committed-env-secret"));
  assert.ok(!has(".env", "PORT=3000", "committed-env-secret"));
  assert.deepEqual(scanText(".env.example", "JWT_SECRET=9f8e7d6c5b4a39281706"), []);
});

test("key files FAIL", () => {
  assert.equal(sev("certs/server.pem", "x", "private-key-file"), "FAIL");
  assert.ok(has("id_rsa", "x", "private-key-file"));
});

test("JWT: alg none FAILs and verify without algorithms WARNs", () => {
  assert.equal(sev(APP, "jwt.verify(t, k, { algorithms: ['HS256', 'none'] })", "jwt-alg-none"), "FAIL");
  assert.ok(has(APP, "const header = { alg: 'none', typ: 'JWT' }", "jwt-alg-none"));
  assert.equal(sev(APP, "import jwt from 'jsonwebtoken';\njwt.verify(token, secret)", "jwt-verify-no-algorithms"), "WARN");
  assert.ok(has(APP, "import jwt from 'jsonwebtoken';\njwt.verify(token, key, {\n issuer: 'x'\n})", "jwt-verify-no-algorithms"));
  assert.ok(!has(APP, "import jwt from 'jsonwebtoken';\njwt.verify(token, key, { algorithms: ['ES256'] })", "jwt-verify-no-algorithms"));
  assert.ok(!has(APP, "const x = verify(a)", "jwt-verify-no-algorithms"));
});

test("TLS verification off FAILs", () => {
  assert.ok(has(APP, "https.request({ rejectUnauthorized: false })", "tls-verify-off"));
  assert.ok(has(APP, "process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'", "tls-verify-off"));
  assert.ok(has("a.py", "requests.get(u, verify=False)", "tls-verify-off"));
  assert.ok(has("a.go", "tls.Config{InsecureSkipVerify: true}", "tls-verify-off"));
  assert.ok(!has(APP, "https.request({ rejectUnauthorized: true })", "tls-verify-off"));
});

test("command injection: built shell strings FAIL, argument arrays do not", () => {
  assert.equal(sev(APP, "exec(`convert ${file} out.png`)", "command-injection"), "FAIL");
  assert.ok(has(APP, "execSync('git log ' + branch)", "command-injection"));
  assert.ok(has("a.py", "os.system(f'ls {path}')", "command-injection"));
  assert.ok(!has(APP, "execFile('convert', [file, 'out.png'])", "command-injection"));
  assert.ok(!has(APP, "exec('npm run build')", "command-injection"));
});

test("SQL concatenation FAILs, placeholders do not", () => {
  assert.equal(sev(APP, "db.query(`SELECT * FROM users WHERE id = ${id}`)", "sql-concat"), "FAIL");
  assert.ok(has(APP, "db.query('SELECT * FROM users WHERE name = ' + name)", "sql-concat"));
  assert.ok(has("a.py", "cur.execute(f\"SELECT * FROM t WHERE id = {i}\")", "sql-concat"));
  assert.ok(!has(APP, "db.query('SELECT * FROM users WHERE id = $1', [id])", "sql-concat"));
  // identifier or clause interpolation with value placeholders is a WARN, not a FAIL
  assert.equal(sev("a.py", "conn.execute(f'UPDATE clients SET {cols} WHERE id = ?', vals)", "sql-identifier-interpolation"), "WARN");
  assert.ok(!has("a.py", "conn.execute(f'UPDATE clients SET {cols} WHERE id = ?', vals)", "sql-concat"));
  assert.ok(has("a.py", "conn.execute(f'SELECT {COLS} FROM properties WHERE zone_id IS NULL')", "sql-identifier-interpolation"));
  assert.ok(has(APP, "db.query(`SELECT * FROM t ORDER BY ${col}`)", "sql-identifier-interpolation"));
  assert.ok(!has("a.py", "conn.execute('SELECT 1')", "sql-identifier-interpolation"));
  // a fixed constant or a placeholder list is not a value; a variable still is
  assert.ok(!has("a.py", "conn.execute(\"SELECT COUNT(*) FROM p WHERE status IN \" + AVAILABLE_STATUS_SQL)", "sql-concat"));
  assert.ok(has("a.py", "conn.execute(\"SELECT COUNT(*) FROM p WHERE status IN \" + AVAILABLE_STATUS_SQL)", "sql-identifier-interpolation"));
  assert.ok(!has("a.py", "conn.execute(f'UPDATE c SET x = ? WHERE id IN ({placeholders})', ids)", "sql-concat"));
  assert.ok(has("a.py", "conn.execute(f'DELETE FROM c WHERE id IN ({ids_csv})')", "sql-concat"));
});

test("unsafe deserialization FAILs, safe loaders do not", () => {
  assert.equal(sev("a.py", "data = pickle.loads(blob)", "unsafe-deserialization"), "FAIL");
  assert.ok(has("a.py", "cfg = yaml.load(open('c.yml'))", "unsafe-deserialization"));
  assert.ok(has("a.cs", "var f = new BinaryFormatter();", "unsafe-deserialization"));
  assert.ok(has("a.cs", "settings.TypeNameHandling = TypeNameHandling.All;", "unsafe-deserialization"));
  assert.ok(!has("a.py", "cfg = yaml.load(s, Loader=yaml.SafeLoader)", "unsafe-deserialization"));
  assert.ok(!has("a.py", "cfg = yaml.safe_load(s)", "unsafe-deserialization"));
});

test("CORS: wildcard with credentials FAILs, wildcard alone WARNs", () => {
  assert.equal(sev(APP, "cors({ origin: '*', credentials: true })", "cors-wildcard-credentials"), "FAIL");
  assert.equal(sev(APP, "cors({ origin: '*' })", "cors-wildcard"), "WARN");
  assert.ok(!has(APP, "cors({ origin: '*', credentials: true })", "cors-wildcard"));
  assert.ok(!has(APP, "cors({ origin: 'https://app.example.org', credentials: true })", "cors-wildcard-credentials"));
});

test("Electron preferences, openExternal and handlers", () => {
  const bad = "new BrowserWindow({ webPreferences: {\n nodeIntegration: true,\n contextIsolation: false,\n sandbox: false,\n webSecurity: false } })";
  assert.equal(scanText(APP, bad).filter((f) => f.rule === "electron-insecure-pref").length, 4);
  assert.ok(has(APP, bad, "electron-no-navigation-guard"));
  assert.ok(!has(APP, "new BrowserWindow({})\nwin.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))", "electron-no-navigation-guard"));
  assert.ok(has(APP, "shell.openExternal(url)", "electron-open-external"));
  assert.ok(!has(APP, "shell.openExternal('https://example.org/help')", "electron-open-external"));
  assert.ok(has(APP, "ipcMain.handle('save', async (e, d) => d)", "electron-ipc-no-sender-check"));
  assert.ok(!has(APP, "ipcMain.handle('save', async (e, d) => { if (e.senderFrame.url !== U) throw 1 })", "electron-ipc-no-sender-check"));
  assert.ok(has(APP, "new BrowserWindow({ webPreferences: { webviewTag: true } })", "electron-webview"));
});

test("injection sinks WARN: eval, innerHTML, weak hash, random token, cookies, debug", () => {
  assert.ok(has(APP, "eval(userInput)", "eval-dynamic"));
  assert.ok(has(APP, "new Function('a', body)", "eval-dynamic"));
  assert.ok(!has(APP, "eval('1 + 1')", "eval-dynamic"));
  assert.ok(!has(APP, "obj.evaluate(x)", "eval-dynamic"));
  assert.ok(has(APP, "el.innerHTML = comment", "inner-html"));
  assert.ok(has("a.tsx", "<div dangerouslySetInnerHTML={{ __html: h }} />", "inner-html"));
  assert.ok(!has(APP, "el.innerHTML = ''", "inner-html"));
  assert.ok(has(APP, "crypto.createHash('md5').update(p)", "weak-hash"));
  assert.ok(has("a.py", "hashlib.sha1(pw)", "weak-hash"));
  assert.ok(has(APP, "const resetToken = Math.random().toString(36)", "insecure-random-token"));
  assert.ok(!has(APP, "const jitter = Math.random() * 100", "insecure-random-token"));
  assert.ok(has(APP, "res.cookie('s', v, { httpOnly: false })", "cookie-flags-off"));
  assert.ok(has(APP, "res.cookie('s', v, { sameSite: 'none' })", "cookie-flags-off"));
  assert.ok(has("settings.py", "DEBUG = True", "debug-on"));
});

test("shell hygiene: curl pipe, chmod 777", () => {
  assert.ok(has("setup.sh", "curl -fsSL https://x.sh | sh", "curl-pipe-shell"));
  assert.ok(has("setup.sh", "wget -qO- https://x.sh | sudo bash", "curl-pipe-shell"));
  assert.ok(!has("setup.sh", "curl -fsSL https://x.sh -o x.sh && sha256sum -c x.sum", "curl-pipe-shell"));
  assert.ok(has("setup.sh", "chmod -R 777 /app", "chmod-777"));
});

test("GitHub Actions: unpinned actions, permissions, write-all", () => {
  const wf = "name: ci\non: push\njobs:\n  b:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: ./local-action\n      - uses: actions/setup-node@" + "a".repeat(40) + "\n";
  const found = scanText(GHA, wf);
  assert.equal(found.filter((f) => f.rule === "gha-unpinned-action").length, 1);
  assert.ok(found.some((f) => f.rule === "gha-no-permissions"));
  assert.ok(!has(GHA, "permissions:\n  contents: read\n", "gha-no-permissions"));
  assert.equal(sev(GHA, "permissions: write-all", "gha-write-all"), "FAIL");
});

test("GitHub Actions: script injection in run blocks, safe through env", () => {
  const bad = "permissions:\n  contents: read\njobs:\n  a:\n    steps:\n      - run: |\n          echo \"${{ github.event.pull_request.title }}\"\n";
  assert.equal(sev(GHA, bad, "gha-script-injection"), "FAIL");
  assert.ok(has(GHA, "permissions:\n  contents: read\njobs:\n  a:\n    steps:\n      - run: echo ${{ github.head_ref }}\n", "gha-script-injection"));
  const good = "permissions:\n  contents: read\njobs:\n  a:\n    steps:\n      - env:\n          TITLE: ${{ github.event.pull_request.title }}\n        run: |\n          echo \"$TITLE\"\n";
  assert.ok(!has(GHA, good, "gha-script-injection"));
  const after = "permissions:\n  contents: read\njobs:\n  a:\n    steps:\n      - run: |\n          echo hi\n      - name: x\n        with:\n          t: ${{ github.event.pull_request.title }}\n";
  assert.ok(!has(GHA, after, "gha-script-injection"));
});

test("GitHub Actions: pull_request_target warns, with head checkout fails", () => {
  const warn = "on:\n  pull_request_target:\npermissions:\n  contents: read\n";
  assert.equal(sev(GHA, warn, "gha-pr-target"), "WARN");
  assert.ok(!has(GHA, warn, "gha-pr-target-checkout"));
  const fail = "on: pull_request_target\npermissions:\n  contents: read\njobs:\n  a:\n    steps:\n      - uses: actions/checkout@" + "b".repeat(40) + "\n        with:\n          ref: ${{ github.event.pull_request.head.sha }}\n";
  assert.equal(sev(GHA, fail, "gha-pr-target-checkout"), "FAIL");
});

test("Docker: socket, privileged, root, unpinned image", () => {
  assert.equal(sev("docker-compose.yml", "volumes:\n  - /var/run/docker.sock:/var/run/docker.sock", "docker-socket-mount"), "FAIL");
  assert.equal(sev("compose.yaml", "services:\n  a:\n    privileged: true", "docker-privileged"), "FAIL");
  assert.ok(has("Dockerfile", "FROM node:latest\nRUN npm ci", "docker-unpinned-image"));
  assert.ok(has("Dockerfile", "FROM node\nRUN npm ci", "docker-unpinned-image"));
  assert.ok(!has("Dockerfile", "FROM node:22.14.0-alpine AS build\nFROM build AS test\nFROM scratch\nUSER app", "docker-unpinned-image"));
  assert.ok(has("Dockerfile", "FROM node:22\nCMD node a.js", "docker-runs-as-root"));
  assert.ok(!has("Dockerfile", "FROM node:22\nUSER app\nCMD node a.js", "docker-runs-as-root"));
  assert.ok(has("Dockerfile", "FROM node:22\nUSER root\n", "docker-runs-as-root"));
});

test("MCP config: npx -y without a version WARNs", () => {
  const bad = '{"mcpServers":{"a":{"command":"npx","args":["-y","some-mcp-server"]}}}';
  assert.equal(sev(".mcp.json", bad, "mcp-unpinned-npx"), "WARN");
  assert.ok(!has(".mcp.json", '{"mcpServers":{"a":{"command":"npx","args":["-y","some-mcp-server@1.4.2"]}}}', "mcp-unpinned-npx"));
  assert.ok(!has(".mcp.json", '{"mcpServers":{"a":{"command":"node","args":["server.js"]}}}', "mcp-unpinned-npx"));
});

test("suppression needs a reason of 10+ characters and reaches two lines down", () => {
  const ok = "// risk-allow: eval-dynamic -- evaluates a fixed string from our own build step\neval(code)";
  assert.deepEqual(rules(APP, ok), []);
  const short = "// risk-allow: eval-dynamic -- later\neval(code)";
  assert.deepEqual(rules(APP, short), ["suppression-no-reason"]);
  const far = "// risk-allow: eval-dynamic -- a long enough reason here\n\n\n\neval(code)";
  assert.ok(has(APP, far, "eval-dynamic"));
});

test("one rule reports once per line even when it matches twice", () => {
  const twice = "volumes:\n  - /var/run/docker.sock:/var/run/docker.sock";
  assert.equal(scanText("docker-compose.yml", twice).filter((f) => f.rule === "docker-socket-mount").length, 1);
});

test("summarize counts and exit codes", () => {
  const findings = [{ severity: "WARN" }];
  assert.deepEqual(summarize(findings), { fail: 0, warn: 1, exitCode: 0 });
  assert.equal(summarize(findings, { strict: true }).exitCode, 1);
  assert.equal(summarize([{ severity: "FAIL" }]).exitCode, 1);
});

test("scanPaths walks folders, skips node_modules, build dirs unless asked, and rejects missing paths", () => {
  const dir = mkdtempSync(join(tmpdir(), "rs-"));
  try {
    mkdirSync(join(dir, "src"));
    mkdirSync(join(dir, "node_modules"));
    mkdirSync(join(dir, "dist"));
    writeFileSync(join(dir, "src", "a.ts"), "https.get(u, { rejectUnauthorized: false })");
    writeFileSync(join(dir, "node_modules", "b.js"), "rejectUnauthorized: false");
    writeFileSync(join(dir, "dist", "main.js"), `var k = "${fake.stripe}"; rejectUnauthorized: false`);
    const plain = scanPaths([dir]);
    assert.deepEqual(plain.map((f) => f.rule), ["tls-verify-off"]);
    const withBuild = scanPaths([dir], { includeBuild: true });
    assert.deepEqual(withBuild.map((f) => f.rule).sort(), ["hardcoded-secret", "tls-verify-off"]);
    assert.throws(() => scanPaths([join(dir, "nope")]), /path not found/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("cli exits 1 on FAIL, 0 when clean, 2 on bad usage, and prints json", () => {
  const script = fileURLToPath(new URL("./risk-scan.mjs", import.meta.url));
  const dir = mkdtempSync(join(tmpdir(), "rs-cli-"));
  try {
    writeFileSync(join(dir, "bad.ts"), "https.get(u, { rejectUnauthorized: false })");
    writeFileSync(join(dir, "good.ts"), "const x = 1;");
    const bad = spawnSync(process.execPath, [script, join(dir, "bad.ts")], { encoding: "utf8" });
    assert.equal(bad.status, 1);
    assert.match(bad.stdout, /FAIL tls-verify-off/);
    const good = spawnSync(process.execPath, [script, join(dir, "good.ts"), "--json"], { encoding: "utf8" });
    assert.equal(good.status, 0);
    assert.equal(JSON.parse(good.stdout).summary.fail, 0);
    assert.equal(spawnSync(process.execPath, [script], { encoding: "utf8" }).status, 2);
    assert.equal(spawnSync(process.execPath, [script, join(dir, "missing")], { encoding: "utf8" }).status, 2);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a fake key or attack string inside a test file is a WARN, the same line in source stays a FAIL", () => {
  const line = "const k = 'AKIAABCDEFGHIJKLMNOP';\n";
  const inTest = scanText("src/redact.test.ts", line).find((f) => f.rule === "hardcoded-secret");
  const inSrc = scanText("src/redact.ts", line).find((f) => f.rule === "hardcoded-secret");
  assert.equal(inTest.severity, "WARN");
  assert.equal(inSrc.severity, "FAIL");
});

test("a database exec of a SQL string is not a shell command, a shell exec still is", () => {
  const rules = (code) => scanText("src/a.ts", code).map((f) => f.rule);
  assert.ok(!rules("raw.exec('PRAGMA user_version = ' + v)\n").includes("command-injection"));
  assert.ok(rules("exec('rm -rf ' + dir)\n").includes("command-injection"));
});
