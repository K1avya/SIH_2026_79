/**
 * Quantify API Client
 * Clean frontend API architecture connected to Supabase Edge Functions & Database.
 * Automatically injects apikey and bearer token headers.
 */

import { supabase } from '@/backend/supabase-client'

export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  data: T
  error?: string
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`
    : 'https://lpegmwrbdixvwwjfhhuo.supabase.co/functions/v1')

const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Retrieve token from Supabase auth session if available
  let token: string | null = null
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      token = session.access_token
    }
  } catch {
    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('quantify_token')
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(ANON_KEY ? { apikey: ANON_KEY } : {}),
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  } else if (ANON_KEY && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${ANON_KEY}`
  }

  try {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}/${cleanEndpoint}`

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errText = await response.text()
      let errMsg = `HTTP ${response.status}: ${errText || response.statusText}`
      try {
        const parsed = JSON.parse(errText)
        if (parsed.error || parsed.message) errMsg = parsed.error || parsed.message
      } catch {
        // use raw text
      }
      return {
        status: 'error',
        data: null as any,
        error: errMsg,
      }
    }

    const json = await response.json()
    return {
      status: 'success',
      data: json,
    }
  } catch (err: any) {
    return {
      status: 'error',
      data: null as any,
      error: err?.message || 'Network request failed. Operating in offline mode.',
    }
  }
}

export const apiGet = <T = any>(endpoint: string) =>
  apiRequest<T>(endpoint, { method: 'GET' })

export const apiPost = <T = any>(endpoint: string, body?: any) =>
  apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(body) })

export const apiPut = <T = any>(endpoint: string, body?: any) =>
  apiRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) })

export const apiDelete = <T = any>(endpoint: string, body?: any) =>
  apiRequest<T>(endpoint, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined })
