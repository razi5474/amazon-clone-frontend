// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { fetchAllProducts } from "../api/productAPI";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

// Banner component (Swiper)
import BannerSlider from "../components/BannerSlider";
// Category slider + card
import CategorySlider from "../components/CategorySlider";

import "./style/home.css";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchAllProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  return (
    <>
      <Header />

      {/* Banner */}
      <main className="home-main">
        <section className="home-banner-wrap">
          <BannerSlider />
        </section>

        {/* Category horizontal slider */}
        <section className="home-categories-wrap">
          <CategorySlider />
        </section>

        <section className="home-sections container">
          {/* Top Picks */}
          <div className="section">
            <h2>Top Picks For You</h2>
            <div className="products-grid">
              {products.slice(0, 8).map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>

          {/* Electronics */}
          <div className="section">
            <h2>Electronics</h2>
            <div className="products-grid">
              {products
                .filter((p) => p.category === "Electronics")
                .slice(0, 8)
                .map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
            </div>
          </div>

          {/* Home Appliances */}
          <div className="section">
            <h2>Home Appliances</h2>
            <div className="products-grid">
              {products
                .filter((p) => p.category && p.category.includes("Appliances"))
                .slice(0, 8)
                .map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
