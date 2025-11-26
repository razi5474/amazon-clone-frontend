// src/components/PromoCard.jsx
import React from "react";
import "./promo.css";

const PromoCard = ({ title, subtitle, image }) => {
  return (
    <div className="promo-card">
      {image && <img src={image} alt={title} className="promo-image" />}
      <div className="promo-text">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
};

export default PromoCard;
