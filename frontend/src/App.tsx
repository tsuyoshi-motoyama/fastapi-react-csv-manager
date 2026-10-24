import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'

import Layout from './components/Layout'
import LoginForm from './components/LoginForm'
import ProductListPage from './pages/ProductListPage'
import ProductCreatePage from './pages/ProductCreatePage'
import ProductUploadPage from './pages/ProductUploadPage'
import { isTokenExpired } from './utils/jwt'

function App() {
  const [token, setToken] = useState<string | null>(() => {
    const savedToken = sessionStorage.getItem('access_token')

    if (!savedToken) {
      return null
    }

    if (isTokenExpired(savedToken)) {
      sessionStorage.removeItem('access_token')
      return null
    }

    return savedToken
  })

  const handleLogin = (newToken: string) => {
    sessionStorage.setItem('access_token', newToken)
    setToken(newToken)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('access_token')
    setToken(null)
  }
  
   return (
    <Routes>
      <Route
        path="/login"
        element={
          token
            ? <Navigate to="/products" replace />
            : <LoginForm onLogin={handleLogin} />
        }
      />

      <Route
        element={
          token
            ? <Layout onLogout={handleLogout} />
            : <Navigate to="/login" replace />
        }
      >

        <Route
          path="/products"
          element={
            <ProductListPage
              token={token!}
              onLogout={handleLogout}
            />
          }
        />
        
        <Route
          path="/products/new"
          element={
            <ProductCreatePage
              token={token!}
              onLogout={handleLogout}
            />
          }
        />

        <Route
          path="/products/upload"
          element={
            <ProductUploadPage
              token={token!}
              onLogout={handleLogout}
            />
          }
        />
      </Route>


      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App