import { useState } from 'react'

function App() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [message, setMessage] = useState('')
  const [searchName, setSearchName] = useState('')
  const [products, setProducts] = useState<
    { id: number; name: string; price: number}[]
  >([])

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    try {
      const response = await fetch('http://localhost:8000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          price: Number(price),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }

      const data = await response.json()
      setMessage(`商品ID ${data.id} を登録しました`)

      setName('')
      setPrice('')
    } catch (error) {
      console.error(error)
      setMessage('登録に失敗しました')
    }
  }

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/products?name=${encodeURIComponent(searchName)}`
      )

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }

      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <div>
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

      <h2>商品検索</h2>

      <input
        type="text"
        value={searchName}
        onChange={(event) => setSearchName(event.target.value)}
        placeholder="商品名"
      />

      <button type="button" onClick={handleSearch}>
        検索
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>商品名</th>
            <th>価格</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App