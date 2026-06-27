import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(product) {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id
      );

      // Product already in cart
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
         toast.error(`Only ${product.stock} item(s) available in stock.`);
          return prevItems;
        }

        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Product out of stock
      if (product.stock === 0) {
       toast.error("This product is out of stock.");
        return prevItems;
      }

      // Add first item
      return [...prevItems, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(id) {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  }

  function increaseQuantity(id) {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;

        if (item.quantity >= item.stock) {
         toast.error(`Only ${item.stock} item(s) available in stock.`);
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  }

  function decreaseQuantity(id) {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}