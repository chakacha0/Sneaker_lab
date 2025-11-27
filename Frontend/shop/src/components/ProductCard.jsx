import React from "react";

function ProductCard({ product }) {
    const cardStyle = {
        fontFamily: "'Archivo Black', sans-serif",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s",
    };

    const imageStyle = {
        background: "#f0f0f0",
        height: "150px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    const infoStyle = {
        padding: "10px",
    };

    const nameStyle = { fontSize: "16px", margin: "0 0 6px 0" };
    const brandStyle = { color: "#777", fontSize: "13px", marginBottom: "6px" };
    const priceStyle = { fontWeight: "bold", fontSize: "15px", color: "#333" };

    return (
        <div
            style={cardStyle}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
            <div style={imageStyle}>
                <img
                    src={product.image_url || "https://via.placeholder.com/400x300?text=No+Image"}
                    alt={product.name}
                />
            </div>
            <div style={infoStyle}>
                <h2 style={nameStyle}>{product.name}</h2>
                <p style={brandStyle}>{product.brand}</p>
                <p style={priceStyle}>{product.price} €</p>
            </div>
        </div>
    );
}

export default ProductCard;
