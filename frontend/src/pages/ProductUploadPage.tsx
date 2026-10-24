import ProductCsvUpload from '../components/ProductCsvUpload'

type ProductUploadPageProps = {
  token: string
  onLogout: () => void
}

function ProductUploadPage({ token, onLogout }: ProductUploadPageProps) {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        CSVアップロード
      </h1>

      <ProductCsvUpload token={token} onLogout={onLogout} />
    </div>
  )
}

export default ProductUploadPage