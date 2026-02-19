#!/usr/bin/env node
/**
 * Railway start: retry migration (Postgres bazen geç ayağa kalkıyor), sonra sunucuyu başlat.
 * ECONNREFUSED alıyorsanız: Backend Variables'da DATABASE_URL = ${{Postgres.DATABASE_PRIVATE_URL}} kullanın.
 */
import { execSync, spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MAX_ATTEMPTS = 5;
const DELAY_MS = 5000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function runMigrate() {
  const cwd = path.resolve(__dirname, "..");
  try {
    const out = execSync("npm run db:migrate", {
      encoding: "utf8",
      cwd,
      stdio: "pipe",
      maxBuffer: 2 * 1024 * 1024,
    });
    if (process.env.NODE_ENV !== "production") console.log(out);
  } catch (err) {
    const out = [err.stdout, err.stderr].filter(Boolean).join("\n");
    if (out) console.error(out);
    const e = new Error(err.message || "Migration failed");
    e.econnrefused = out.includes("ECONNREFUSED");
    throw e;
  }
}

async function main() {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      runMigrate();
      lastError = null;
      break;
    } catch (err) {
      lastError = err;
      const isRefused = err.econnrefused || (err.message && err.message.includes("ECONNREFUSED"));
      if (attempt < MAX_ATTEMPTS) {
        console.error(
          `[railway-start] Migration attempt ${attempt}/${MAX_ATTEMPTS} failed. Retrying in ${DELAY_MS / 1000}s...`
        );
        if (isRefused) {
          console.error(
            "[railway-start] ECONNREFUSED = Database not reachable. On Railway, set DATABASE_URL to ${{Postgres.DATABASE_PRIVATE_URL}} (private URL)."
          );
        }
        await sleep(DELAY_MS);
      } else {
        console.error(
          "[railway-start] Migration failed after",
          MAX_ATTEMPTS,
          "attempts. Deploy aborted (migration is required)."
        );
        if (isRefused) {
          console.error(
            "\n>>> FIX: Backend container cannot reach Postgres (ECONNREFUSED).\n    Railway Dashboard → Backend service → Variables → set DATABASE_URL = Reference from Postgres → DATABASE_PRIVATE_URL (not DATABASE_URL/DATABASE_PUBLIC_URL).\n    Private URL is required for container-to-database connection.\n"
          );
        }
        process.exit(1);
      }
    }
  }

  // Start the server (replace current process so it gets PID 1 and signals)
  const child = spawn("npm", ["start"], {
    stdio: "inherit",
    cwd: path.resolve(__dirname, ".."),
    shell: true,
  });
  child.on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

main();
