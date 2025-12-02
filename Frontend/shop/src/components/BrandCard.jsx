import React from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";

function BrandCard({ brand }) {
  const navigate = useNavigate();

  const cardStyle = {
    fontFamily: "'Google Sans Flex', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "1px solid #ddd",
  };

  const imageStyle = {
    width: "180px",
    height: "180px",
    objectFit: "contain",
    marginBottom: "12px",
    transition: "all 0.3s ease",
  };

  const brandNameStyle = {
    color: "#FF6B35",
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
    textShadow: "0 0 8px rgba(255, 107, 53, 0.5)",
  };

  const handleClick = () => {
    // Переходим на каталог с фильтром по бренду
    navigate(`/catalog?brandId=${brand.brand_id}`);
  };

  return (
    <div
      style={cardStyle}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15), 0 0 30px rgba(255, 107, 53, 0.2)";
        e.currentTarget.style.borderColor = "#FF6B35";
        const img = e.currentTarget.querySelector("img");
        if (img) {
          img.style.transform = "scale(1.05)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
        e.currentTarget.style.borderColor = "#ddd";
        const img = e.currentTarget.querySelector("img");
        if (img) {
          img.style.transform = "scale(1)";
        }
      }}
    >
      <img src={getImageUrl(brand.image_url)} alt={brand.name} style={imageStyle} />
      <span style={brandNameStyle}>{brand.name}</span>
    </div>
  );
}

export default BrandCard;
