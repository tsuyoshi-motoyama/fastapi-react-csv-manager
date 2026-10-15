import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState<string>('Loading...')

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/hello')

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`)
        }

        const data: { message: string } = await response.json()
        setMessage(data.message)
      } catch (error) {
        console.error(error)
        setMessage('API Error')
      }
    }

    fetchMessage()
  }, [])

  return (
    <div>
      <h1>React + FastAPI</h1>
      <p>{message}</p>
    </div>
  )
}

export default App