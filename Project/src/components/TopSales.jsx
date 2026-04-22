import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7070'

function TopSales() {
  // Состояние блока "Хиты продаж".
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCancelled = false

    async function loadTopSales() {
      setIsLoading(true)
      setError('')

      try {
        // Загружаем хиты продаж с бэкенда.
        const response = await fetch(`${API_BASE_URL}/api/top-sales`)
        if (!response.ok) {
          throw new Error('Не удалось загрузить хиты продаж')
        }

        const data = await response.json()
        if (!isCancelled) {
          setItems(data)
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message)
          setItems([])
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadTopSales()

    return () => {
      isCancelled = true
    }
  }, [])

  // По ТЗ: если массив пустой, компонент не отображается.
  if (!isLoading && !error && items.length === 0) {
    return null
  }

  return (
    <section className="top-sales">
      <h2 className="text-center">Хиты продаж!</h2>

      {isLoading && (
        <div className="preloader">
          <span />
          <span />
          <span />
          <span />
        </div>
      )}

      {error && <p className="text-center text-danger">{error}</p>}

      {!isLoading && !error && items.length > 0 && (
        <div className="row">
          {items.map((item) => (
            <div className="col-4" key={item.id}>
              <div className="card catalog-item-card">
                <img src={item.images?.[0]} className="card-img-top img-fluid" alt={item.title} />
                <div className="card-body">
                  <p className="card-text">{item.title}</p>
                  <p className="card-text">{item.price} руб.</p>
                  <Link to={`/catalog/${item.id}.html`} className="btn btn-outline-primary">
                    Заказать
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default TopSales
