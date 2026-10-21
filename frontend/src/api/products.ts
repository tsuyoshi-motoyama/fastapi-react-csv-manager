import type { Product } from '../types/product'

const PRODUCT_URL: string = 'http://localhost:8000/products'

export async function createProduct(name: string, price: number, token: string) {
    const response = await fetch(PRODUCT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price,
        }),
    }) 

    checkUnauthorized(response)

    if (!response.ok) {
      throw new Error('商品登録に失敗しました')
    }

    return response.json()
}

export async function searchProducts(name: string, token: string) {
  const response = await fetch(
    `${PRODUCT_URL}?name=${encodeURIComponent(name)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  checkUnauthorized(response)

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`)
  }

  return (await response.json()) as Product[]
}

export async function uploadProductsCsv(file: File, token: string) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${PRODUCT_URL}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData
  })

  checkUnauthorized(response)

  const data = await response.json()

  if (!response.ok) {
    const detail = data.detail
    if (typeof detail === 'string') {
      throw new Error(detail)
    }

    if (detail?.row && Array.isArray(detail.errors)) {
      const messages = detail.errors.map(
        (error: { msg: string }) => error.msg
      )

      
      throw new Error(
        `${detail.row}行目: ${messages.join(', ')}`
      )
    }

    throw new Error('CSVアップロードに失敗しました')
  } 

  return data
}

export async function downloadProductsCsv(token: string): Promise<Blob> {
  const response = await fetch(
    `${PRODUCT_URL}/download`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  checkUnauthorized(response)

  if (!response.ok) {
    throw new Error('CSVダウンロードに失敗しました')
  } 

  return response.blob()
}

export class UnauthorizedError extends Error {
  constructor() {
    super('認証の有効期限が切れたか、認証情報が無効です')
    this.name = 'UnauthorizedError'
  }
}

function checkUnauthorized(response: Response): void {
  if (response.status === 401) {
    throw new UnauthorizedError()
  }
}