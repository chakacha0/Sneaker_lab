import React from "react";

function BrandCard({ brand }) {
  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#fff",
    borderRadius: "12px",
    padding: "10px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s",
  };

  const imageStyle = {
    width: "250px",
    height: "190px",
    objectFit: "contain",
    marginBottom: "8px",
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <img src={brand.image_url} alt={brand.name} style={imageStyle} />
      <span>{brand.name}</span>
    </div>
  );
}

export default BrandCard;
