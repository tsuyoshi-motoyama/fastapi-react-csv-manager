import { Link, Outlet } from 'react-router'

type LayoutProps = {
  onLogout: () => void
}

function Layout({ onLogout }: LayoutProps) {
  return (
    <>
      <header className="bg-gray-800 p-4 text-white">
        <nav className="flex items-center gap-6">
          <Link to="/products">商品一覧</Link>
          <Link to="/products/new">商品登録</Link>
          <Link to="/products/upload">CSVアップロード</Link>

          <button
            type="button"
            onClick={onLogout}
            className="ml-auto cursor-pointer"
          >
            ログアウト
          </button>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Layout