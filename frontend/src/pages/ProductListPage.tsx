import ProductSearch from '../components/ProductSearch'
import ProductCsvDownload from '../components/ProductCsvDownload'
import { Link } from 'react-router'

type ProductListPageProps = {
  token: string
  onLogout: () => void
}

function ProductListPage({ token, onLogout }: ProductListPageProps) {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        商品一覧
      </h1>
      <ProductCsvDownload token={token} onLogout={onLogout} />
      <ProductSearch token={token} onLogout={onLogout} />
    </div>
  )
}

export default ProductListPage