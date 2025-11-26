import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AuthProvider from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderConfirmation from "./pages/OrderConfirmation";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#fff',
            background: '#333',
            fontWeight: '600',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          },
          success: { duration: 4000 },
          error: { duration: 4000 },
        }}
      />

      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/cart" element={
              <PrivateRoute><Cart /></PrivateRoute>
            }/>
            <Route path="/checkout" element={
              <PrivateRoute><Checkout /></PrivateRoute>
            }/>
            <Route path="/orders" element={
              <PrivateRoute><Orders /></PrivateRoute>
            }/>
            <Route path="/order-confirmation" element={
              <PrivateRoute><OrderConfirmation /></PrivateRoute>
            }/>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
