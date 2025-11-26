import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../api/api";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import "./style/Cart.css";

export default function Cart() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  // =========================
  // FETCH CART
  // =========================
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      const data = res.data?.cart ?? res.data;
      const items = data?.items ?? [];

      const subtotal = items.reduce((sum, it) => {
        const price = it.product?.price || 0;
        return sum + price * it.quantity;
      }, 0);

      setCart({ items, subtotal });
    } catch (err) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE QTY
  // =========================
  const updateQty = async (productId, newQty) => {
    try {
      await api.put("/cart/update", {
        productId,
        quantity: newQty,
      });
      fetchCart();
    } catch (err) {
      toast.error("Failed to update cart");
    }
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const removeItem = async (productId) => {
    try {
      await api.delete("/cart/remove", {
        data: { productId },
      });
      toast.success("Removed from cart");
      fetchCart();
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  // =========================
  // PROCEED TO BUY → STRIPE
  // =========================
  const proceedToBuy = async () => {
    if (!user) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    if (!cart.items.length) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setProcessing(true);
      await api.post("/payment/stripe");
      navigate("/checkout");
    } catch (err) {
      toast.error("Failed to proceed to checkout");
    } finally {
      setProcessing(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <>
      <Header />

      <main className="cart-page container">

        {/* LEFT SIDE */}
        <div className="cart-left">
          <h2>Shopping Cart</h2>

          {loading ? (
            <p>Loading...</p>
          ) : cart.items.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cart.items.map((it) => {
              const p = it.product;
              return (
                <div className="amazon-cart-row" key={p._id}>
                  <img src={p.images?.[0]} alt={p.title} />

                  <div className="amazon-cart-details">
                    <h4 onClick={() => navigate(`/product/${p._id}`)}>
                      {p.title}
                    </h4>

                    <p className="in-stock">In stock</p>

                    <div className="amazon-actions">
                      <div className="qty-control">
                        <button onClick={() => updateQty(p._id, Math.max(1, it.quantity - 1))}>-</button>
                        <span>{it.quantity}</span>
                        <button onClick={() => updateQty(p._id, it.quantity + 1)}>+</button>
                      </div>

                      <button className="amazon-remove" onClick={() => removeItem(p._id)}>
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="amazon-price">
                    ₹ {(p.price * it.quantity).toLocaleString()}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT SIDE */}
        <aside className="cart-right">
          <div className="order-summary">
            <h3>
              Subtotal ({cart.items.length} items):
              <span> ₹ {cart.subtotal.toLocaleString()}</span>
            </h3>

            <button
              className="btn proceed"
              onClick={proceedToBuy}
              disabled={processing}
            >
              {processing ? "Processing..." : "Proceed to Buy"}
            </button>
          </div>
        </aside>

      </main>

      <Footer />
    </>
  );
}
