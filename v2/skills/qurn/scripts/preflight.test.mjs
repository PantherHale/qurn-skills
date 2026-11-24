import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { preflight } from "./preflight.mjs";

function project(files) {
  const root = mkdtempSync(join(tmpdir(), "pf-"));
  for (const [p, t] of Object.entries(files)) {
    mkdirSync(dirname(join(root, p)), { recursive: true });
    writeFileSync(join(root, p), t);
  }
  return root;
}
const rules = (fs) => fs.map((f) => f.rule);

test("an undocumented public build variable is a FAIL", () => {
  const r = project({ "src/api.ts": "const u = import.meta.env.VITE_API_URL;\n" });
  const f = preflight(r).find((x) => x.rule === "env-undocumented");
  assert.equal(f.level, "FAIL");
});

test("a documented variable is fine; an undocumented private one is only a WARN", () => {
  const r = project({ "a.js": "process.env.VITE_X; process.env.SECRET_KEY;\n", ".env.example": "VITE_X=\n" });
  const fs = preflight(r);
  assert.ok(!fs.some((x) => x.msg.startsWith("VITE_X")));
  assert.equal(fs.find((x) => x.msg.startsWith("SECRET_KEY")).level, "WARN");
});

test("a workflow that builds without passing the variable fails", () => {
  const r = project({
    "a.js": "process.env.APP_API_URL;\n",
    ".env.example": "APP_API_URL=\n",
    ".github/workflows/release.yml": "jobs:\n  b:\n    steps:\n      - run: npm run build\n",
  });
  assert.ok(rules(preflight(r)).includes("ci-var-not-passed"));
  const ok = project({
    "a.js": "process.env.APP_API_URL;\n",
    ".env.example": "APP_API_URL=\n",
    ".github/workflows/release.yml": "jobs:\n  b:\n    steps:\n      - run: npm run build\n        env:\n          APP_API_URL: ${{ secrets.APP_API_URL }}\n",
  });
  assert.ok(!rules(preflight(ok)).includes("ci-var-not-passed"));
});

test("a hosted server literal warns, a comment does not", () => {
  const r = project({ "a.js": 'const base = "https://shop.pythonanywhere.com/api";\n// https://x.herokuapp.com\n' });
  assert.equal(rules(preflight(r)).filter((x) => x === "hosted-url-literal").length, 1);
});

test("test files are ignored and a suppression with a reason works", () => {
  const r = project({
    "a.test.js": "process.env.VITE_ONLY_IN_TEST;\n",
    "b.js": "// preflight-ignore: set by the host at runtime\nprocess.env.VITE_HOSTED;\n",
  });
  assert.deepEqual(preflight(r), []);
});

test("a docker compose file gives a service warning", () => {
  const r = project({ "docker-compose.yml": "services: {}\n" });
  assert.ok(rules(preflight(r)).includes("service-dependency"));
});
