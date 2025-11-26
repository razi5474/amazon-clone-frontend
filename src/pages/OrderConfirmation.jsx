// src/pages/OrderConfirmation.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./style/OrderConfirmation.css";

export default function OrderConfirmation() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="order-confirmation container">
        <h2>🎉 Congratulations!</h2>
        <p>Your order has been successfully placed.</p>
        <button className="btn primary" onClick={() => navigate("/orders")}>
          View My Orders
        </button>
      </div>
      <Footer />
    </>
  );
}
