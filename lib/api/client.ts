/**
 * Quantify API Client
 * Clean frontend API architecture prepared for future backend integration.
 * Uses NEXT_PUBLIC_API_BASE_URL environment variable.
 */

export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  data: T
  error?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.quantify.app/v1'

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('quantify_token') : null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errText = await response.text()
      return {
        status: 'error',
        data: null as any,
        error: `HTTP ${response.status}: ${errText || response.statusText}`,
      }
    }

    const json = await response.json()
    return json
  } catch (err: any) {
    return {
      status: 'error',
      data: null as any,
      error: err?.message || 'Network request failed. Operating in offline demo mode.',
    }
  }
}

export const apiGet = <T = any>(endpoint: string) =>
  apiRequest<T>(endpoint, { method: 'GET' })

export const apiPost = <T = any>(endpoint: string, body?: any) =>
  apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(body) })

export const apiPut = <T = any>(endpoint: string, body?: any) =>
  apiRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) })

export const apiDelete = <T = any>(endpoint: string) =>
  apiRequest<T>(endpoint, { method: 'DELETE' })
