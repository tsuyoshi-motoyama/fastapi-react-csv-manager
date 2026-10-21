import { useState, useRef } from 'react'
import { uploadProductsCsv, UnauthorizedError } from '../api/products'

type ProductCsvUploadProps = {
  token: string
  onLogout: () => void
}

function ProductCsvUpload({ token, onLogout }: ProductCsvUploadProps) {
    const [file, setFile] = useState<File | null>(null)
    const [message, setMessage] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setMessage('')

        if (!file) {
            setMessage('CSVファイルを選択してください')
            return
        }

        try {
            const data = await uploadProductsCsv(file, token)
            setMessage(`${data.registered_count}件の商品を登録しました`)
            setFile(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                onLogout()
                return
            }
            console.error(error)
            if (error instanceof Error) {
                setMessage(error.message)
            } else {
                setMessage('CSVアップロードに失敗しました')
            }
        }
    }

    return (
        <>
          <h1>CSV一括登録</h1>
            <form onSubmit={handleSubmit}>
                <div>
                <label>CSVファイル</label>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(event) => {
                    setFile(event.target.files?.[0] ?? null)
                    }}
                />
                </div>

                <button type="submit">アップロード</button>
            </form>
          <p>{message}</p>
        </>
    )
}

export default ProductCsvUpload