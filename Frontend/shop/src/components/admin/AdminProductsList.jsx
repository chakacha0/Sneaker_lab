import React from "react";
import { getImageUrl } from "../../utils/imageUrl";
import { titleStyle, buttonPrimaryStyle } from "./adminStyles";

export default function AdminProductsList({
  products,
  productsLoading,
  onAddProduct,
  onViewStock,
  onEditProduct,
  onDeleteProduct,
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ ...titleStyle, marginBottom: 0, marginTop: "5px" }}>Products</h2>
        <button
          onClick={onAddProduct}
          style={buttonPrimaryStyle}
          onMouseEnter={(e) => {
            e.target.style.background = "#FF8C42";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(255, 107, 53, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#FF6B35";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(255, 107, 53, 0.3)";
          }}
        >
          + Add Product
        </button>
      </div>
      
      {productsLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#FF6B35" }}>
          Loading products...
        </div>
      ) : products.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "25px",
          marginTop: "20px"
        }}>
          {products.map((product) => (
            <div
              key={product.product_id}
              style={{
                background: "#f5f5f5",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #ddd",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                e.currentTarget.style.borderColor = "#FF6B35";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "#ddd";
              }}
            >
              {product.image_url && (
                <div style={{
                  width: "100%",
                  height: "200px",
                  marginBottom: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fff",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}>
                  <img
                    src={getImageUrl(product.image_url)}
                    alt={product.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain"
                    }}
                  />
                </div>
              )}
              <div style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#FF6B35",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                {product.name}
              </div>
              {product.brand && (
                <div style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "8px",
                  fontFamily: "'Fragment Mono', monospace"
                }}>
                  Brand: {product.brand}
                </div>
              )}
              {product.category && (
                <div style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "8px",
                  fontFamily: "'Fragment Mono', monospace"
                }}>
                  Category: {product.category}
                </div>
              )}
              {product.price && (
                <div style={{
                  fontSize: "16px",
                  color: "#333",
                  fontWeight: "600",
                  marginBottom: "15px",
                  fontFamily: "'Fragment Mono', monospace"
                }}>
                  Price: ${product.price}
                </div>
              )}
              <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                <button
                  onClick={() => onViewStock(product)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    background: "transparent",
                    color: "#FF6B35",
                    border: "2px solid #FF6B35",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    transition: "all 0.3s ease",
                    fontFamily: "'Fragment Mono', monospace",
                  }}
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
                  View Stock
                </button>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => onEditProduct(product)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      fontSize: "13px",
                      fontWeight: "600",
                      background: "transparent",
                      color: "#007bff",
                      border: "2px solid #007bff",
                      borderRadius: "8px",
                      cursor: "pointer",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      transition: "all 0.3s ease",
                      fontFamily: "'Fragment Mono', monospace",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#007bff";
                      e.target.style.color = "#fff";
                      e.target.style.boxShadow = "0 4px 15px rgba(0, 123, 255, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.color = "#007bff";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteProduct(product)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      fontSize: "13px",
                      fontWeight: "600",
                      background: "transparent",
                      color: "#dc3545",
                      border: "2px solid #dc3545",
                      borderRadius: "8px",
                      cursor: "pointer",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      transition: "all 0.3s ease",
                      fontFamily: "'Fragment Mono', monospace",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#dc3545";
                      e.target.style.color = "#fff";
                      e.target.style.boxShadow = "0 4px 15px rgba(220, 53, 69, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.color = "#dc3545";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "#666",
          fontSize: "18px",
          fontFamily: "'Fragment Mono', monospace"
        }}>
          <p>No products found</p>
        </div>
      )}
    </div>
  );
}
