import { spawn } from "child_process";

export const ytdlpBin = "yt-dlp";

export async function runCommand(
  cmd: string,
  args: string[],
  options: { silent?: boolean } = {}
): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: options.silent ? "ignore" : "inherit",
    });

    child.on("error", (err) => {
      reject(err);
    });

    child.on("close", (code) => {
      resolve(code ?? 1);
    });
  });
}

export async function runCommandCapture(
  cmd: string,
  args: string[]
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args);
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data: Buffer) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data: Buffer) => {
      stderr += data.toString();
    });

    child.on("error", (err) => {
      reject(err);
    });

    child.on("close", (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

export async function requireCmd(cmd: string) {
  try {
    const code = await runCommand(cmd, ["--version"], { silent: true });
    if (code !== 0) {
      throw new Error();
    }
  } catch {
    console.error(`Error: '${cmd}' is not installed or not in PATH.`);
    process.exit(1);
  }
}

export async function ytdlpPrint(
  targetUrl: string,
  printFormat: string
): Promise<string> {
  const { code, stdout, stderr } = await runCommandCapture(ytdlpBin, [
    "--flat-playlist",
    "--print",
    printFormat,
    targetUrl,
  ]);

  if (code !== 0) {
    if (stderr.trim()) {
      console.error(stderr.trim());
    }
    throw new Error(`yt-dlp failed for ${targetUrl}`);
  }

  return stdout;
}
