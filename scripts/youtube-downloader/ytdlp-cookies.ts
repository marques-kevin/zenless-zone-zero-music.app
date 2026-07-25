import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

let resolvedCookiesFile: string | null | undefined;

function normalizeCookieContent(content: string): string {
  return content.replace(/\\n/g, "\n").trimEnd() + "\n";
}

export async function resolveYtdlpCookiesFile(): Promise<string | null> {
  if (resolvedCookiesFile !== undefined) {
    return resolvedCookiesFile;
  }

  const explicitFile = process.env.YTDLP_COOKIES_FILE?.trim();
  if (explicitFile) {
    resolvedCookiesFile = explicitFile;
    return explicitFile;
  }

  const content = process.env.YTDLP_COOKIES_CONTENT?.trim();
  if (content) {
    const dir = join(process.cwd(), "secrets");
    const filePath = join(dir, "youtube-cookies.txt");

    await mkdir(dir, { recursive: true });
    await writeFile(filePath, normalizeCookieContent(content), {
      mode: 0o600,
    });

    resolvedCookiesFile = filePath;
    return filePath;
  }

  resolvedCookiesFile = null;
  return null;
}

export async function getYtdlpExtraArgs(): Promise<string[]> {
  const args: string[] = [];

  const js_runtime = process.env.YTDLP_JS_RUNTIME?.trim() || "node";
  args.push("--js-runtimes", js_runtime);

  const cookies_file = await resolveYtdlpCookiesFile();
  if (cookies_file) {
    args.push("--cookies", cookies_file);
    return args;
  }

  const browser = process.env.YTDLP_COOKIES_BROWSER?.trim();
  if (browser) {
    args.push("--cookies-from-browser", browser);
  }

  return args;
}
