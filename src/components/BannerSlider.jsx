// src/components/BannerSlider.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./banner.css";

// import your images from src/assets (Option 2)
import banner1 from "../assets/banner-1.jpg";
import banner2 from "../assets/banner-2.jpg";
import banner3 from "../assets/banner-3.jpg";

const slides = [
  { img: banner1, title: "Big Sale • Up to 70% OFF", subtitle: "Hurry — limited time" },
  { img: banner3, title: "New Arrivals", subtitle: "Latest gadgets & more" },
  { img: banner2, title: "Home Essentials", subtitle: "Everything for your home" },
];

const BannerSlider = () => {
  return (
    <div className="banner-slider">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
      >
        {slides.map((s, idx) => (
          <SwiperSlide key={idx}>
            <div className="banner-slide">
              <img src={s.img} alt={s.title} className="banner-img" />
              <div className="banner-overlay">
                <h1 className="banner-title">{s.title}</h1>
                <p className="banner-sub">{s.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
