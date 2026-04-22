import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Banner from '../components/Banner'
import { useCart } from '../context/CartContext'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7070'

function ItemPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [item, setItem] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [count, setCount] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const availableSizes = useMemo(
    () => item?.sizes?.filter((size) => size.available) ?? [],
    [item],
  )

  useEffect(() => {
    let isCancelled = false

    async function loadItem() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(`${API_BASE_URL}/api/items/${id}`)
        if (!response.ok) {
          throw new Error('Не удалось загрузить товар')
        }

        const data = await response.json()
        if (!isCancelled) {
          setItem(data)
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadItem()

    return () => {
      isCancelled = true
    }
  }, [id])

  function handleAddToCart() {
    if (!item || !selectedSize) {
      return
    }

    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      size: selectedSize,
      count,
      image: item.images?.[0] ?? '',
    })
    navigate('/cart.html')
  }

  return (
    <>
      <Banner />
      <section className="catalog-item">
        <h2 className="text-center">Товар</h2>

        {isLoading && (
          <div className="preloader">
            <span />
            <span />
            <span />
            <span />
          </div>
        )}

        {error && <p className="text-center text-danger">{error}</p>}

        {!isLoading && !error && item && (
          <div className="row">
            <div className="col-5">
              <img src={item.images?.[0]} className="img-fluid" alt={item.title} />
            </div>
            <div className="col-7">
              <h3>{item.title}</h3>
              <p>
                Цена: <strong>{item.price} руб.</strong>
              </p>

              {availableSizes.length > 0 ? (
                <>
                  <p>
                    Размеры:
                    {availableSizes.map((size) => (
                      <button
                        key={size.size}
                        type="button"
                        className={`catalog-item-size btn btn-link ${
                          selectedSize === size.size ? 'selected' : ''
                        }`}
                        onClick={() => setSelectedSize(size.size)}
                      >
                        {size.size}
                      </button>
                    ))}
                  </p>
                  <p>
                    Количество:
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm ml-2"
                      onClick={() => setCount((prev) => Math.max(1, prev - 1))}
                    >
                      -
                    </button>
                    <span className="mx-2">{count}</span>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setCount((prev) => Math.min(10, prev + 1))}
                    >
                      +
                    </button>
                  </p>
                  <button
                    type="button"
                    className="btn btn-danger btn-block btn-lg"
                    disabled={!selectedSize}
                    onClick={handleAddToCart}
                  >
                    В корзину
                  </button>
                </>
              ) : (
                <p>Нет доступных размеров.</p>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  )
}

export default ItemPage
