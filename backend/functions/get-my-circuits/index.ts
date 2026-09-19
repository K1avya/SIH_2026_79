// ==============================================================================
// QUANTIFY — Supabase Edge Function: get-my-circuits
// ==============================================================================
// Lists all saved quantum circuit layouts created by the logged-in user,
// along with global curated preset circuits (Bell State, GHZ, Superposition, etc.)
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || ''

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are missing.')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Extract userId from query string, body, or Bearer token
    const url = new URL(req.url)
    let userId = url.searchParams.get('userId')

    if (!userId && req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      userId = body.userId
    }

    if (!userId) {
      const authHeader = req.headers.get('Authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        const { data: { user } } = await supabase.auth.getUser(token)
        if (user?.id) userId = user.id
      }
    }

    // 2. Query user's circuits and global presets
    let query = supabase
      .from('saved_circuits')
      .select('*')
      .order('updated_at', { ascending: false })

    if (userId) {
      // Return user's private circuits plus any public presets
      query = query.or(`user_id.eq.${userId},isPreset.eq.true`)
    } else {
      // If unauthenticated, only return public presets
      query = query.eq('isPreset', true)
    }

    const { data: circuits, error: fetchErr } = await query

    if (fetchErr) {
      throw new Error(`Failed to load circuits: ${fetchErr.message}`)
    }

    return new Response(JSON.stringify(circuits || []), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('get-my-circuits error:', error)
    return new Response(
      JSON.stringify({ error: error?.message || 'Failed to fetch saved circuits.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
