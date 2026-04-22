import Banner from '../components/Banner'
import { useCart } from '../context/CartContext'

function CartPage() {
  const { cartItems, removeFromCart, totalPrice } = useCart()

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
    </>
  )
}

export default CartPage
