import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import logoImg from "../assets/Amazon.png";
import SearchBar from "./SearchBar";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import "./header.css";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOrdersClick = () => {
    if (!user) navigate("/login");
    else navigate("/orders");
  };

  const handleCartClick = () => {
    if (!user) navigate("/login");
    else navigate("/cart");
  };

  const handleAccountClick = () => {
    if (!user) navigate("/login");
    else setDropdownOpen((prev) => !prev);
  };

  return (
    <header className="amazon-header">
      {/* LEFT - LOGO */}
      <div className="header-left">
        <Link to="/" className="logo-btn">
          <img src={logoImg} alt="Amazon logo" className="logo-img" />
        </Link>
      </div>

      {/* CENTER - SEARCH */}
      <div className="header-search">
        <SearchBar />
      </div>

      {/* RIGHT - ACCOUNT & CART */}
      <div className="header-right">
        {/* ACCOUNT */}
        <div
          className="header-option account"
          tabIndex={0}
          onClick={handleAccountClick}
          ref={dropdownRef}
        >
          <span className="line1">
            Hello, {user ? user.name : "Guest"}
            {user && <span className="yellow-dot" />} {/* yellow dot */}
          </span>
          <span className="line2">{user ? "Account & Lists ▾" : "Sign In ▾"}</span>

          {/* DROPDOWN */}
          {dropdownOpen && user && (
            <div className="account-dropdown">
              {/* <Link to="/profile" className="dropdown-item">
                Account Settings
              </Link> */}
              <Link to="/orders" className="dropdown-item">
                Your Orders
              </Link>
              {/* <Link to="/wishlist" className="dropdown-item">
                Wishlist
              </Link> */}
              <button className="dropdown-item logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>

        {/* ORDERS */}
        <div
          className={`header-option orders ${!user ? "disabled" : ""}`}
          tabIndex={0}
          onClick={handleOrdersClick}
        >
          <span className="line1">Returns</span>
          <span className="line2">& Orders</span>
        </div>

        {/* CART */}
        <div className="header-cart" onClick={handleCartClick}>
          <FaShoppingCart className="cart-icon" />
          <span className="cart-text">Cart</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      </div>
    </header>
  );
};

export default Header;
