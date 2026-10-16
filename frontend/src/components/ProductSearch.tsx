import { useState } from 'react'
import { searchProducts } from '../api/products'
import type { Product } from '../types/product'

function ProductSearch() {
    const [searchName, setSearchName] = useState('')
    const [products, setProducts] = useState<Product[]>([])

    const handleSearch = async () => {
        try { 
            const data = await searchProducts(searchName)
            setProducts(data)
        } catch (error) {
        console.error(error)
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