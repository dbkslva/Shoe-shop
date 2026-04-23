import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { positionsCount } = useCart()

  const queryFromUrl = searchParams.get('q')?.trim() ?? ''

  const handleSearchToggle = () => {
    if (!isSearchOpen) {
      // При открытии поиска на каталоге подставляем текущее значение q.
      if (location.pathname === '/catalog.html' && queryFromUrl) {
        setQuery(queryFromUrl)
      }
      setIsSearchOpen(true)
      return
    }

    if (query.trim()) {
      navigate(`/catalog.html?q=${encodeURIComponent(query.trim())}`)
      return
    }

    setIsSearchOpen(false)
  }

  return (
    <header className="container-fluid bg-light px-0">
      <div className="container">
        <div className="row">
          <div className="col">
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <Link className="navbar-brand" to="/">
              <img src="/img/header-logo.png" alt="Bosa Noga" />
            </Link>
            <div className="collapse navbar-collapse" id="navbarMain">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">
                    Главная
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/catalog.html">
                    Каталог
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/about.html">
                    О магазине
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/contacts.html">
                    Контакты
                  </NavLink>
                </li>
              </ul>
              <div>
                <div className="header-controls-pics">
                  <div
                    data-id="search-expander"
                    className="header-controls-pic header-controls-search"
                    onClick={handleSearchToggle}
                  />
                  <Link className="header-controls-pic header-controls-cart" to="/cart.html">
                    {positionsCount > 0 && (
                      <div className="header-controls-cart-full">{positionsCount}</div>
                    )}
                    <div className="header-controls-cart-menu" />
                  </Link>
                </div>
                <form
                  data-id="search-form"
                  className={`header-controls-search-form form-inline ${isSearchOpen ? '' : 'invisible'}`}
                  onSubmit={(event) => event.preventDefault()}
                >
                  <input
                    className="form-control"
                    placeholder="Поиск"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </form>
              </div>
            </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
