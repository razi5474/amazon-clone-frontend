// src/components/PromoSlider.jsx
import React from "react";
import PromoCard from "./PromoCard";
import "./promo.css";

// Example promo items
const promos = [
  {
    id: 1,
    title: "Revamp Your Home & Style",
    subtitle: "Trending furniture & decor",
    image: "/assets/promo-home.png", // you can provide image
  },
  {
    id: 2,
    title: "Appliances for Home",
    subtitle: "Up to 50% Off",
    image: "/assets/promo-home.png",
  },
  {
    id: 3,
    title: "Headphones Starting at ₹149",
    subtitle: "Best deals on Audio",
    image: "/assets/promo-home.png",
  },
  {
    id: 4,
    title: "Amazon Fashion",
    subtitle: "Latest styles & offers",
    image: "/assets/promo-home.png",
  },
];

const PromoSlider = () => {
  return (
    <div className="promo-slider">
      {promos.map((item) => (
        <PromoCard
          key={item.id}
          title={item.title}
          subtitle={item.subtitle}
          image={item.image}
        />
      ))}
    </div>
  );
};

export default PromoSlider;
