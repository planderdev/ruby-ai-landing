import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

// Sonnet 4.6 — best speed/quality for short Korean copy generation.
// User requested Sonnet specifically; do not change without permission.
export const AI_MODEL = "claude-sonnet-4-6" as const;
