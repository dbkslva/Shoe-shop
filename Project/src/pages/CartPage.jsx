import { useState } from 'react'
import Banner from '../components/Banner'
import { useCart } from '../context/CartContext'

function CartPage() {
  const { cartItems, removeFromCart, totalPrice } = useCart()
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [agreement, setAgreement] = useState(false)
  const [formError, setFormError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    // Базовая валидация формы заказа перед отправкой на сервер.
    if (!phone.trim()) {
      setFormError('Введите телефон')
      return
    }

    if (!address.trim()) {
      setFormError('Введите адрес доставки')
      return
    }

    if (!agreement) {
      setFormError('Нужно согласиться с правилами доставки')
      return
    }

    setFormError('')
  }

  return (
    <>
      <Banner />
      <section className="cart">
        <h2 className="text-center">Корзина</h2>

        {cartItems.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Товар</th>
                  <th>Размер</th>
                  <th>Кол-во</th>
                  <th>Цена</th>
                  <th>Итого</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={`${item.id}-${item.size}`}>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    <td>{item.size}</td>
                    <td>{item.count}</td>
                    <td>{item.price} руб.</td>
                    <td>{item.price * item.count} руб.</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.id, item.size)}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} className="text-right">
                    Общая сумма
                  </td>
                  <td>{totalPrice} руб.</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </>
        )}
      </section>

      <section className="order">
        <h2 className="text-center">Оформить заказ</h2>
        <div className="card" style={{ maxWidth: '30rem', margin: '0 auto' }}>
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="phone">Телефон</label>
              <input
                className="form-control"
                id="phone"
                placeholder="Ваш телефон"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Адрес доставки</label>
              <input
                className="form-control"
                id="address"
                placeholder="Адрес доставки"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </div>
            <div className="form-group form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="agreement"
                checked={agreement}
                onChange={(event) => setAgreement(event.target.checked)}
              />
              <label className="form-check-label" htmlFor="agreement">
                Согласен с правилами доставки
              </label>
            </div>

            {formError && <p className="text-danger">{formError}</p>}

            <button type="submit" className="btn btn-outline-secondary" disabled={cartItems.length === 0}>
              Оформить
            </button>
          </form>
        </div>
      </section>
    </>
  )
}

export default CartPage
