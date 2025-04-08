import { RegexService, createPatternBuilder } from "../regex/utils";

/**
 * Example 1: Using the Singleton Service
 * Good for applications where you want a centralized regex service
 */
async function initializeRegexService(): Promise<void> {
  const service = RegexService.getInstance();
  await service.initialize();

  // Now you can use the service throughout your application
  if (service.initialized) {
    const builder = service.builder;
    const language = service.language;
    const conversation = service.conversation;

    if (builder) {
      const pattern = builder.findEmail().and().findUrl().done();

      console.log("Generated pattern:", pattern);

      const testText =
        "Contact us at info@example.com or visit https://example.com";
      const matches = builder.extractMatches(testText);
      console.log("Matches:", matches);
    }
  }
}

/**
 * Example 2: Using the Pattern Builder
 * Good for one-off usage or specific components
 */
async function buildRegexPattern(): Promise<string[]> {
  const patternBuilder = await createPatternBuilder();

  const pattern = patternBuilder
    .captureEmails()
    .and()
    .capturePhoneNumbers()
    .build();

  console.log("Pattern:", pattern);

  const testText = "Call 555-123-4567 or email info@example.com";
  return patternBuilder.getMatches(testText);
}

/**
 * Example 3: Direct API usage
 * Most flexible but requires more management
 */
async function directRegexUsage(): Promise<void> {
  // Import the specific regex component you need
  const { RegexBuilder } = await import("../regex");

  try {
    const builder = await RegexBuilder.create();

    const pattern = builder
      .startCapture()
      .findEmail()
      .endCapture()
      .or()
      .startCapture()
      .findUrl()
      .endCapture()
      .done();

    console.log("Complex pattern:", pattern);

    const testText =
      "Multiple formats: info@example.com, https://example.com, and 555-123-4567";
    const matches = builder.extractMatches(testText);
    console.log("Extracted items:", matches);
  } catch (error) {
    console.error("Error using RegexBuilder:", error);
  }
}

export { initializeRegexService, buildRegexPattern, directRegexUsage };
