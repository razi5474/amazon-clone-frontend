import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import api from "../api/api";
import toast from "react-hot-toast";
import PaymentForm from "../components/PaymentForm";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./style/Checkout.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    createPayment();
  }, []);

  const createPayment = async () => {
    try {
      const res = await api.post("/payment/stripe");
      setClientSecret(res.data.clientSecret);
      setAmount(res.data.amount);
    } catch (err) {
      toast.error("Payment initialization failed");
    }
  };

  return (
    <>
      <Header />

      <main className="container" style={{ maxWidth: "500px" }}>
        <h2>Checkout</h2>

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm amount={amount} clientSecret={clientSecret} />
          </Elements>
        )}
      </main>

      <Footer />
    </>
  );
}
