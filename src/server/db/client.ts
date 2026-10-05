import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import WebSocket from 'ws'

let client: SupabaseClient | null = null

/**
 * Server-only Supabase client using the service role key. Must never be
 * imported from client-rendered code — only from server functions/handlers.
 */
export function getServerSupabase(): SupabaseClient {
  if (client) return client

  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase is not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY',
    )
  }

  client = createClient(url, serviceKey, {
    auth: { persistSession: false },
    // Node < 22 has no native WebSocket; this app doesn't use realtime
    // subscriptions, but the client still constructs one internally.
    realtime: { transport: WebSocket as never },
  })
  return client
}
