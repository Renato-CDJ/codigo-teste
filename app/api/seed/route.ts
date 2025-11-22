import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Missing environment variables" }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const users = [
    { email: "admin@crm.local", password: "rcp@$", role: "admin" },
    { email: "monitoria1@crm.local", password: "m123456", role: "user" },
    { email: "monitoria2@crm.local", password: "m123456", role: "user" },
    { email: "monitoria3@crm.local", password: "m123456", role: "user" },
  ]

  const results = []

  for (const user of users) {
    // Check if user exists
    const { data: existingUsers } = await supabase.from("users").select("id").eq("email", user.email).single()

    if (!existingUsers) {
      // Create user in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      })

      if (authError) {
        results.push({ email: user.email, status: "error", message: authError.message })
        continue
      }

      if (authUser.user) {
        // Insert into public.users table
        const { error: dbError } = await supabase.from("users").upsert({
          id: authUser.user.id,
          email: user.email,
          role: user.role,
          name: user.email.split("@")[0], // 'admin', 'monitoria1', etc.
          created_at: new Date().toISOString(),
        })

        if (dbError) {
          results.push({ email: user.email, status: "db_error", message: dbError.message })
        } else {
          results.push({ email: user.email, status: "created" })
        }
      }
    } else {
      results.push({ email: user.email, status: "exists" })
    }
  }

  return NextResponse.json({ results })
}
