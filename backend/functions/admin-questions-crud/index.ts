// ==============================================================================
// QUANTIFY — Supabase Edge Function: admin-questions-crud
// ==============================================================================
// Admin-only CRUD operations for diagnostic assessment questions:
// - List questions (GET or action: 'list')
// - Create question (POST or action: 'create')
// - Update question (PUT/PATCH or action: 'update')
// - Delete question (DELETE or action: 'delete')
// Validates categories, difficulty, question text, and options schema.
// Enforced via RLS + role verification (profiles.role = 'admin').
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
}

const ALLOWED_CATEGORIES = ['basics', 'qubits', 'gates', 'circuits', 'algorithms']
const ALLOWED_DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

export interface AssessmentOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface AssessmentQuestionInput {
  id?: string
  category: string
  difficulty: string
  questionText: string
  options: AssessmentOption[]
  explanation: string
  sequenceOrder?: number
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
          JSON.stringify({ error: 'Forbidden: Admin role required for assessment question management.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // 2. Parse request parameters & body
    const url = new URL(req.url)
    const queryId = url.searchParams.get('id')
    const queryCategory = url.searchParams.get('category')
    const queryDifficulty = url.searchParams.get('difficulty')

    let body: any = {}
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
      body = await req.json().catch(() => ({}))
    }

    // Determine action: either explicit action property or derived from HTTP method
    let action = (body.action || '').toLowerCase()
    if (!action) {
      if (req.method === 'GET') action = 'list'
      else if (req.method === 'POST') action = 'create'
      else if (req.method === 'PUT' || req.method === 'PATCH') action = 'update'
      else if (req.method === 'DELETE') action = 'delete'
    }

    // --------------------------------------------------------------------------
    // ACTION: LIST / READ
    // --------------------------------------------------------------------------
    if (action === 'list' || action === 'read' || action === 'get') {
      let query = supabaseAdmin
        .from('assessment_questions')
        .select('*')
        .order('sequenceOrder', { ascending: true })

      if (queryId || body.id) {
        query = query.eq('id', queryId || body.id)
      }
      if (queryCategory || body.category) {
        query = query.eq('category', queryCategory || body.category)
      }
      if (queryDifficulty || body.difficulty) {
        query = query.eq('difficulty', queryDifficulty || body.difficulty)
      }

      const { data: questions, error: listErr } = await query

      if (listErr) {
        throw new Error(`Failed to fetch questions: ${listErr.message}`)
      }

      return new Response(
        JSON.stringify({ success: true, count: questions?.length || 0, questions }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // --------------------------------------------------------------------------
    // ACTION: CREATE
    // --------------------------------------------------------------------------
    if (action === 'create') {
      const q: AssessmentQuestionInput = body.question || body

      if (!q.questionText || typeof q.questionText !== 'string' || q.questionText.trim() === '') {
        return new Response(
          JSON.stringify({ error: 'Validation Error: questionText is required and cannot be empty.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const category = (q.category || '').toLowerCase()
      if (!ALLOWED_CATEGORIES.includes(category)) {
        return new Response(
          JSON.stringify({ error: `Validation Error: Invalid category "${q.category}". Must be one of: ${ALLOWED_CATEGORIES.join(', ')}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const difficulty = (q.difficulty || '').toLowerCase()
      if (!ALLOWED_DIFFICULTIES.includes(difficulty)) {
        return new Response(
          JSON.stringify({ error: `Validation Error: Invalid difficulty "${q.difficulty}". Must be one of: ${ALLOWED_DIFFICULTIES.join(', ')}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (!Array.isArray(q.options) || q.options.length < 2) {
        return new Response(
          JSON.stringify({ error: 'Validation Error: options must be an array of at least 2 choices.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const hasCorrect = q.options.some((opt) => opt.isCorrect === true)
      if (!hasCorrect) {
        return new Response(
          JSON.stringify({ error: 'Validation Error: At least one option must have isCorrect = true.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Generate ID and sequence order if not specified
      const questionId = q.id && q.id.trim() !== '' ? q.id : `q-${Date.now()}`

      let sequenceOrder = q.sequenceOrder
      if (typeof sequenceOrder !== 'number') {
        const { data: maxSeq } = await supabaseAdmin
          .from('assessment_questions')
          .select('sequenceOrder')
          .order('sequenceOrder', { ascending: false })
          .limit(1)
          .maybeSingle()

        sequenceOrder = (maxSeq?.sequenceOrder || 0) + 1
      }

      const newQuestionRow = {
        id: questionId,
        category,
        difficulty,
        questionText: q.questionText.trim(),
        options: q.options,
        explanation: q.explanation || 'No explanation provided.',
        sequenceOrder,
      }

      const { data: created, error: insertErr } = await supabaseAdmin
        .from('assessment_questions')
        .insert(newQuestionRow)
        .select()
        .single()

      if (insertErr) {
        throw new Error(`Failed to create assessment question: ${insertErr.message}`)
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Question created successfully.', question: created }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // --------------------------------------------------------------------------
    // ACTION: UPDATE
    // --------------------------------------------------------------------------
    if (action === 'update') {
      const questionId = body.id || queryId
      if (!questionId) {
        return new Response(
          JSON.stringify({ error: 'Missing question id in payload or query parameter.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const patchData = body.question || body
      const updateFields: Record<string, any> = {}

      if (patchData.questionText !== undefined) {
        if (!patchData.questionText.trim()) {
          return new Response(
            JSON.stringify({ error: 'Validation Error: questionText cannot be blank.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        updateFields.questionText = patchData.questionText.trim()
      }

      if (patchData.category !== undefined) {
        const cat = String(patchData.category).toLowerCase()
        if (!ALLOWED_CATEGORIES.includes(cat)) {
          return new Response(
            JSON.stringify({ error: `Validation Error: Invalid category "${patchData.category}". Must be one of: ${ALLOWED_CATEGORIES.join(', ')}` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        updateFields.category = cat
      }

      if (patchData.difficulty !== undefined) {
        const diff = String(patchData.difficulty).toLowerCase()
        if (!ALLOWED_DIFFICULTIES.includes(diff)) {
          return new Response(
            JSON.stringify({ error: `Validation Error: Invalid difficulty "${patchData.difficulty}". Must be one of: ${ALLOWED_DIFFICULTIES.join(', ')}` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        updateFields.difficulty = diff
      }

      if (patchData.options !== undefined) {
        if (!Array.isArray(patchData.options) || patchData.options.length < 2) {
          return new Response(
            JSON.stringify({ error: 'Validation Error: options must be an array of at least 2 choices.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        const hasCorrect = patchData.options.some((opt: any) => opt.isCorrect === true)
        if (!hasCorrect) {
          return new Response(
            JSON.stringify({ error: 'Validation Error: At least one option must have isCorrect = true.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        updateFields.options = patchData.options
      }

      if (patchData.explanation !== undefined) {
        updateFields.explanation = patchData.explanation
      }

      if (patchData.sequenceOrder !== undefined) {
        updateFields.sequenceOrder = Number(patchData.sequenceOrder)
      }

      if (Object.keys(updateFields).length === 0) {
        return new Response(
          JSON.stringify({ error: 'No valid fields provided to update.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: updated, error: updateErr } = await supabaseAdmin
        .from('assessment_questions')
        .update(updateFields)
        .eq('id', questionId)
        .select()
        .single()

      if (updateErr) {
        throw new Error(`Failed to update question ${questionId}: ${updateErr.message}`)
      }

      return new Response(
        JSON.stringify({ success: true, message: `Question ${questionId} updated successfully.`, question: updated }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // --------------------------------------------------------------------------
    // ACTION: DELETE
    // --------------------------------------------------------------------------
    if (action === 'delete') {
      const questionId = body.id || queryId
      if (!questionId) {
        return new Response(
          JSON.stringify({ error: 'Missing question id in payload or query parameter for delete operation.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: deleted, error: delErr } = await supabaseAdmin
        .from('assessment_questions')
        .delete()
        .eq('id', questionId)
        .select()

      if (delErr) {
        throw new Error(`Failed to delete question ${questionId}: ${delErr.message}`)
      }

      return new Response(
        JSON.stringify({ success: true, message: `Question ${questionId} deleted successfully.`, deletedId: questionId, deletedCount: deleted?.length || 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: `Unsupported action: "${action}". Valid actions: list, create, update, delete.` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('admin-questions-crud error:', error)
    return new Response(
      JSON.stringify({ error: error?.message || 'Failed to process assessment questions operation.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
