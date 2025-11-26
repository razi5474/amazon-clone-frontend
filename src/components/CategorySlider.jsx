import React from "react";
import CategoryCard from "./CategoryCard";
import { FaTv, FaHome, FaTshirt, FaUtensils, FaHeadphones,FaQuestion } from "react-icons/fa";
import "./category.css";

const categories = [
  { id: 1, name: "Electronics", icon: <FaTv size={28} /> },
  { id: 2, name: "Home", icon: <FaHome size={28} /> },
  { id: 3, name: "Fashion", icon: <FaTshirt size={28} /> },
  { id: 4, name: "Kitchen", icon: <FaUtensils size={28} /> },
  { id: 5, name: "Accessories", icon: <FaHeadphones size={28} /> },

  // Placeholder categories to fill space
  { id: 6, name: "Coming Soon", icon: <FaQuestion size={28} />, placeholder: true },
  { id: 7, name: "Coming Soon", icon: <FaQuestion size={28} />, placeholder: true },
  { id: 8, name: "Coming Soon", icon: <FaQuestion size={28} />, placeholder: true },
];

const CategorySlider = () => {
  return (
    <div className="category-slider">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} name={cat.name} icon={cat.icon} />
      ))}
    </div>
  );
};

export default CategorySlider;
