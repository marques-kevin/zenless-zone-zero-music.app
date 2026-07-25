import { describe, expect, it } from "vitest";
import {
  encode_url_as_firestore_doc_id,
  decode_url_from_firestore_doc_id,
  normalize_youtube_url,
  parse_youtube_urls_from_text,
} from "../youtube-url";

describe("youtube-url utils", () => {
  it("normalizes youtube watch urls", () => {
    expect(
      normalize_youtube_url("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  });

  it("normalizes youtu.be urls", () => {
    expect(normalize_youtube_url("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );
  });

  it("normalizes shorts urls", () => {
    expect(
      normalize_youtube_url("https://www.youtube.com/shorts/dQw4w9WgXcQ")
    ).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  });

  it("rejects invalid urls", () => {
    expect(normalize_youtube_url("https://example.com")).toBeNull();
    expect(normalize_youtube_url("not-a-url")).toBeNull();
  });

  it("parses multiple lines and deduplicates", () => {
    const result = parse_youtube_urls_from_text(
      "https://youtu.be/dQw4w9WgXcQ\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ\ninvalid"
    );

    expect(result.valid_urls).toEqual([
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    ]);
    expect(result.invalid_lines).toEqual(["invalid"]);
  });

  it("encodes and decodes firestore doc ids", () => {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const doc_id = encode_url_as_firestore_doc_id(url);

    expect(doc_id).not.toContain("/");
    expect(decode_url_from_firestore_doc_id(doc_id)).toBe(url);
  });
});
