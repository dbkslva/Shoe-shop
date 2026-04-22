import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CART_STORAGE_KEY = 'bosa-noga-cart'
const CartContext = createContext(null)

function readCartFromStorage() {
  try {
    const rawValue = localStorage.getItem(CART_STORAGE_KEY)
    if (!rawValue) {
      return []
    }

    const parsed = JSON.parse(rawValue)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  // Единое состояние корзины для всех страниц приложения.
  const [cartItems, setCartItems] = useState(() => readCartFromStorage())

  // Сохраняем корзину в localStorage после каждого изменения.
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  function addToCart(product) {
    setCartItems((prevItems) => {
      const foundIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.size === product.size,
      )

      if (foundIndex === -1) {
        return [...prevItems, product]
      }

      const updatedItems = [...prevItems]
      updatedItems[foundIndex] = {
        ...updatedItems[foundIndex],
        count: Math.min(10, updatedItems[foundIndex].count + product.count),
      }

      return updatedItems
    })
  }

  function removeFromCart(id, size) {
    setCartItems((prevItems) => prevItems.filter((item) => !(item.id === id && item.size === size)))
  }

  function updateCartItemCount(id, size, nextCount) {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id || item.size !== size) {
          return item
        }

        return {
          ...item,
          count: Math.max(1, Math.min(10, nextCount)),
        }
      }),
    )
  }

  function clearCart() {
    setCartItems([])
  }

  const value = useMemo(() => {
    const positionsCount = cartItems.length
    const itemsCount = cartItems.reduce((acc, item) => acc + item.count, 0)
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.count, 0)

    return {
      cartItems,
      positionsCount,
      itemsCount,
      totalPrice,
      addToCart,
      removeFromCart,
      updateCartItemCount,
      clearCart,
    }
  }, [cartItems])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}
