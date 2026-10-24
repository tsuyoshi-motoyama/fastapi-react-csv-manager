const API_BASE_URL = 'http://localhost:8000'

export class UnauthorizedError extends Error {
  constructor() {
    super('認証の有効期限が切れたか、認証情報が無効です')
    this.name = 'UnauthorizedError'
  }
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<Response> {
  const headers = new Headers(options.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    throw new UnauthorizedError()
  }

  return response
}