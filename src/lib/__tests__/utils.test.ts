import { cn, formatTime, addHash, removeHash } from "../utils";
import { expect, describe, it, beforeEach } from "vitest";

describe("formatTime", () => {
  it("should format seconds to MM:SS", () => {
    expect(formatTime(61)).toBe("01:01");
    expect(formatTime(3600)).toBe("60:00");
    expect(formatTime(0)).toBe("00:00");
  });

  it("should pad single digits with leading zeros", () => {
    expect(formatTime(5)).toBe("00:05");
    expect(formatTime(65)).toBe("01:05");
  });
});

describe("addHash", () => {
  it("should add hash when none exists", () => {
    expect(addHash({ path: "test" })).toBe("#test");
    expect(addHash({ path: "#test" })).toBe("#test");
  });

  it("should append hash to existing hash", () => {
    expect(addHash({ path: "test", currentHash: "#existing" })).toBe(
      "#existing&test"
    );

    expect(addHash({ path: "#test", currentHash: "#existing" })).toBe(
      "#existing&test"
    );
  });

  it("should not add hash if it already exists", () => {
    expect(addHash({ path: "test", currentHash: "#test" })).toBe("#test");
    expect(addHash({ path: "#test", currentHash: "#test" })).toBe("#test");
    expect(addHash({ path: "test", currentHash: "#one&test" })).toBe(
      "#one&test"
    );
  });
});

describe("removeHash", () => {
  it("should return empty string when no hash exists", () => {
    expect(removeHash({ path: "test" })).toBe("");
  });

  it("should remove hash fragment", () => {
    expect(removeHash({ path: "two", currentHash: "#one&two&three" })).toBe(
      "#one&three"
    );
  });

  it("should handle hash with # prefix", () => {
    expect(removeHash({ path: "#one", currentHash: "#one&two" })).toBe("#two");
  });

  it("should return # string when removing last fragment", () => {
    expect(removeHash({ path: "test", currentHash: "#test" })).toBe("#");
  });
});
