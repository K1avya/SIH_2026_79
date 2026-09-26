import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
}
const EVENT_TYPES = ['hackathon', 'webinar', 'conference', 'fellowship']
const REGIONS = ['india', 'global']

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const url = Deno.env.get('SUPABASE_URL') || ''
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || ''
    if (!url || !key) throw new Error('Supabase environment variables are missing.')
    const admin = createClient(url, key)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing or malformed authorization header.' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const token = authHeader.substring(7)
    if (token !== key) {
      const { data: { user }, error: userErr } = await admin.auth.getUser(token)
      if (userErr || !user) return new Response(JSON.stringify({ error: 'Unauthorized: Invalid or expired authentication token.' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      const { data: profile, error: profileErr } = await admin.from('profiles').select('id, role').eq('id', user.id).maybeSingle()
      if (profileErr || !profile || profile.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Forbidden: Admin role required for quantum event management.' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
    }

    const body = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) ? await req.json().catch(() => ({})) : {}
    const queryId = url.searchParams.get('id')
    let action = (body.action || '').toLowerCase()
    if (!action) action = req.method === 'GET' ? 'list' : req.method === 'POST' ? 'create' : req.method === 'DELETE' ? 'delete' : 'update'

    if (action === 'list' || action === 'read' || action === 'get') {
      let query = admin.from('quantum_events').select('*').order('start_date', { ascending: true })
      if (queryId || body.id) query = query.eq('id', queryId || body.id)
      const { data: events, error } = await query
      if (error) throw new Error(`Failed to fetch quantum events: ${error.message}`)
      return new Response(JSON.stringify({ success: true, count: events?.length || 0, events }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (action === 'create') {
      const event = body.event || body
      if (!event.title?.trim() || !event.start_date || !EVENT_TYPES.includes(event.event_type) || !REGIONS.includes(event.region)) {
        return new Response(JSON.stringify({ error: 'Validation Error: title, start_date, event_type, and region are required and must be valid.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      const { data: created, error } = await admin.from('quantum_events').insert({
        title: event.title.trim(), organiser: event.organiser || null, event_type: event.event_type, region: event.region,
        description: event.description || null, start_date: event.start_date, end_date: event.end_date || null,
        is_online: event.is_online !== false, registration_url: event.registration_url || null, source_url: event.source_url || null,
        is_featured: event.is_featured === true, created_by: event.created_by || null,
      }).select().single()
      if (error) throw new Error(`Failed to create quantum event: ${error.message}`)
      return new Response(JSON.stringify({ success: true, event: created }), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const id = body.id || queryId
    if (!id) return new Response(JSON.stringify({ error: 'Missing event id.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    if (action === 'update') {
      const input = body.event || body
      const updates: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(input)) {
        const column = ({ eventType: 'event_type', startDate: 'start_date', endDate: 'end_date', isOnline: 'is_online', registrationUrl: 'registration_url', sourceUrl: 'source_url', isFeatured: 'is_featured' } as Record<string, string>)[key] || key
        if (['title', 'organiser', 'event_type', 'region', 'description', 'start_date', 'end_date', 'is_online', 'registration_url', 'source_url', 'is_featured'].includes(column)) updates[column] = value
      }
      if (updates.event_type && !EVENT_TYPES.includes(String(updates.event_type))) throw new Error('Invalid event type.')
      if (updates.region && !REGIONS.includes(String(updates.region))) throw new Error('Invalid region.')
      const { data: updated, error } = await admin.from('quantum_events').update(updates).eq('id', id).select().single()
      if (error) throw new Error(`Failed to update quantum event: ${error.message}`)
      return new Response(JSON.stringify({ success: true, event: updated }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (action === 'delete') {
      const { error } = await admin.from('quantum_events').delete().eq('id', id)
      if (error) throw new Error(`Failed to delete quantum event: ${error.message}`)
      return new Response(JSON.stringify({ success: true, deletedId: id }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    return new Response(JSON.stringify({ error: 'Unsupported action. Valid actions: list, create, update, delete.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error: any) {
    console.error('admin-events-crud error:', error)
    return new Response(JSON.stringify({ error: error?.message || 'Failed to process quantum events operation.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
