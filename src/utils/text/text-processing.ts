import { Result, Ok, Err } from "../../core";
import { Option } from "../../core/option";
import { isWasmInitialized, getWasmModule } from "../../initWasm/init";
import { callWasmStaticMethod } from "../../initWasm/lib";
import { Str, Vec } from "../../types";
import { initWasm } from "../../ui";

export interface FrequencyAnalysisResult {
  [key: string]: number;
}

export interface DateMatch {
  text: string;
  index: number;
}

export interface EntityExtractionResult {
  emails: string[];
  urls: string[];
  phones: string[];
  hashtags: string[];
  mentions: string[];
}

export interface KeywordResult {
  word: string;
  count: number;
}

export class TextProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TextProcessingError";
  }
}

export class TextProcessing {
  private static _useWasm: boolean = true;

  private static get useWasm(): boolean {
    return TextProcessing._useWasm && isWasmInitialized();
  }

  static async initialize(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(`WASM initialization failed: ${error}`);
        TextProcessing._useWasm = false;
      }
    }
  }

  static wordCount(text: string): number {
    if (TextProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.TextProcessing?.wordCount === "function") {
          return wasmModule.TextProcessing.wordCount(text);
        }
      } catch (error) {
        console.warn(`WASM wordCount failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod("TextProcessing", "wordCount", [text], () => {
      const matches = text.match(/\S+/g);
      return matches ? matches.length : 0;
    });
  }

  static sentenceCount(text: string): number {
    if (TextProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.TextProcessing?.sentenceCount === "function") {
          return wasmModule.TextProcessing.sentenceCount(text);
        }
      } catch (error) {
        console.warn(`WASM sentenceCount failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod(
      "TextProcessing",
      "sentenceCount",
      [text],
      () => {
        if (text.trim() === "") return 0;
        const matches = text.match(/[.!?]+\s*/g);
        return matches ? matches.length : 1;
      }
    );
  }

  static levenshteinDistance(a: string, b: string): number {
    if (TextProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (
          typeof wasmModule.TextProcessing?.levenshteinDistance === "function"
        ) {
          return wasmModule.TextProcessing.levenshteinDistance(a, b);
        }
      } catch (error) {
        console.warn(
          `WASM levenshteinDistance failed, using JS fallback: ${error}`
        );
      }
    }

    return callWasmStaticMethod(
      "TextProcessing",
      "levenshteinDistance",
      [a, b],
      () => {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = [];

        for (let i = 0; i <= a.length; i++) {
          matrix[i] = [i];
        }

        for (let j = 0; j <= b.length; j++) {
          matrix[0][j] = j;
        }

        for (let i = 1; i <= a.length; i++) {
          for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
              matrix[i - 1][j] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j - 1] + cost
            );
          }
        }

        return matrix[a.length][b.length];
      }
    );
  }

  static frequencyAnalysis(text: string): FrequencyAnalysisResult {
    if (TextProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (
          typeof wasmModule.TextProcessing?.frequencyAnalysis === "function"
        ) {
          return wasmModule.TextProcessing.frequencyAnalysis(text);
        }
      } catch (error) {
        console.warn(
          `WASM frequencyAnalysis failed, using JS fallback: ${error}`
        );
      }
    }

    return callWasmStaticMethod(
      "TextProcessing",
      "frequencyAnalysis",
      [text],
      () => {
        const freq: FrequencyAnalysisResult = {};
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          freq[char] = (freq[char] || 0) + 1;
        }
        return freq;
      }
    );
  }

  static slugify(text: string): string {
    if (TextProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.TextProcessing?.slugify === "function") {
          return wasmModule.TextProcessing.slugify(text);
        }
      } catch (error) {
        console.warn(`WASM slugify failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod("TextProcessing", "slugify", [text], () => {
      let result = "";
      const normalized = text.toLowerCase();
      let prevDash = true;

      for (let i = 0; i < normalized.length; i++) {
        const c = normalized[i];
        if (/[a-z0-9]/.test(c)) {
          result += c;
          prevDash = false;
        } else if (!prevDash) {
          result += "-";
          prevDash = true;
        }
      }

      if (result.endsWith("-")) {
        result = result.slice(0, -1);
      }

      return result;
    });
  }

  static extractDates(text: string): DateMatch[] {
    if (TextProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.TextProcessing?.extractDates === "function") {
          return wasmModule.TextProcessing.extractDates(text);
        }
      } catch (error) {
        console.warn(`WASM extractDates failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod(
      "TextProcessing",
      "extractDates",
      [text],
      () => {
        const datePatterns = [
          /\\b\\d{4}-\\d{2}-\\d{2}\\b/g,
          /\b\d{2}\/\d{2}\/\d{4}\b/g,
          /\\b\\d{2}\\.\\d{2}\\.\\d{4}\\b/g,
          /\\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \\d{1,2},? \\d{4}\\b/g,
        ];

        const result: DateMatch[] = [];

        for (const pattern of datePatterns) {
          let match;
          while ((match = pattern.exec(text)) !== null) {
            result.push({
              text: match[0],
              index: match.index,
            });
          }
        }

        return result;
      }
    );
  }

  static tokenize(text: string): string[] {
    if (TextProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.TextProcessing?.tokenize === "function") {
          return wasmModule.TextProcessing.tokenize(text);
        }
      } catch (error) {
        console.warn(`WASM tokenize failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod("TextProcessing", "tokenize", [text], () => {
      const regex = /\\b\\w+\\b/g;
      const result: string[] = [];
      let match;

      while ((match = regex.exec(text)) !== null) {
        result.push(match[0]);
      }

      return result;
    });
  }

  static isEmail(text: string): boolean {
    if (TextProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.TextProcessing?.isEmail === "function") {
          return wasmModule.TextProcessing.isEmail(text);
        }
      } catch (error) {
        console.warn(`WASM isEmail failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod("TextProcessing", "isEmail", [text], () => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
      return regex.test(text);
    });
  }

  static isUrl(text: string): boolean {
    if (TextProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.TextProcessing?.isUrl === "function") {
          return wasmModule.TextProcessing.isUrl(text);
        }
      } catch (error) {
        console.warn(`WASM isUrl failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod("TextProcessing", "isUrl", [text], () => {
      const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
      return regex.test(text);
    });
  }

  static isIPv4(text: string): boolean {
    if (TextProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.TextProcessing?.isIPv4 === "function") {
          return wasmModule.TextProcessing.isIPv4(text);
        }
      } catch (error) {
        console.warn(`WASM isIPv4 failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod("TextProcessing", "isIPv4", [text], () => {
      const regex =
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      return regex.test(text);
    });
  }

  static isIPv6(text: string): boolean {
    if (TextProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.TextProcessing?.isIPv6 === "function") {
          return wasmModule.TextProcessing.isIPv6(text);
        }
      } catch (error) {
        console.warn(`WASM isIPv6 failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod("TextProcessing", "isIPv6", [text], () => {
      const regex =
        /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
      return regex.test(text);
    });
  }

  static pluralize(word: string): string {
    if (TextProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.TextProcessing?.pluralize === "function") {
          return wasmModule.TextProcessing.pluralize(word);
        }
      } catch (error) {
        console.warn(`WASM pluralize failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod("TextProcessing", "pluralize", [word], () => {
      const specialCases: { [key: string]: string } = {
        child: "children",
        goose: "geese",
        man: "men",
        woman: "women",
        tooth: "teeth",
        foot: "feet",
        mouse: "mice",
        person: "people",
      };

      if (specialCases[word]) {
        return specialCases[word];
      }

      const lowercase = word.toLowerCase();

      if (
        lowercase.endsWith("s") ||
        lowercase.endsWith("x") ||
        lowercase.endsWith("z") ||
        lowercase.endsWith("ch") ||
        lowercase.endsWith("sh")
      ) {
        return word + "es";
      } else if (lowercase.endsWith("y") && word.length > 1) {
        const penultimate = lowercase.charAt(word.length - 2);
        if (!["a", "e", "i", "o", "u"].includes(penultimate)) {
          return word.slice(0, -1) + "ies";
        }
      }

      return word + "s";
    });
  }

  static extractEntities(text: string): EntityExtractionResult {
    if (TextProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.TextProcessing?.extractEntities === "function") {
          return wasmModule.TextProcessing.extractEntities(text);
        }
      } catch (error) {
        console.warn(
          `WASM extractEntities failed, using JS fallback: ${error}`
        );
      }
    }

    return callWasmStaticMethod(
      "TextProcessing",
      "extractEntities",
      [text],
      () => {
        const emailRe =
          /\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/g;
        const urlRe =
          /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
        const phoneRe =
          /\b(?:\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/g;
        const hashtagRe = /#[a-zA-Z0-9_]+/g;
        const mentionRe = /@[a-zA-Z0-9_]+/g;

        return {
          emails: Array.from(text.matchAll(emailRe), (m) => m[0]),
          urls: Array.from(text.matchAll(urlRe), (m) => m[0]),
          phones: Array.from(text.matchAll(phoneRe), (m) => m[0]),
          hashtags: Array.from(text.matchAll(hashtagRe), (m) => m[0]),
          mentions: Array.from(text.matchAll(mentionRe), (m) => m[0]),
        };
      }
    );
  }

  static extractKeywords(text: string, stopWords?: string[]): KeywordResult[] {
    if (TextProcessing.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.TextProcessing?.extractKeywords === "function") {
          return wasmModule.TextProcessing.extractKeywords(text, stopWords);
        }
      } catch (error) {
        console.warn(
          `WASM extractKeywords failed, using JS fallback: ${error}`
        );
      }
    }

    return callWasmStaticMethod(
      "TextProcessing",
      "extractKeywords",
      [text, stopWords],
      () => {
        const defaultStopWords = [
          "a",
          "an",
          "the",
          "and",
          "or",
          "but",
          "is",
          "are",
          "was",
          "were",
          "be",
          "been",
          "being",
          "in",
          "on",
          "at",
          "to",
          "for",
          "with",
          "by",
          "about",
          "against",
          "between",
          "into",
          "through",
          "during",
          "before",
          "after",
          "above",
          "below",
          "from",
          "up",
          "down",
          "of",
          "off",
          "over",
          "under",
        ];

        const stopWordsSet = new Set(stopWords || defaultStopWords);
        const wordCounts: { [key: string]: number } = {};
        const wordRe = /\\b[a-zA-Z]{3,}\\b/g;
        const lowerText = text.toLowerCase();

        let match;
        while ((match = wordRe.exec(lowerText)) !== null) {
          const word = match[0];
          if (!stopWordsSet.has(word)) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
          }
        }

        const words = Object.entries(wordCounts)
          .map(([word, count]) => ({ word, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        return words;
      }
    );
  }
}

export default TextProcessing;
