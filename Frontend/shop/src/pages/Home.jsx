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
  const [aiBannerQuery, setAiBannerQuery] = useState("");

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

  const handleAiBannerSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = aiBannerQuery.trim();
    if (!trimmedQuery) return;
    localStorage.setItem("sneakerlab_ai_query", trimmedQuery);
    navigate(`/catalog?ai=${encodeURIComponent(trimmedQuery)}`);
  };

  const sectionStyle = {
    fontFamily: "'Unbounded', sans-serif",
    maxWidth: "1200px",
    margin: "30px auto 0px auto",
    padding: "0 40px",
  };

  const titleStyle = {
    fontFamily: "'Unbounded', sans-serif",
    fontSize: "20px",
    fontWeight: "700",
    color: "#FF6B35",
    textShadow: "0 0 15px rgba(255, 107, 53, 0.5)",
    marginBottom: "10px",
    marginTop: "10px",
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
    marginBottom: "10px",
    marginTop: "20px",
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
    margin: "15px auto 30px auto",
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

  const aiBannerStyle = {
    maxWidth: "1200px",
    margin: "0 auto 35px auto",
    padding: "34px 40px",
    borderRadius: "24px",
    background:
      "radial-gradient(circle at 8% 20%, rgba(255, 255, 255, 0.75) 0, transparent 28%), linear-gradient(135deg, #FFF4B8 0%, #FFD6E8 35%, #C8F7DC 68%, #BDEBFF 100%)",
    boxShadow: "0 18px 45px rgba(109, 190, 143, 0.28)",
    border: "1px solid rgba(255, 255, 255, 0.75)",
    overflow: "hidden",
    position: "relative",
  };

  const aiBannerContentStyle = {
    position: "relative",
    zIndex: 2,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
    gap: "28px",
    alignItems: "center",
  };

  const aiBannerTitleStyle = {
    fontFamily: "'Unbounded', sans-serif",
    fontSize: "clamp(28px, 4vw, 48px)",
    fontWeight: "800",
    color: "#1F6F4A",
    lineHeight: 1.1,
    margin: "0 0 14px 0",
    textTransform: "uppercase",
    letterSpacing: "1px",
    textShadow: "0 2px 12px rgba(255, 255, 255, 0.8)",
  };

  const aiBannerTextStyle = {
    margin: 0,
    maxWidth: "620px",
    fontSize: "17px",
    lineHeight: 1.6,
    color: "#234033",
    fontFamily: "'Google Sans Flex', sans-serif",
    fontWeight: 600,
  };

  const aiBannerFormStyle = {
    padding: "18px",
    borderRadius: "18px",
    background: "rgba(255, 255, 255, 0.68)",
    boxShadow: "0 10px 30px rgba(255, 255, 255, 0.35)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const aiBannerInputStyle = {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "52px",
    padding: "14px 16px",
    fontSize: "15px",
    border: "1px solid rgba(31, 111, 74, 0.25)",
    borderRadius: "14px",
    outline: "none",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#234033",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const aiBannerButtonStyle = {
    minHeight: "52px",
    padding: "14px 18px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #1F8A5B 0%, #E85DA5 100%)",
    color: "#fff",
    cursor: "pointer",
    fontFamily: "'Unbounded', sans-serif",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
    boxShadow: "0 8px 20px rgba(232, 93, 165, 0.28)",
    transition: "all 0.25s ease",
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

      <section style={aiBannerStyle}>
        <div
          style={{
            position: "absolute",
            right: "-80px",
            top: "-80px",
            width: "240px",
            height: "240px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.35)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "-55px",
            bottom: "-70px",
            width: "190px",
            height: "190px",
            borderRadius: "50%",
            background: "rgba(232, 93, 165, 0.16)",
          }}
        />
        <div style={aiBannerContentStyle}>
          <div>
            <h2 style={aiBannerTitleStyle}>Know the vibe, not the pair?</h2>
            <p style={aiBannerTextStyle}>
              Tell our AI where you will wear them, what colors you like, your budget, or the comfort you need. It will open the catalog with your request ready to go.
            </p>
          </div>
          <form onSubmit={handleAiBannerSubmit} style={aiBannerFormStyle}>
            <input
              type="text"
              value={aiBannerQuery}
              onChange={(e) => setAiBannerQuery(e.target.value)}
              placeholder="e.g. light spring sneakers for daily walks under 150"
              style={aiBannerInputStyle}
            />
            <button
              type="submit"
              style={aiBannerButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 26px rgba(232, 93, 165, 0.36)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(232, 93, 165, 0.28)";
              }}
            >
              Ask AI Stylist
            </button>
          </form>
        </div>
      </section>

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
