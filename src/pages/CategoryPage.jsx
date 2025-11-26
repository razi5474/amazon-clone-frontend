import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAllProducts } from "../api/productAPI";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CategorySidebar from "../components/CategorySidebar";

import "./style/CategoryPage.css";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchAllProducts()
      .then((data) => {
        const categoryProducts = data.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase().includes(categoryName.toLowerCase())
        );
        setProducts(categoryProducts);
        setFilteredProducts(categoryProducts);
      })
      .catch(() => {
        setProducts([]);
        setFilteredProducts([]);
      });
  }, [categoryName]);

  const handleFilter = (type, value) => {
    if (type === "price") {
      const filtered = products.filter(
        (p) => p.price >= value.min && p.price <= value.max
      );
      setFilteredProducts(filtered);
    } else if (type === "review") {
      const filtered = products.filter((p) => (p.rating || 0) >= value);
      setFilteredProducts(filtered);
    }
  };

  return (
    <>
      <Header />
      <main className="category-page container">
        <CategorySidebar onFilter={handleFilter} />
        <section className="category-products">
          <h2>{categoryName} Products</h2>
          {filteredProducts.length === 0 ? (
            <p>No products found in this category.</p>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CategoryPage;
