import { RegexBuilder } from "./regex-builder.js";

export class RegexConversation {
  private builder: RegexBuilder;

  private constructor(builder: RegexBuilder) {
    this.builder = builder;
  }

  static async create(): Promise<RegexConversation> {
    const builder = await RegexBuilder.create();
    return new RegexConversation(builder);
  }

  iWantTo(): RegexIntentBuilder {
    return new RegexIntentBuilder(this.builder);
  }

  andAlso(): RegexIntentBuilder {
    this.builder.and();
    return new RegexIntentBuilder(this.builder);
  }

  orMaybe(): RegexIntentBuilder {
    this.builder.or();
    return new RegexIntentBuilder(this.builder);
  }

  done(): string {
    return this.builder.done();
  }

  test(text: string): boolean {
    return this.builder.test(text);
  }

  findAll(text: string): string[] {
    return this.builder.extractMatches(text);
  }
}

export class RegexIntentBuilder {
  private builder: RegexBuilder;

  constructor(builder: RegexBuilder) {
    this.builder = builder;
  }

  find(text: string): RegexActionBuilder {
    this.builder.find(text);
    return new RegexActionBuilder(this.builder);
  }

  captureAnything(): RegexActionBuilder {
    this.builder.anything();
    return new RegexActionBuilder(this.builder);
  }

  captureSomething(): RegexActionBuilder {
    this.builder.something();
    return new RegexActionBuilder(this.builder);
  }

  captureDigits(): RegexActionBuilder {
    this.builder.digits();
    return new RegexActionBuilder(this.builder);
  }

  captureLetters(): RegexActionBuilder {
    this.builder.letters();
    return new RegexActionBuilder(this.builder);
  }

  captureEmails(): RegexActionBuilder {
    this.builder.findEmail();
    return new RegexActionBuilder(this.builder);
  }

  captureUrls(): RegexActionBuilder {
    this.builder.findUrl();
    return new RegexActionBuilder(this.builder);
  }

  captureIpAddresses(): RegexActionBuilder {
    this.builder.findIpAddress();
    return new RegexActionBuilder(this.builder);
  }

  capturePhoneNumbers(): RegexActionBuilder {
    this.builder.findPhoneNumber();
    return new RegexActionBuilder(this.builder);
  }

  captureDates(): RegexActionBuilder {
    this.builder.findDate();
    return new RegexActionBuilder(this.builder);
  }

  captureTimes(): RegexActionBuilder {
    this.builder.findTime();
    return new RegexActionBuilder(this.builder);
  }

  captureJsonObjects(): RegexActionBuilder {
    this.builder.findJsonObject();
    return new RegexActionBuilder(this.builder);
  }

  captureJsonArrays(): RegexActionBuilder {
    this.builder.findJsonArray();
    return new RegexActionBuilder(this.builder);
  }

  captureJsonStrings(): RegexActionBuilder {
    this.builder.findJsonString();
    return new RegexActionBuilder(this.builder);
  }

  captureJsonKeys(): RegexActionBuilder {
    this.builder.findJsonKey();
    return new RegexActionBuilder(this.builder);
  }

  captureJsonNumbers(): RegexActionBuilder {
    this.builder.findJsonNumber();
    return new RegexActionBuilder(this.builder);
  }

  captureObjectWithEmail(key: string): RegexActionBuilder {
    this.builder.findObjectWithEmail(key);
    return new RegexActionBuilder(this.builder);
  }

  captureObjectWithId(key: string): RegexActionBuilder {
    this.builder.findObjectWithId(key);
    return new RegexActionBuilder(this.builder);
  }

  captureObjectsThatContainKey(key: string): RegexActionBuilder {
    this.builder.findObjectsThatContainsKey(key);
    return new RegexActionBuilder(this.builder);
  }

  captureWordsThatStartWith(prefix: string): RegexActionBuilder {
    this.builder.findWordThatStartsWith(prefix);
    return new RegexActionBuilder(this.builder);
  }

  beginCapture(): RegexCaptureBuilder {
    this.builder.startCapture();
    return new RegexCaptureBuilder(this.builder);
  }

  beginGroup(): RegexGroupBuilder {
    this.builder.startGroup();
    return new RegexGroupBuilder(this.builder);
  }
}

export class RegexCaptureBuilder {
  private builder: RegexBuilder;

  constructor(builder: RegexBuilder) {
    this.builder = builder;
  }

  anything(): RegexCaptureBuilder {
    this.builder.anything();
    return this;
  }

  something(): RegexCaptureBuilder {
    this.builder.something();
    return this;
  }

  digits(): RegexCaptureBuilder {
    this.builder.digits();
    return this;
  }

  letters(): RegexCaptureBuilder {
    this.builder.letters();
    return this;
  }

  endCapture(): RegexActionBuilder {
    this.builder.endCapture();
    return new RegexActionBuilder(this.builder);
  }
}

export class RegexGroupBuilder {
  private builder: RegexBuilder;

  constructor(builder: RegexBuilder) {
    this.builder = builder;
  }

  find(text: string): RegexGroupBuilder {
    this.builder.find(text);
    return this;
  }

  anything(): RegexGroupBuilder {
    this.builder.anything();
    return this;
  }

  something(): RegexGroupBuilder {
    this.builder.something();
    return this;
  }

  digits(): RegexGroupBuilder {
    this.builder.digits();
    return this;
  }

  letters(): RegexGroupBuilder {
    this.builder.letters();
    return this;
  }

  endGroup(): RegexActionBuilder {
    this.builder.endGroup();
    return new RegexActionBuilder(this.builder);
  }
}

export class RegexActionBuilder {
  private builder: RegexBuilder;

  constructor(builder: RegexBuilder) {
    this.builder = builder;
  }

  followedBy(): RegexIntentBuilder {
    this.builder.and();
    return new RegexIntentBuilder(this.builder);
  }

  optionallyFollowedBy(): RegexIntentBuilder {
    this.builder.repeatZeroOrOne();
    this.builder.and();
    return new RegexIntentBuilder(this.builder);
  }

  repeatedAtLeast(count: number): RegexActionBuilder {
    this.builder.repeatPrevious(count);
    return this;
  }

  repeatedExactly(count: number): RegexActionBuilder {
    this.builder.repeatPrevious(count, count);
    return this;
  }

  repeatedBetween(min: number, max: number): RegexActionBuilder {
    this.builder.repeatPrevious(min, max);
    return this;
  }

  repeatedZeroOrMore(): RegexActionBuilder {
    this.builder.repeatZeroOrMore();
    return this;
  }

  repeatedOneOrMore(): RegexActionBuilder {
    this.builder.repeatOneOrMore();
    return this;
  }

  optional(): RegexActionBuilder {
    this.builder.repeatZeroOrOne();
    return this;
  }

  andAlso(): RegexIntentBuilder {
    this.builder.and();
    return new RegexIntentBuilder(this.builder);
  }

  orMaybe(): RegexIntentBuilder {
    this.builder.or();
    return new RegexIntentBuilder(this.builder);
  }

  done(): string {
    return this.builder.done();
  }

  test(text: string): boolean {
    return this.builder.test(text);
  }

  findAll(text: string): string[] {
    return this.builder.extractMatches(text);
  }
}
