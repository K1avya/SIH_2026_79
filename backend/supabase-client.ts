import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lpegmwrbdixvwwjfhhuo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZWdtd3JiZGl4dnd3amZoaHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MjkxMzEsImV4cCI6MjEwNTQwNTEzMX0.KCivauv0Ekgm4DToiypX0QqqxIE8ErKtCTrlaOg21vc'

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
