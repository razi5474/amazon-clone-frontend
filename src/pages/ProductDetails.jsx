import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../api/api";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCartPlus,
  FaBolt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext"; // adjust path if needed
import "./style/ProductDetails.css";
import { CartContext } from "../context/CartContext";

const Star = ({ filled, half }) => {
  if (filled) return <FaStar className="star filled" />;
  if (half) return <FaStarHalfAlt className="star filled" />;
  return <FaRegStar className="star" />;
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [qty, setQty] = useState(1);

  // reviews
  const [reviews, setReviews] = useState([]);
  const [ratingInput, setRatingInput] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);
  const [related, setRelated] = useState([]);

  const { setCartCount } =useContext(CartContext);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchRelated();
      fetchReviews();
      // set default main image
      setMainImage((prev) => prev || product.images?.[0] || "");
    }
    // eslint-disable-next-line
  }, [product]);

  // fetch product
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/product/${id}`);
      const p = res.data.product ?? res.data;
      setProduct(p);
      setMainImage(p.images?.[0] ?? "");
    } catch (err) {
      console.error("Error fetching product", err);
      toast.error("Failed to load product");
    }
  };

  // fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await api.get(`/review/product/${id}`);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Error fetching reviews", err);
      setReviews([]);
    }
  };

  // get related by category
  const fetchRelated = async () => {
    try {
      const cat = product.category;
      if (!cat) return;
      const res = await api.get(`/product/category/${encodeURIComponent(cat)}`);
      const arr = res.data.products ?? res.data ?? [];
      const list = arr.filter((p) => String(p._id) !== String(product._id)).slice(0, 8);
      setRelated(list);
    } catch (err) {
      console.error("Error fetching related", err);
    }
  };

  const renderStarsInline = (rating) => {
    const stars = [];
    const full = Math.floor(rating || 0);
    const half = (rating || 0) % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < full) stars.push(<Star key={i} filled />);
      else if (i === full && half) stars.push(<Star key={i} half />);
      else stars.push(<Star key={i} />);
    }
    return stars;
  };

  // helper: check auth
  const ensureLoggedIn = () => {
    if (!user) {
      toast.error("Only logged-in users can use this feature");
      setTimeout(() => navigate("/login"), 700);
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
  // stop here if user not logged in
  if (!ensureLoggedIn()) return;

  try {
    await api.post("/cart/add", { productId: product._id, quantity: qty });
    toast.success("Added to cart");
    // Fetch latest cart count
    const res = await api.get("/cart");
    const count = res.data?.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;
    setCartCount(count);
    navigate("/cart");
  } catch (err) {
    const msg = err.response?.data?.error || "Failed to add to cart";
    toast.error(msg);

    // if backend still returns 401
    if (err.response?.status === 401) {
      toast.error("Please login to use the cart");
      setTimeout(() => navigate("/login"), 600);
    }
  }
};

  const handleBuyNow = async () => {
  if (!ensureLoggedIn()) return;

  try {
    await api.post("/cart/add", { productId: product._id, quantity: qty });
    navigate("/checkout");
  } catch (err) {
    const msg = err.response?.data?.error || "Failed to proceed to checkout";
    toast.error(msg);

    if (err.response?.status === 401) {
      toast.error("Please login to continue");
      setTimeout(() => navigate("/login"), 600);
    }
  }
};

  // check if user purchased this product (frontend fast-check)
  const hasPurchasedFrontend = () => {
    if (!user) return false;
    const purchased = user.purchasedProducts || [];
    return purchased.some((pid) => String(pid) === String(product._id));
  };

  const handleSubmitReview = async () => {
    if (!ensureLoggedIn()) return;


    if (!ratingInput) {
      toast.error("Please select a rating");
      return;
    }

    

    setLoadingReview(true);
    try {
      await api.post("/review/create", {
        productId: product._id,
        rating: ratingInput,
        comment: commentInput,
      });

      toast.success("Review submitted — thank you!");
      setRatingInput(0);
      setCommentInput("");
      await fetchReviews();
      await fetchProduct(); // update product rating
    } catch (err) {
      console.error("Submit review error", err);
      const msg = err.response?.data?.message || err.response?.data?.error;
      if (msg) toast.error(msg);
      else toast.error("Failed to submit review");
      if (err.response?.status === 403) {
        // purchased check failed on backend
        toast.error("Only customers who purchased this product can submit a review");
      }
      if (err.response?.status === 401) {
        setTimeout(() => navigate("/login"), 700);
      }
    } finally {
      setLoadingReview(false);
    }
  };

  // rating distribution as counts & percentages
  const ratingStats = () => {
    const counts = { 5:0,4:0,3:0,2:0,1:0 };
    reviews.forEach(r => {
      const v = Math.round(r.rating);
      counts[v] = (counts[v] || 0) + 1;
    });
    const total = reviews.length;
    const perc = [5,4,3,2,1].map(s => total ? Math.round((counts[s]/total)*100) : 0);
    return { counts, perc, total };
  };

  if (!product) {
    return (
      <>
        <Header />
        <div className="container">Loading...</div>
        <Footer />
      </>
    );
  }

  const { perc, total } = ratingStats();

  return (
    <>
      <Header />

      <main className="product-details container">
        {/* LEFT: image gallery */}
        <aside className="left-col">
          <div className="image-viewport">
            <img src={mainImage} alt={product.title} className="main-image" />
          </div>

          {/* thumbnails single row (responsive) */}
          <div className="thumbs-row">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={`thumb ${mainImage === img ? "active" : ""}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </aside>

        {/* RIGHT: product meta */}
        <section className="right-col">
          <h1 className="pd-title">{product.title}</h1>

          <div className="meta-row">
            <div className="stars-inline">
              {renderStarsInline(product.rating)}
              <span className="rating-avg">{product.rating ?? 0}</span>
              <span className="review-count">({reviews.length} reviews)</span>
            </div>

            <div className="price-block">
              <div className="price">₹ {product.price.toLocaleString()}</div>
              <div className="tax-note">Inclusive of all taxes</div>
              <div className="availability">In stock: {product.stock ?? "—"}</div>
            </div>
          </div>

          {/* Full product description here (only once) */}
          <div className="product-description">
            <h3>Product description</h3>
            <p>{product.description}</p>
          </div>

          <div className="buy-row">
            <div className="qty-wrap">
              <label>Qty</label>
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {Array.from({ length: Math.min(10, product.stock || 10) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <button className="btn add-cart" onClick={handleAddToCart}>
              <FaCartPlus /> Add to Cart
            </button>

            <button className="btn buy-now" onClick={handleBuyNow}>
              <FaBolt /> Buy Now
            </button>
          </div>

          {/* short highlights (if any) */}
          <div className="short-features">
            <h3>About this item</h3>
            <ul>
              {product.highlights?.length ? (
                product.highlights.map((h, i) => <li key={i}>{h}</li>)
              ) : (
                <li>{product.description?.slice(0, 240)}</li>
              )}
            </ul>
          </div>
        </section>
      </main>

      {/* REVIEWS area: LEFT = summary + form, RIGHT = list */}
      <section className="product-bottom container reviews-layout">
        <aside className="reviews-summary-col">
          <h2>Customer reviews</h2>

          <div className="rating-summary">
            <div className="big-rating">
              <div className="big-number">{product.rating ?? 0}</div>
              <div className="big-stars">{renderStarsInline(product.rating)}</div>
              <div className="total-reviews">{reviews.length} ratings</div>
            </div>

            <div className="histogram">
              {[5,4,3,2,1].map((star, idx) => (
                <div key={star} className="hist-row">
                  <div className="star-label">{star}</div>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: `${perc[idx]}%` }} />
                  </div>
                  <div className="count">{/* counts not shown; could add */}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Write review */}
          <div className="write-review">
            <h3>Write a customer review</h3>
            <div className="select-rating">
              <label>Select Rating</label>
              <select value={ratingInput} onChange={(e) => setRatingInput(Number(e.target.value))}>
                <option value={0}>Select rating</option>
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Average</option>
                <option value={2}>2 - Poor</option>
                <option value={1}>1 - Terrible</option>
              </select>
            </div>

            <textarea
              placeholder="Share your experience..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />

            <button className="btn primary" onClick={handleSubmitReview} disabled={loadingReview}>
              {loadingReview ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </aside>

        <section className="reviews-list-col">
          <h3 className="mobile-heading">Customer reviews</h3>

          <div className="review-list">
            {reviews.length === 0 && <div className="no-reviews">No reviews yet</div>}
            {reviews.map((r) => (
              <div className="single-review" key={r._id}>
                <div className="rev-header">
                  <div className="rev-user">{r.user?.name ?? "User"}</div>
                  <div className="rev-stars">{renderStarsInline(r.rating)}</div>
                </div>
                <div className="rev-comment">{r.comment}</div>
                <div className="rev-date">{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>

          {/* related carousel below reviews */}
          {related.length > 0 && (
            <div className="related">
              <h3>Related items</h3>
              <div className="related-row">
                {related.map((r) => (
                  <div key={r._id} className="related-card" onClick={() => navigate(`/product/${r._id}`)}>
                    <img src={r.images?.[0]} alt={r.title} />
                    <div className="r-title">{r.title}</div>
                    <div className="r-price">₹ {r.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </section>

      <Footer />
    </>
  );
}
