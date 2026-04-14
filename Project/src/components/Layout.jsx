import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

function Layout() {
  return (
    <>
      <Header />
      <main className="container">
        <div className="row">
          <div className="col">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Layout
