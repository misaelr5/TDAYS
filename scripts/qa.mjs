import { spawn } from "node:child_process";
import { closeSync, mkdirSync, openSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { resolve } from "node:path";

const [command = "test", ...args] = process.argv.slice(2);
const port = Number(process.env.RECREAR_TEST_PORT ?? 3211);
if (!Number.isInteger(port) || port < 1024 || port > 65535 || port === 3210) {
  throw new Error("RECREAR_TEST_PORT debe ser un puerto de 1024 a 65535 distinto de 3210.");
}
const env = { ...process.env, RECREAR_QA: "1", RECREAR_TEST_PORT: String(port) };
const next = resolve("node_modules/next/dist/bin/next");
function run(file, parameters, nodeArguments = []) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(process.execPath, [...nodeArguments, file, ...parameters], { env, stdio: "inherit", windowsHide: true });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolveRun();
      else reject(new Error(`${file} terminó con ${signal ?? code}.`));
    });
  });
}

if (command === "serve") {
  await run(next, ["start", "--hostname", "127.0.0.1", "--port", String(port)]);
} else if (command === "test" || command === "build") {
  mkdirSync("output/playwright", { recursive: true });
  const lockPath = "output/playwright/qa.lock";
  const lock = openSync(lockPath, "wx");
  const release = () => { closeSync(lock); unlinkSync(lockPath); };
  process.once("exit", release);
  try {
    // Fail before building if another process owns this port. Never reuse or stop it.
    await new Promise((resolvePort, reject) => {
      const probe = createServer();
      probe.once("error", reject);
      probe.listen(port, "127.0.0.1", () => probe.close(resolvePort));
    });
    const envPath = "next-env.d.ts";
    const previous = readFileSync(envPath);
    try {
      await run(resolve("scripts/verify-baselines.mjs"), []);
      await run(resolve("scripts/verify-media.mjs"), [], ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON"]);
      await run(next, ["build"]);
    } finally {
      // Next writes this shared file even with a separate distDir/tsconfig.
      // Run builds/type generation sequentially; restore the exact previous bytes.
      writeFileSync(envPath, previous);
    }
    if (command === "test") {
      try {
        await run(resolve("node_modules/@playwright/test/cli.js"), ["test", ...args]);
      } finally {
        await run(resolve("scripts/verify-baselines.mjs"), []);
      }
    }
  } finally {
    process.removeListener("exit", release);
    release();
  }
} else {
  throw new Error(`Comando QA desconocido: ${command}`);
}
