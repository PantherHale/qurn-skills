import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { kindsOf, matchBrace, scanPaths, scanText, summarize } from "./perf-scan.mjs";

const rules = (file, text) => scanText(file, text).map((f) => f.rule);
const has = (file, text, rule) => rules(file, text).includes(rule);
const sev = (file, text, rule) => scanText(file, text).find((f) => f.rule === rule)?.severity;

test("kindsOf classifies files and skips the scanner's own files", () => {
  assert.ok(kindsOf("a.ts").has("js"));
  assert.ok(kindsOf("a.py").has("py"));
  assert.ok(kindsOf("m/001.sql").has("sql"));
  assert.ok(kindsOf("a.html").has("markup") && kindsOf("a.html").has("css"));
  assert.ok(kindsOf("a.css").has("css"));
  assert.equal(kindsOf("README.md").size, 0);
  assert.equal(kindsOf("perf-scan.mjs").size, 0);
  assert.equal(kindsOf("perf-scan.test.mjs").size, 0);
});

test("matchBrace skips braces in strings and comments", () => {
  const text = "{ const a = '}'; // }\n /* } */ const b = `}`; }";
  assert.equal(matchBrace(text, 0), text.length);
});

test("N+1 in JS loops: for, while, map(async), forEach(async)", () => {
  assert.equal(sev("a.ts", "for (const u of users) {\n  const p = await db.query('x', [u.id]);\n}", "n-plus-one"), "WARN");
  assert.ok(has("a.ts", "for (let i = 0; i < n; i++) {\n await prisma.user.findUnique({ where: { id: i } });\n}", "n-plus-one"));
  assert.ok(has("a.ts", "while (cur) {\n  cur = await fetch(cur.next);\n}", "n-plus-one"));
  assert.ok(has("a.ts", "const r = await Promise.all(ids.map(async (id) => {\n  return await repo.findById(id);\n}));", "n-plus-one"));
  assert.ok(has("a.ts", "items.forEach(async (i) => {\n await axios.get('/x/' + i);\n});", "n-plus-one"));
  assert.ok(!has("a.ts", "for (const u of users) {\n  total += u.price;\n}", "n-plus-one"));
  assert.ok(!has("a.ts", "const rows = await db.query('select 1 where id = ANY($1)', [ids]);\nfor (const r of rows) {\n  out.push(r);\n}", "n-plus-one"));
});

test("N+1 in Python loops", () => {
  assert.ok(has("a.py", "for u in users:\n    p = Profile.objects.get(user=u)\n    out.append(p)\n", "n-plus-one"));
  assert.ok(has("a.py", "for i in ids:\n    cur.execute('select 1 where id = ?', (i,))\n", "n-plus-one"));
  assert.ok(has("a.py", "for u in urls:\n    # fetch\n\n    r = requests.get(u)\n", "n-plus-one"));
  assert.ok(!has("a.py", "for u in users:\n    total += u.price\nrows = cur.execute('select 1')\n", "n-plus-one"));
});

test("python: blocking calls inside async def", () => {
  assert.equal(sev("a.py", "async def h():\n    time.sleep(1)\n", "async-blocking-call"), "WARN");
  assert.ok(has("a.py", "async def h():\n    r = requests.get('http://x')\n    return r\n", "async-blocking-call"));
  assert.ok(!has("a.py", "def h():\n    time.sleep(1)\n", "async-blocking-call"));
  assert.ok(!has("a.py", "async def h():\n    await asyncio.sleep(1)\n\ndef g():\n    time.sleep(1)\n", "async-blocking-call"));
});

test("query shape: select star and unbounded findMany", () => {
  assert.ok(has("a.ts", "db.query('SELECT * FROM users')", "select-star"));
  assert.ok(has("a.sql", "select * from users;", "select-star"));
  assert.ok(!has("a.ts", "db.query('SELECT id, name FROM users')", "select-star"));
  assert.ok(has("a.ts", "await prisma.user.findMany()", "unbounded-query"));
  assert.ok(has("a.ts", "await prisma.user.findMany({ where: { active: true } })", "unbounded-query"));
  assert.ok(!has("a.ts", "await prisma.user.findMany({ where: { a: 1 }, take: 50 })", "unbounded-query"));
});

test("sync IO only matters in request-serving files", () => {
  assert.ok(has("a.ts", "app.get('/x', (req, res) => { res.send(fs.readFileSync('f')) })", "sync-io-in-handler"));
  assert.ok(has("route.ts", "export async function GET() { return new Response(readFileSync('f')) }", "sync-io-in-handler"));
  assert.ok(!has("build.mjs", "const t = readFileSync('f'); console.log(t)", "sync-io-in-handler"));
});

test("heavy imports and JSON deep clone", () => {
  assert.ok(has("a.ts", "import moment from 'moment';", "heavy-import"));
  assert.ok(has("a.js", "const _ = require('lodash');", "heavy-import"));
  assert.ok(has("a.ts", "import $ from \"jquery\"", "heavy-import"));
  assert.ok(!has("a.ts", "import debounce from 'lodash/debounce';", "heavy-import"));
  assert.ok(!has("a.ts", "import { format } from 'date-fns';", "heavy-import"));
  assert.ok(has("a.ts", "const c = JSON.parse(JSON.stringify(obj));", "json-deep-clone"));
  assert.ok(!has("a.ts", "const c = structuredClone(obj);", "json-deep-clone"));
});

test("volatile system prompt breaks the prompt cache", () => {
  const code = "import Anthropic from '@anthropic-ai/sdk';\nconst system = `You are helpful. Now: ${new Date().toISOString()}`;";
  assert.ok(has("a.ts", code, "volatile-system-prompt"));
  assert.ok(has("a.py", "import anthropic\nsystem_prompt = f'Date {datetime.now()}'\n", "volatile-system-prompt"));
  const multi = "import Anthropic from '@anthropic-ai/sdk';\nconst system = [\n  { type: 'text', text: `Today is ${new Date().toISOString()}.` },\n  { type: 'text', text: handbook },\n];\nawait client.messages.create({ system, messages });";
  assert.ok(has("a.ts", multi, "volatile-system-prompt"));
  const safe = "import Anthropic from '@anthropic-ai/sdk';\nconst system = [\n  { type: 'text', text: 'You are helpful.' },\n];\nconst messages = [{ role: 'user', content: `Today is ${new Date()}` }];";
  assert.ok(!has("a.ts", safe, "volatile-system-prompt"));
  assert.ok(!has("a.ts", "import Anthropic from '@anthropic-ai/sdk';\nconst system = 'You are helpful.';\nconst t = Date.now();", "volatile-system-prompt"));
  assert.ok(!has("a.ts", "const system = `Now ${new Date()}`;", "volatile-system-prompt"));
});

test("PostgreSQL schema smells in .sql and in code strings with CREATE TABLE", () => {
  const sql = "CREATE TABLE t (\n  id serial PRIMARY KEY,\n  created timestamp NOT NULL,\n  price money,\n  code char(3),\n  name varchar(80)\n);";
  const found = rules("m.sql", sql);
  for (const r of ["pg-serial", "pg-timestamp-without-tz", "pg-money", "pg-char-n"]) assert.ok(found.includes(r), r);
  assert.equal(scanText("m.sql", sql).filter((f) => f.rule === "pg-char-n").length, 2);
  assert.ok(!has("m.sql", "CREATE TABLE t (\n  id bigint GENERATED ALWAYS AS IDENTITY,\n  at timestamptz NOT NULL,\n  note text\n);", "pg-timestamp-without-tz"));
  assert.ok(!has("m.sql", "CREATE TABLE t (\n  at timestamp with time zone,\n  id bigint\n);", "pg-timestamp-without-tz"));
  assert.ok(has("db.ts", "await db.query(`CREATE TABLE t (id serial, at timestamp)`)", "pg-serial"));
  assert.ok(!has("db.ts", "const s = 'serial number';", "pg-serial"));
  assert.ok(has("m.sql", "SELECT a FROM t WHERE a NOT IN (SELECT b FROM u);", "pg-not-in-subquery"));
  assert.ok(!has("m.sql", "SELECT a FROM t WHERE NOT EXISTS (SELECT 1 FROM u WHERE b = a);", "pg-not-in-subquery"));
});

test("CREATE INDEX needs CONCURRENTLY on live tables", () => {
  assert.equal(sev("m.sql", "CREATE INDEX idx ON t (a);", "pg-index-not-concurrent"), "WARN");
  assert.ok(has("m.sql", "create unique index idx on t (a);", "pg-index-not-concurrent"));
  assert.ok(!has("m.sql", "CREATE INDEX CONCURRENTLY idx ON t (a);", "pg-index-not-concurrent"));
});

test("SQLite connections should set WAL, foreign keys and a busy timeout", () => {
  assert.ok(has("a.py", "conn = sqlite3.connect('app.db')\n", "sqlite-pragmas"));
  assert.ok(has("a.ts", "const db = new Database('app.db');", "sqlite-pragmas"));
  const good = "import sqlite3\nconn = sqlite3.connect('a.db')\nconn.execute('PRAGMA journal_mode=WAL')\nconn.execute('PRAGMA foreign_keys=ON')\nconn.execute('PRAGMA busy_timeout=5000')\n";
  assert.ok(!has("a.py", good, "sqlite-pragmas"));
  assert.ok(has("a.py", "import sqlite3\nconn = sqlite3.connect('a.db')\nconn.execute('PRAGMA journal_mode=WAL')\n", "sqlite-pragmas"));
  assert.ok(!has("a.py", "x = 1", "sqlite-pragmas"));
});

test("web vitals: lazy LCP image FAILs, missing dimensions and fonts and scripts WARN", () => {
  assert.equal(sev("a.html", '<img src="hero.jpg" fetchpriority="high" loading="lazy" width="800" height="400">', "lazy-lcp-image"), "FAIL");
  assert.ok(has("a.tsx", "<img src={h} loading=\"lazy\" fetchPriority=\"high\" />", "lazy-lcp-image"));
  assert.ok(!has("a.html", '<img src="hero.jpg" fetchpriority="high" width="800" height="400">', "lazy-lcp-image"));
  assert.ok(has("a.html", '<img src="a.jpg">', "img-no-dimensions"));
  assert.ok(has("a.html", '<img src="a.jpg" width="10">', "img-no-dimensions"));
  assert.ok(!has("a.html", '<img src="a.jpg" width="10" height="10">', "img-no-dimensions"));
  assert.ok(!has("a.tsx", "<img {...props} />", "img-no-dimensions"));
  assert.ok(!has("a.html", '<img src="a.jpg" style="aspect-ratio: 4/3">', "img-no-dimensions"));
  assert.ok(has("a.css", "@font-face { font-family: X; src: url(x.woff2); }", "font-display"));
  assert.ok(has("a.css", "@font-face { font-family: X; font-display: block; src: url(x.woff2); }", "font-display"));
  assert.ok(!has("a.css", "@font-face { font-family: X; font-display: swap; src: url(x.woff2); }", "font-display"));
  assert.ok(has("a.html", "<html><head><script src=\"a.js\"></script></head><body></body></html>", "blocking-script"));
  assert.ok(!has("a.html", "<html><head><script src=\"a.js\" defer></script></head></html>", "blocking-script"));
  assert.ok(!has("a.html", "<html><head></head><body><script src=\"a.js\"></script></body></html>", "blocking-script"));
  assert.ok(!has("a.html", "<html><head><script type=\"module\" src=\"a.js\"></script></head></html>", "blocking-script"));
});

test("one rule reports once per line; suppression needs a reason", () => {
  assert.equal(scanText("a.ts", "const a = JSON.parse(JSON.stringify(x)), b = JSON.parse(JSON.stringify(y));").filter((f) => f.rule === "json-deep-clone").length, 1);
  const ok = "// perf-allow: json-deep-clone -- tiny config object, measured at 2 microseconds\nconst c = JSON.parse(JSON.stringify(o));";
  assert.deepEqual(rules("a.ts", ok), []);
  const short = "// perf-allow: json-deep-clone -- later\nconst c = JSON.parse(JSON.stringify(o));";
  assert.deepEqual(rules("a.ts", short), ["suppression-no-reason"]);
});

test("summarize counts and exit codes", () => {
  const w = [{ severity: "WARN" }];
  assert.deepEqual(summarize(w), { fail: 0, warn: 1, exitCode: 0 });
  assert.equal(summarize(w, { strict: true }).exitCode, 1);
  assert.equal(summarize([{ severity: "FAIL" }]).exitCode, 1);
});

test("scanPaths walks folders, skips node_modules, rejects missing paths; cli exit codes", () => {
  const dir = mkdtempSync(join(tmpdir(), "ps-"));
  try {
    mkdirSync(join(dir, "src"));
    mkdirSync(join(dir, "node_modules"));
    writeFileSync(join(dir, "src", "a.ts"), "const c = JSON.parse(JSON.stringify(o));");
    writeFileSync(join(dir, "node_modules", "b.ts"), "const c = JSON.parse(JSON.stringify(o));");
    writeFileSync(join(dir, "src", "bad.html"), '<img src="hero.jpg" fetchpriority="high" loading="lazy" width="1" height="1">');
    assert.equal(scanPaths([dir]).length, 2);
    assert.throws(() => scanPaths([join(dir, "nope")]), /path not found/);
    const script = fileURLToPath(new URL("./perf-scan.mjs", import.meta.url));
    const bad = spawnSync(process.execPath, [script, join(dir, "src", "bad.html")], { encoding: "utf8" });
    assert.equal(bad.status, 1);
    assert.match(bad.stdout, /FAIL lazy-lcp-image/);
    const warnOnly = spawnSync(process.execPath, [script, join(dir, "src", "a.ts"), "--json"], { encoding: "utf8" });
    assert.equal(warnOnly.status, 0);
    assert.equal(JSON.parse(warnOnly.stdout).summary.warn, 1);
    assert.equal(spawnSync(process.execPath, [script, join(dir, "src", "a.ts"), "--strict"], { encoding: "utf8" }).status, 1);
    assert.equal(spawnSync(process.execPath, [script], { encoding: "utf8" }).status, 2);
    assert.equal(spawnSync(process.execPath, [script, join(dir, "missing")], { encoding: "utf8" }).status, 2);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
