import { useState } from 'react'
import { createProduct } from '../api/products'

function ProductForm() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    try {
      const data = await createProduct(name, Number(price))
      setMessage(`商品ID ${data.id} を登録しました`)

      setName('')
      setPrice('')
    } catch (error) {
      console.error(error)
      setMessage('登録に失敗しました')
    }
  }

  return (
    <>
      <h1>商品登録</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>商品名</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div>
          <label>価格</label>
          <input
            type="number"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            min="0"
            required
          />
        </div>

        <button type="submit">登録</button>
      </form>

      <p>{message}</p>
    </>
  )
}

export default ProductForm