import { useState } from 'react'
import LoginForm from './components/LoginForm'
import ProductForm from './components/ProductForm'
import ProductSearch from './components/ProductSearch'
import ProductCsvUpload from './components/ProductCsvUpload'
import ProductCsvDownload from './components/ProductCsvDownload'


function App() {
  const [token, setToken] = useState<string | null>(null)
  const handleLogout = () => {
    setToken(null)
  }
  
  return (
    <>
      <LoginForm  onLogin={setToken} />
      
      {token && (
        <>
          <button type="button" onClick={handleLogout}>
            ログアウト
          </button>
          <ProductForm token={token} onLogout={handleLogout} />
          <ProductCsvUpload token={token} onLogout={handleLogout} />
          <ProductCsvDownload token={token} onLogout={handleLogout} />
          <ProductSearch token={token} onLogout={handleLogout} />
        </>
       )}
    </>
  )
}

export default App