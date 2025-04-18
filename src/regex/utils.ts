import { RegexBuilder, RegexLanguage, RegexConversation } from "./index.js";

export async function createRegexBuilder(): Promise<RegexBuilder> {
  return await RegexBuilder.create();
}

export async function createRegexLanguage(): Promise<RegexLanguage> {
  return await RegexLanguage.create();
}

export async function createRegexConversation(): Promise<RegexConversation> {
  return await RegexConversation.create();
}

export class RegexService {
  private static instance: RegexService;
  private _builder: RegexBuilder | null = null;
  private _language: RegexLanguage | null = null;
  private _conversation: RegexConversation | null = null;
  private _initialized = false;
  private _initializing = false;
  private _error: Error | null = null;

  private constructor() {}

  static getInstance(): RegexService {
    if (!RegexService.instance) {
      RegexService.instance = new RegexService();
    }
    return RegexService.instance;
  }

  async initialize(): Promise<void> {
    if (this._initialized || this._initializing) {
      return;
    }

    this._initializing = true;
    this._error = null;

    try {
      this._builder = await createRegexBuilder();
      this._language = await createRegexLanguage();
      this._conversation = await createRegexConversation();
      this._initialized = true;
    } catch (error) {
      this._error = error instanceof Error ? error : new Error(String(error));
      throw this._error;
    } finally {
      this._initializing = false;
    }
  }

  get builder(): RegexBuilder | null {
    return this._builder;
  }

  get language(): RegexLanguage | null {
    return this._language;
  }

  get conversation(): RegexConversation | null {
    return this._conversation;
  }

  get initialized(): boolean {
    return this._initialized;
  }

  get initializing(): boolean {
    return this._initializing;
  }

  get error(): Error | null {
    return this._error;
  }
}

export class RegexPatternBuilder {
  private _pattern: string = "";

  constructor(private regex: RegexBuilder) {}

  captureEmails(): RegexPatternBuilder {
    this.regex.findEmail();
    return this;
  }

  captureUrls(): RegexPatternBuilder {
    this.regex.findUrl();
    return this;
  }

  capturePhoneNumbers(): RegexPatternBuilder {
    this.regex.findPhoneNumber();
    return this;
  }

  captureIpAddresses(): RegexPatternBuilder {
    this.regex.findIpAddress();
    return this;
  }

  captureDates(): RegexPatternBuilder {
    this.regex.findDate();
    return this;
  }

  captureTimes(): RegexPatternBuilder {
    this.regex.findTime();
    return this;
  }

  captureJsonObjects(): RegexPatternBuilder {
    this.regex.findJsonObject();
    return this;
  }

  and(): RegexPatternBuilder {
    this.regex.and();
    return this;
  }

  or(): RegexPatternBuilder {
    this.regex.or();
    return this;
  }

  build(): string {
    this._pattern = this.regex.done();
    return this._pattern;
  }

  test(text: string): boolean {
    if (!this._pattern) {
      this.build();
    }
    return this.regex.test(text);
  }

  getMatches(text: string): string[] {
    if (!this._pattern) {
      this.build();
    }
    return this.regex.extractMatches(text);
  }
}

export async function createPatternBuilder(): Promise<RegexPatternBuilder> {
  const regex = await createRegexBuilder();
  return new RegexPatternBuilder(regex);
}
