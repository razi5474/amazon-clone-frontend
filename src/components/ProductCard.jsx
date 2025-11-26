import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar, FaCartPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import "./productCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cartCount, setCartCount } = useContext(CartContext);

  // Render stars for rating
  const renderStars = () => {
    const stars = [];
    const rating = Math.floor(product.rating || 0);
    const half = (product.rating || 0) % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < rating) stars.push(<FaStar key={i} className="star filled" />);
      else if (i === rating && half)
        stars.push(<FaStarHalfAlt key={i} className="star filled" />);
      else stars.push(<FaRegStar key={i} className="star" />);
    }
    return stars;
  };

  // Add to Cart
  const addToCart = async () => {
    if (!user) {
      toast.error("Please login first ❌");
      navigate("/login");
      return;
    }

    try {
      await api.post("/cart/add", {
        productId: product._id,
        quantity: 1,
      });

      // Fetch updated cart count from backend
      const res = await api.get("/cart");
      const count = res.data?.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;
      setCartCount(count);

      toast.success("Added to cart ✅");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add to cart ❌");
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-link">
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="product-img"
        />

        <h3 className="product-title">{product.title}</h3>

        <div className="product-rating">{renderStars()}</div>

        <p className="product-desc">{product.description?.slice(0, 100)}...</p>

        <p className="product-price">₹ {product.price.toLocaleString()}</p>
      </Link>

      <button className="btn add-cart-btn" onClick={addToCart}>
        <FaCartPlus /> Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
