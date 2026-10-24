import { useState } from 'react'
import { createProduct } from '../api/products'
import { useApiError } from '../hooks/useApiError'
import ProductFormView from './views/ProductFormView'
import type { AuthenticatedProps } from '../types/auth'

function ProductForm({ token, onLogout }: AuthenticatedProps ) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [message, setMessage] = useState('')
  const handleApiError = useApiError(onLogout)

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    try {
      const data = await createProduct(name, Number(price), token)
      setMessage(`商品ID ${data.id} を登録しました`)

      setName('')
      setPrice('')
    } catch (error) {
      setMessage(handleApiError(error, '登録に失敗しました'))
    }
  }

  return (
    <ProductFormView
      name={name}
      price={price}
      message={message}
      onNameChange={setName}
      onPriceChange={setPrice}
      onSubmit={handleSubmit}
    />
  )
}

export default ProductForm