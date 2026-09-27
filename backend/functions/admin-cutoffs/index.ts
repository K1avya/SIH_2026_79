// ==============================================================================
// QUANTIFY — Supabase Edge Function: admin-cutoffs
// ==============================================================================
// Manages diagnostic score level cutoff thresholds (FR-LEVEL-005):
// - GET: Retrieve current beginnerMax and intermediateMax thresholds
// - POST / PUT / PATCH: Update cutoff thresholds (admin-only)
// Evaluated by submit-assessment to categorize students into Beginner,
// Intermediate, or Advanced quantum proficiency tiers.
// Enforced via RLS + role verification (profiles.role = 'admin').
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS',
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

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Verify caller authentication and admin authorization
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing or malformed Bearer token.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.substring(7)
    const isServiceKeyCall = token === supabaseServiceKey

    if (!isServiceKeyCall) {
      const { data: { user }, error: userErr } = await supabaseAdmin.auth.getUser(token)
      if (userErr || !user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized: Invalid or expired authentication token.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check role in profiles
      const { data: profile, error: profErr } = await supabaseAdmin
        .from('profiles')
        .select('id, role')
        .eq('id', user.id)
        .maybeSingle()

      if (profErr || !profile || profile.role !== 'admin') {
        return new Response(
          JSON.stringify({ error: 'Forbidden: Admin role required to configure diagnostic cutoffs.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // --------------------------------------------------------------------------
    // GET: Retrieve Current Settings
    // --------------------------------------------------------------------------
    if (req.method === 'GET') {
      const { data: settings, error: fetchErr } = await supabaseAdmin
        .from('platform_settings')
        .select('"beginnerMax", "intermediateMax", updated_at')
        .eq('id', 'default')
        .maybeSingle()

      if (fetchErr) {
        throw new Error(`Failed to query platform settings: ${fetchErr.message}`)
      }

      const beginnerMax = settings?.beginnerMax ?? 3
      const intermediateMax = settings?.intermediateMax ?? 7

      return new Response(
        JSON.stringify({
          success: true,
          beginnerMax,
          intermediateMax,
          ranges: {
            beginner: `0 - ${beginnerMax} points`,
            intermediate: `${beginnerMax + 1} - ${intermediateMax} points`,
            advanced: `${intermediateMax + 1} - 10 points`,
          },
          updatedAt: settings?.updated_at || new Date().toISOString(),
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // --------------------------------------------------------------------------
    // POST / PUT / PATCH: Update Cutoffs
    // --------------------------------------------------------------------------
    const body = await req.json().catch(() => ({}))
    const beginnerMax = Number(body.beginnerMax)
    const intermediateMax = Number(body.intermediateMax)

    // Validation
    if (isNaN(beginnerMax) || isNaN(intermediateMax)) {
      return new Response(
        JSON.stringify({ error: 'Validation Error: beginnerMax and intermediateMax must be valid numeric values.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!Number.isInteger(beginnerMax) || !Number.isInteger(intermediateMax)) {
      return new Response(
        JSON.stringify({ error: 'Validation Error: Cutoff scores must be whole integers.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (beginnerMax < 0 || beginnerMax > 8) {
      return new Response(
        JSON.stringify({ error: 'Validation Error: beginnerMax must be between 0 and 8.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (intermediateMax <= beginnerMax) {
      return new Response(
        JSON.stringify({ error: `Validation Error: intermediateMax (${intermediateMax}) must be strictly greater than beginnerMax (${beginnerMax}).` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (intermediateMax > 10) {
      return new Response(
        JSON.stringify({ error: 'Validation Error: intermediateMax cannot exceed maximum assessment score of 10.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Upsert into platform_settings
    const nowIso = new Date().toISOString()
    const { data: updated, error: upsertErr } = await supabaseAdmin
      .from('platform_settings')
      .upsert({
        id: 'default',
        beginnerMax,
        intermediateMax,
        updated_at: nowIso,
      })
      .select()
      .single()

    if (upsertErr) {
      throw new Error(`Failed to update platform settings: ${upsertErr.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Diagnostic level cutoff thresholds updated successfully.',
        beginnerMax: updated.beginnerMax,
        intermediateMax: updated.intermediateMax,
        ranges: {
          beginner: `0 - ${updated.beginnerMax} points`,
          intermediate: `${updated.beginnerMax + 1} - ${updated.intermediateMax} points`,
          advanced: `${updated.intermediateMax + 1} - 10 points`,
        },
        updatedAt: updated.updated_at,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('admin-cutoffs error:', error)
    return new Response(
      JSON.stringify({ error: error?.message || 'Failed to update cutoff thresholds.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
