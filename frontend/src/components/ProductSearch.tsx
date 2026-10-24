import { useState } from 'react'
import { searchProducts } from '../api/products'
import { useApiError } from '../hooks/useApiError'
import type { Product } from '../types/product'
import type { AuthenticatedProps } from '../types/auth'

function ProductSearch({ token, onLogout }: AuthenticatedProps) {
    const [searchName, setSearchName] = useState('')
    const [message, setMessage] = useState('')
    const [products, setProducts] = useState<Product[]>([])
    const handleApiError = useApiError(onLogout)

    const handleSearch = async () => {
        setMessage('')

        try { 
            const data = await searchProducts(searchName, token)
            setProducts(data)
        } catch (error) {
          setMessage(handleApiError(error, '登録に失敗しました'))
        }
    }

    return (
        <>
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

            {message && <p role="alert">{message}</p>}

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
        </>
    )
}

export default ProductSearch
