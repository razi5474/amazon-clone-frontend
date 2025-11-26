import React, { useState } from "react";
import { FaTimes, FaStar } from "react-icons/fa";
import "./CategorySidebar.css";

const priceRanges = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
  { label: "₹2000 & Above", min: 2000, max: Infinity },
];

const reviewRanges = [
  { label: "4 Stars & Up", value: 4 },
  { label: "3 Stars & Up", value: 3 },
  { label: "2 Stars & Up", value: 2 },
  { label: "1 Star & Up", value: 1 },
];

const CategorySidebar = ({ onFilter }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [manualPrice, setManualPrice] = useState([0, 5000]);
  const [minPrice, maxPrice] = manualPrice;

  const applyManualPrice = () => {
    onFilter("price", { min: minPrice, max: maxPrice });
    if (mobileOpen) setMobileOpen(false);
  };

  const handlePriceClick = (range) => {
    onFilter("price", range);
    if (mobileOpen) setMobileOpen(false);
  };

  const handleReviewClick = (value) => {
    onFilter("review", value);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="filter-hamburger"
        onClick={() => setMobileOpen(true)}
      >
        Filter
      </button>

      <aside className={`category-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Filters</h3>
          <button
            className="close-btn desktop-hide"
            onClick={() => setMobileOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Price Section */}
        <div className="filter-section">
          <h4>Price</h4>

          {/* Predefined ranges */}
          <ul className="price-ranges">
            {priceRanges.map((range, i) => (
              <li key={i} onClick={() => handlePriceClick(range)}>
                {range.label}
              </li>
            ))}
          </ul>

          {/* Manual Price Input */}
          <div className="manual-price">
            <input
              type="number"
              value={minPrice}
              onChange={(e) =>
                setManualPrice([Number(e.target.value), maxPrice])
              }
              placeholder="Min"
            />
            <span>-</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) =>
                setManualPrice([minPrice, Number(e.target.value)])
              }
              placeholder="Max"
            />
            <button className="apply-btn" onClick={applyManualPrice}>
              Apply
            </button>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="filter-section">
          <h4>Customer Reviews</h4>
          <ul>
            {reviewRanges.map((r, i) => (
              <li key={i} onClick={() => handleReviewClick(r.value)}>
                {Array.from({ length: r.value }).map((_, i) => (
                  <FaStar key={i} color="#ff9900" />
                ))}
                & Up
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default CategorySidebar;
