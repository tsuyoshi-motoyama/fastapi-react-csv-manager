import { apiFetch } from './client'
import type { LoginResponse } from '../types/auth'

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiFetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error('ログインに失敗しました')
  }

  return response.json()
}