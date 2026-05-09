import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import BrandCard from "../components/BrandCard";
import { fetchProducts } from "../api/products";
import { fetchBrands } from "../api/brands";

function Home() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [menProducts, setMenProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);

  useEffect(() => {
    fetchBrands().then(setBrands);
    
    // Загружаем товары для мужчин и женщин
    fetchProducts({ gender: "male" }).then((products) => {
      // Берем первые 5 товаров для мужчин
      setMenProducts(products.slice(0, 5) || []);
    });
    
    fetchProducts({ gender: "female" }).then((products) => {
      // Берем первые 5 товаров для женщин
      setWomenProducts(products.slice(0, 5) || []);
    });
  }, []);

  const sectionStyle = {
    fontFamily: "'Unbounded', sans-serif",
    maxWidth: "1200px",
    margin: "10px auto 30px auto",
    padding: "0 20px",
  };

  const titleStyle = {
    fontFamily: "'Unbounded', sans-serif",
    fontSize: "20px",
    fontWeight: "700",
    color: "#FF6B35",
    textShadow: "0 0 15px rgba(255, 107, 53, 0.5)",
    marginBottom: "22px",
    marginTop: "0",
    paddingBottom: "5px",
    textTransform: "uppercase",
    letterSpacing: "2px",
    borderBottom: "3px solid #FF6B35",
    display: "inline-block",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
  };

  const productsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  };

  const sectionHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "22px",
  };

  const viewAllButtonStyle = {
    fontFamily: "'Unbounded', sans-serif",
    fontSize: "14px",
    fontWeight: "600",
    color: "#FF6B35",
    background: "transparent",
    border: "2px solid #FF6B35",
    borderRadius: "8px",
    padding: "8px 20px",
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
    textDecoration: "none",
    display: "inline-block",
  };

  const bannerContainerStyle = {
    position: "relative",
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto 30px auto",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  };

  const bannerImageStyle = {
    width: "100%",
    height: "auto",
    display: "block",
  };

  const bannerTextStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontFamily: "'Unbounded', sans-serif",
    fontSize: "clamp(32px, 5vw, 64px)",
    fontWeight: "700",
    color: "#fff",
    textShadow: "0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 107, 53, 0.6), 2px 2px 4px rgba(0, 0, 0, 0.5)",
    textTransform: "uppercase",
    letterSpacing: "4px",
    textAlign: "center",
    zIndex: 10,
    whiteSpace: "nowrap",
  };

  return (
    <div>
      {/* Баннер с новогодним поздравлением */}
      <div style={bannerContainerStyle}>
        <img 
          src="/bannner.png" 
          alt="Christmas Market Banner" 
          style={bannerImageStyle}
        />
        <div style={bannerTextStyle}>Best Sneakers for You</div>
      </div>

      {/* Секция брендов */}
      <section style={sectionStyle}>
        <h2 style={titleStyle}>Brands</h2>
        <div style={gridStyle}>
          {brands.map((brand) => (
            <BrandCard key={brand.brand_id} brand={brand} />
          ))}
        </div>
      </section>

      {/* Секция для мужчин */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={titleStyle}>For Men</h2>
          <button
            style={viewAllButtonStyle}
            onClick={() => navigate("/catalog?gender=male")}
            onMouseEnter={(e) => {
              e.target.style.background = "#FF6B35";
              e.target.style.color = "#fff";
              e.target.style.boxShadow = "0 4px 15px rgba(255, 107, 53, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#FF6B35";
              e.target.style.boxShadow = "none";
            }}
          >
            View All →
          </button>
        </div>
        <div style={productsGridStyle}>
          {menProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </section>

      {/* Секция для женщин */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={titleStyle}>For Women</h2>
          <button
            style={viewAllButtonStyle}
            onClick={() => navigate("/catalog?gender=female")}
            onMouseEnter={(e) => {
              e.target.style.background = "#FF6B35";
              e.target.style.color = "#fff";
              e.target.style.boxShadow = "0 4px 15px rgba(255, 107, 53, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#FF6B35";
              e.target.style.boxShadow = "none";
            }}
          >
            View All →
          </button>
        </div>
        <div style={productsGridStyle}>
          {womenProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
