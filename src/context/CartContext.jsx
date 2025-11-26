import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count from backend when user logs in
  useEffect(() => {
    const fetchCartCount = async () => {
      if (user && token) {
        try {
          const res = await api.get("/cart");
          const count = res.data?.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;
          setCartCount(count);
        } catch (err) {
          console.error("Failed to fetch cart count", err);
        }
      } else {
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, [user, token]);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
