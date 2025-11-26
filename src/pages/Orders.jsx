import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./style/Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/order");
      setOrders(res.data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="orders-page container">
        <div className="orders-header">
          <h2>Your Orders</h2>
          <input
            type="text"
            placeholder="Search orders"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <h3>No orders found</h3>
            <p>You haven’t placed any orders yet.</p>
            <button onClick={() => navigate("/")}>Continue Shopping</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders
              .filter((order) =>
                order._id.toLowerCase().includes(search.toLowerCase())
              )
              .map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-top">
                  <div>
                    <span>Order Placed</span>
                    <strong>{new Date(order.createdAt).toDateString()}</strong>
                  </div>

                  <div>
                    <span>Total</span>
                    <strong>₹ {order.totalAmount.toLocaleString()}</strong>
                  </div>

                  <div>
                    <span>Status</span>
                    <strong className={`status ${order.orderStatus}`}>
                      {order.orderStatus}
                    </strong>
                  </div>

                  <div>
                    <span>Order ID</span>
                    <strong>#{order._id.slice(-6)}</strong>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div className="order-item" key={item._id}>
                      <img src={item.product.images?.[0]} alt={item.product.title} />

                      <div className="order-item-info">
                        <h4>{item.product.title}</h4>
                        <p>Qty: {item.quantity}</p>
                        <p>₹ {item.price}</p>
                      </div>

                      <button onClick={() => navigate(`/product/${item.product._id}`)}>
                        Buy Again
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
