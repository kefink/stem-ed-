#!/usr/bin/env node

// Simple dev launcher for FastAPI using uvicorn
// Requirements: Python venv at backend/.venv with uvicorn installed

const { spawn } = require("node:child_process");
const path = require("node:path");

const backendDir = path.join(__dirname, "..", "backend");
const venvPython =
  process.platform === "win32"
    ? path.join(backendDir, ".venv", "Scripts", "python.exe")
    : path.join(backendDir, ".venv", "bin", "python");

const uvicornArgs = [
  "-m",
  "uvicorn",
  "app.main:app",
  "--host",
  "0.0.0.0",
  "--port",
  "8000",
  "--reload",
];

console.log("Starting FastAPI (uvicorn) on http://localhost:8000 ...");
const env = { ...process.env };
const child = spawn(venvPython, uvicornArgs, {
  cwd: backendDir,
  stdio: "inherit",
  env,
  shell: false,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

// Forward signals safely to child without triggering Windows "Terminate batch job" prompt
const onSignal = (signal) => {
  if (child && !child.killed) {
    try {
      child.kill(signal);
    } catch {}
  }
};

process.on("SIGINT", () => onSignal("SIGINT"));
process.on("SIGTERM", () => onSignal("SIGTERM"));
