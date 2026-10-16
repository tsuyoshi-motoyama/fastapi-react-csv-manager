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