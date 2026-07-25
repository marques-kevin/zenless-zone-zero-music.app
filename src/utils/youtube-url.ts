const YOUTUBE_HOSTS = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"];

export function normalize_youtube_url(raw_url: string): string | null {
  const trimmed = raw_url.trim();
  if (!trimmed) return null;

  try {
    const with_protocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(with_protocol);
    const hostname = parsed.hostname.replace(/^www\./, "");

    if (!YOUTUBE_HOSTS.some((host) => hostname === host.replace(/^www\./, ""))) {
      return null;
    }

    let video_id: string | null = null;

    if (hostname === "youtu.be") {
      video_id = parsed.pathname.split("/").filter(Boolean)[0] || null;
    } else if (parsed.pathname.startsWith("/watch")) {
      video_id = parsed.searchParams.get("v");
    } else if (parsed.pathname.startsWith("/shorts/")) {
      video_id = parsed.pathname.split("/").filter(Boolean)[1] || null;
    }

    if (!video_id) return null;

    return `https://www.youtube.com/watch?v=${video_id}`;
  } catch {
    return null;
  }
}

export function parse_youtube_urls_from_text(text: string): {
  valid_urls: string[];
  invalid_lines: string[];
} {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const valid_urls: string[] = [];
  const invalid_lines: string[] = [];

  for (const line of lines) {
    const normalized = normalize_youtube_url(line);
    if (normalized) {
      valid_urls.push(normalized);
    } else {
      invalid_lines.push(line);
    }
  }

  return {
    valid_urls: [...new Set(valid_urls)],
    invalid_lines,
  };
}

export function encode_url_as_firestore_doc_id(url: string): string {
  return btoa(url).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decode_url_from_firestore_doc_id(doc_id: string): string {
  const base64 = doc_id.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
}
