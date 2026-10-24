import { useState } from 'react'
import { downloadProductsCsv } from '../api/products'
import { useApiError } from '../hooks/useApiError'
import type { AuthenticatedProps } from '../types/auth'


function ProductCsvDownload({token, onLogout}: AuthenticatedProps) {
  const [message, setMessage] = useState('')
  const handleApiError = useApiError(onLogout)

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
      setMessage(handleApiError(error, '登録に失敗しました'))
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