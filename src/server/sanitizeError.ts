/**
 * Logs the real error server-side and throws a generic one in its place,
 * so server function failures (e.g. a misconfigured Supabase client) never
 * leak internal details to the client via the SSR payload or a thrown error.
 */
export async function withSanitizedErrors<T>(
  publicMessage: string,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    console.error(publicMessage, error)
    throw new Error(publicMessage)
  }
}
