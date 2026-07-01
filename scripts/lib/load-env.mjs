/**
 * Minimal .env loader (no dependency). Loads KEY=VALUE lines from a `.env` file
 * in the project root into process.env, without overriding variables that are
 * already set (so GitHub Actions env always wins). Call once at script start.
 */

import fs from "node:fs";
import path from "node:path";

export function loadEnv(rootDir = process.cwd()) {
  const p = path.join(rootDir, ".env");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const s = line.trim();
    if (!s || s.startsWith("#")) continue;
    const eq = s.indexOf("=");
    if (eq === -1) continue;
    const key = s.slice(0, eq).trim();
    let val = s.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}
