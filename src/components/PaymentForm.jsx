import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import api from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./PaymentForm.css";

export default function PaymentForm({ amount, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      toast.error("Stripe not initialized");
      return;
    }

    setLoading(true);

    const card = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (result.error) {
      toast.error(result.error.message);
      setLoading(false);
      return;
    }

    if (result.paymentIntent.status === "succeeded") {
      try {
        await api.post("/order/create",{
          paymentMethod: "card"
        });
        navigate("/order-confirmation");
      } catch (err) {
        toast.error("Order confirmation failed");
      }
    }

    setLoading(false);
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h3>Pay ₹ {amount}</h3>

      <div className="stripe-field">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#000",
                "::placeholder": { color: "#999" },
              },
            },
          }}
        />
      </div>

      <button type="submit" disabled={loading || !stripe} className="payment-btn">
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
