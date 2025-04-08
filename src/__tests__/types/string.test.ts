import { Str } from "../../types/string";

describe("Str", () => {
  it("should unwrap to original value", () => {
    const s = Str.fromRaw("hello");
    expect(s.unwrap()).toBe("hello");
  });

  it("should convert to upper case", () => {
    const s = Str.fromRaw("hello").toUpperCase();
    expect(s.unwrap()).toBe("HELLO");
  });

  it("should convert to lower case", () => {
    const s = Str.fromRaw("HELLO").toLowerCase();
    expect(s.unwrap()).toBe("hello");
  });

  it("should return correct length", () => {
    const s = Str.fromRaw("abc");
    expect(s.len()).toBe(3);
  });

  it("should return true for empty string", () => {
    const s = Str.fromRaw("");
    expect(s.isEmpty()).toBe(true);
  });

  it("should return false for non-empty string", () => {
    const s = Str.fromRaw("abc");
    expect(s.isEmpty()).toBe(false);
  });

  it("should trim whitespace", () => {
    const s = Str.fromRaw("  hello  ").trim();
    expect(s.unwrap()).toBe("hello");
  });

  it("should compare equal strings", () => {
    const a = Str.fromRaw("abc");
    const b = Str.fromRaw("abc");
    expect(a.equals(b)).toBe(true);
  });

  it("should compare unequal strings", () => {
    const a = Str.fromRaw("abc");
    const b = Str.fromRaw("xyz");
    expect(a.equals(b)).toBe(false);
  });

  it("should sort strings correctly", () => {
    const a = Str.fromRaw("abc");
    const b = Str.fromRaw("xyz");
    const c = Str.fromRaw("abc");

    expect(a.compare(b)).toBeLessThan(0);
    expect(b.compare(a)).toBeGreaterThan(0);
    expect(a.compare(c)).toBe(0);
  });

  it("should detect substrings correctly", () => {
    const s = Str.fromRaw("the quick brown fox");
    expect(s.contains("quick")).toBe(true);
    expect(s.contains("slow")).toBe(false);
  });

  it("should return raw string with toString()", () => {
    const s = Str.fromRaw("hello");
    expect(s.toString()).toBe("hello");
  });

  it("should serialize to JSON string", () => {
    const s = Str.fromRaw("hello");
    expect(s.toJSON()).toBe(JSON.stringify("hello"));
  });

  it("should behave correctly with diverse unicode characters", () => {
    const inputs = ["🚀 Rocket", "你好", "Здравствуйте", "مرحبا", "😊👍"];
    for (const input of inputs) {
      const str = Str.fromRaw(input);
      expect(str.unwrap()).toBe(input);
      expect(str.len()).toBe(input.length);
      expect(str.trim().unwrap()).toBe(input.trim());
    }
  });

  it("should handle long and randomized inputs consistently", () => {
    const randomString = Array.from({ length: 1000 }, () =>
      String.fromCharCode(32 + Math.floor(Math.random() * 95))
    ).join("");

    const str = Str.fromRaw(randomString);
    expect(str.unwrap()).toBe(randomString);
    expect(str.toUpperCase().unwrap()).toBe(randomString.toUpperCase());
    expect(str.toLowerCase().unwrap()).toBe(randomString.toLowerCase());
    expect(str.trim().unwrap()).toBe(randomString.trim());
  });

  it("should handle grapheme clusters and ZWJ emojis correctly", () => {
    const inputs = ["👨‍👩‍👧‍👦", "👩🏽‍🚀", "🇺🇳", "‍‍‍", "👨‍❤️‍💋‍👨"];

    for (const emoji of inputs) {
      const str = Str.fromRaw(emoji);
      expect(str.unwrap()).toBe(emoji);
      expect(str.len()).toBe(emoji.length);
    }
  });

  it("should handle surrogate pairs and non-BMP characters", () => {
    const highSurrogateChars = ["𐍈", "𝌆", "🀄", "💯"];

    for (const ch of highSurrogateChars) {
      const s = Str.fromRaw(ch);
      expect(s.unwrap()).toBe(ch);
      expect(s.len()).toBe(ch.length);
    }
  });

  it("should correctly process RTL scripts", () => {
    const arabic = "مرحبا";
    const hebrew = "שָׁלוֹם";

    for (const word of [arabic, hebrew]) {
      const s = Str.fromRaw(word);
      expect(s.unwrap()).toBe(word);
      expect(s.len()).toBe(word.length);
      expect(s.toUpperCase().unwrap().length).toBeGreaterThan(0);
    }
  });

  it("should trim whitespace including unicode spaces", () => {
    const withSpaces = "\u2002\u2003\u2009 Hello \u2009\u2002";
    const trimmed = "Hello";

    const s = Str.fromRaw(withSpaces.trim());
    expect(s.unwrap()).toBe(trimmed);
  });

  function randomUnicodeChar(): string {
    const ranges = [
      [0x0020, 0x007e],
      [0x00a0, 0x00ff],
      [0x0400, 0x04ff],
      [0x0600, 0x06ff],
      [0x0900, 0x097f],
      [0x1f300, 0x1f64f],
    ];
    const [start, end] = ranges[Math.floor(Math.random() * ranges.length)];
    return String.fromCodePoint(
      start + Math.floor(Math.random() * (end - start))
    );
  }

  function randomUnicodeString(length = 30): string {
    return Array.from({ length }, () => randomUnicodeChar()).join("");
  }

  it("stress: should match JS behavior for random unicode strings", () => {
    for (let i = 0; i < 500; i++) {
      const raw = randomUnicodeString();
      const s = Str.fromRaw(raw);

      expect(s.unwrap()).toBe(raw);
      expect(s.toLowerCase().unwrap()).toBe(raw.toLowerCase());
      expect(s.toUpperCase().unwrap()).toBe(raw.toUpperCase());
      expect(s.len()).toBe(raw.length);
      expect(s.trim().unwrap()).toBe(raw.trim());
    }
  });
});
