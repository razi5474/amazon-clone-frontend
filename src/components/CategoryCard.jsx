import React from "react";
import { useNavigate } from "react-router-dom";
import "./category.css";

const CategoryCard = ({ name, icon, placeholder }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!placeholder) {
      navigate(`/category/${name}`);
    }
  };

  return (
    <div
      className={`category-card ${placeholder ? "placeholder" : ""}`}
      onClick={handleClick}
      style={{ cursor: placeholder ? "default" : "pointer" }}
    >
      <div className="category-icon">{icon}</div>
      <span className="category-name">{name}</span>
    </div>
  );
};

export default CategoryCard;
