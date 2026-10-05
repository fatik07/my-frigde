import { createOpenRouterText, type OpenRouterTextAdapter } from '@tanstack/ai-openrouter'

const DEFAULT_MODEL = 'openrouter/free'

/**
 * Builds the OpenRouter text adapter used for meal suggestions.
 * Isolated here so the model/provider can be swapped by changing this
 * one module (see AI_MODEL env var) without touching any calling code.
 *
 * The adapter's model type is a closed union of known OpenRouter model
 * ids and doesn't include routing aliases like "openrouter/free", which
 * is a valid runtime model id but not part of that compile-time list.
 */
export function getMealSuggestionAdapter(): OpenRouterTextAdapter<any> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  const model = process.env.AI_MODEL || DEFAULT_MODEL
  return createOpenRouterText(model as any, apiKey)
}
