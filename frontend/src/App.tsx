import ProductForm from './components/ProductForm'
import ProductSearch from './components/ProductSearch'
import ProductCsvUpload from './components/ProductCsvUpload'
import ProductCsvDownload from './components/ProductCsvDownload'

function App() {
  
  return (
    <>
      <ProductForm />
      <ProductCsvUpload />
      <ProductCsvDownload />
      <ProductSearch />
    </>
  )
}

export default App