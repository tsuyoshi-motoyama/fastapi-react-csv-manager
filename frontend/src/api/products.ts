import { apiFetch } from './client'
import type { Product } from '../types/product'
import type { ProductCsvUploadResponse } from '../types/product'
export { UnauthorizedError } from './client'

export async function createProduct(name: string, price: number, token: string):  Promise<Product> {
    const response = await apiFetch(
      '/products',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price }),
      },
      token,
    )

    if (!response.ok) {
      throw new Error('商品登録に失敗しました')
    }

    return response.json()
}

export async function searchProducts(name: string, token: string): Promise<Product[]> {
  const response = await apiFetch(
    `/products?name=${encodeURIComponent(name)}`,
    {},
    token,
  )

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`)
  }

  return (await response.json()) as Product[]
}

export async function uploadProductsCsv(file: File, token: string): Promise<ProductCsvUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiFetch(
    '/products/upload',
    {
      method: 'POST',
      body: formData,
    },
    token,
  )

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
  const response = await apiFetch('/products/download', {}, token)

  if (!response.ok) {
    throw new Error('CSVダウンロードに失敗しました')
  } 

  return response.blob()
}
