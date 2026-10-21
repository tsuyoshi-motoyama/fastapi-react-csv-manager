import { useState } from 'react'
import { downloadProductsCsv, UnauthorizedError } from '../api/products'

type ProductCsvDownloadProps = {
  token: string
  onLogout: () => void
}

function ProductCsvDownload({token, onLogout}: ProductCsvDownloadProps) {
  const [message, setMessage] = useState('')

  const handleDownload = async () => {
    setMessage('')

    try {
      const blob = await downloadProductsCsv(token)

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = 'products.csv'
      link.click()

      URL.revokeObjectURL(url)
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        onLogout()
        return
      }
      console.error(error)
      console.error(error)
      setMessage('CSVダウンロードに失敗しました')
    }
  }

  return (
    <>
      <h1>CSVダウンロード</h1>

      <button type="button" onClick={handleDownload}>
        ダウンロード
      </button>

      <p>{message}</p>
    </>
  )
}

export default ProductCsvDownload