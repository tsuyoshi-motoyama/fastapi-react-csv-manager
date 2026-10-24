import ProductForm from '../components/ProductForm'

type ProductCreatePageProps = {
  token: string
  onLogout: () => void
}

function ProductCreatePage({ token, onLogout }: ProductCreatePageProps) {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        商品登録
      </h1>

      <ProductForm token={token} onLogout={onLogout} />
    </div>
  )
}

export default ProductCreatePage