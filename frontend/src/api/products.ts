import type { Product } from '../types/product'

const PRODUCT_URL: string = 'http://localhost:8000/products'

export async function createProduct(name: string, price: number) {
    const response = await fetch(PRODUCT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          price,
        }),
    }) 

    return response.json()
}

export async function searchProducts(name: string) {
  const response = await fetch(
    `${PRODUCT_URL}?name=${encodeURIComponent(name)}`
  )

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`)
  }

  return (await response.json()) as Product[]
}

export async function uploadProductsCsv(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${PRODUCT_URL}/upload`, {
    method: 'POST',
    body: formData
  })

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