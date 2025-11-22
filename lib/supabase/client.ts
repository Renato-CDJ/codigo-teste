import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Missing Supabase URL or Key environment variables")
    return null
  }

  try {
    client = createBrowserClient(supabaseUrl, supabaseKey)
    return client
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    return null
  }
}
