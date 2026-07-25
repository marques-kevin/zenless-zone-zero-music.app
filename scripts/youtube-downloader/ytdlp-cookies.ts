import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

let resolvedCookiesFile: string | null | undefined;

const NETSCAPE_COOKIE_HEADER = "# Netscape HTTP Cookie File";
const COOKIE_LINE_SPLIT =
  / (?=\.?[a-zA-Z0-9][^\t]*\t(?:TRUE|FALSE)\t)/;

function stripCookieHeader(content: string): string {
  if (!content.startsWith(NETSCAPE_COOKIE_HEADER)) {
    return content;
  }

  return content.slice(NETSCAPE_COOKIE_HEADER.length).trimStart();
}

function stripInlineComments(body: string): string {
  return body.replace(/# [^\t]+?(?=\s+\.)/g, "").trim();
}

function parseCookieLines(body: string): string[] {
  const trimmed = stripInlineComments(body.trim());

  if (!trimmed) {
    return [];
  }

  const lines = trimmed.includes("\n")
    ? trimmed.split("\n")
    : trimmed.split(COOKIE_LINE_SPLIT);

  return lines
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .filter((line) => line.split("\t").length >= 7);
}

function normalizeCookieContent(content: string): string {
  const normalized = content.replace(/\\n/g, "\n").trimEnd();

  if (!normalized) {
    return "";
  }

  const cookie_lines = parseCookieLines(stripCookieHeader(normalized));

  if (cookie_lines.length === 0) {
    return `${NETSCAPE_COOKIE_HEADER}\n`;
  }

  return `${NETSCAPE_COOKIE_HEADER}\n${cookie_lines.join("\n")}\n`;
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
