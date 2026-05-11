import React, { useMemo, useState } from "react";
import { getImageUrl } from "../../utils/imageUrl";
import { titleStyle, buttonPrimaryStyle } from "./adminStyles";

const filterToggleStyle = (active) => ({
  padding: "10px 16px",
  fontSize: "13px",
  fontWeight: "600",
  borderRadius: "8px",
  cursor: "pointer",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontFamily: "'Fragment Mono', monospace",
  border: active ? "2px solid #FF6B35" : "2px solid #ccc",
  background: active ? "#FF6B35" : "#fff",
  color: active ? "#000" : "#333",
  transition: "all 0.2s ease",
});

export default function AdminProductsList({
  products,
  productsLoading,
  onAddProduct,
  onViewStock,
  onEditProduct,
  onDeleteProduct,
}) {
  const [stockListFilter, setStockListFilter] = useState("all");

  const displayedProducts = useMemo(() => {
    if (stockListFilter === "out_only") {
      return products.filter((p) => p.has_stock === false);
    }
    return products;
  }, [products, stockListFilter]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ ...titleStyle, marginBottom: 0, marginTop: "5px" }}>Products</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setStockListFilter("out_only")}
            style={filterToggleStyle(stockListFilter === "out_only")}
          >
            Out of stock only
          </button>
          <button
            type="button"
            onClick={() => setStockListFilter("all")}
            style={filterToggleStyle(stockListFilter === "all")}
          >
            All products
          </button>
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
      </div>
      
      {productsLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#FF6B35" }}>
          Loading products...
        </div>
      ) : products.length > 0 ? (
        displayedProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              color: "#666",
              fontSize: "16px",
              fontFamily: "'Fragment Mono', monospace",
              border: "1px dashed #ccc",
              borderRadius: "12px",
              background: "#fafafa",
            }}
          >
            <p style={{ margin: 0 }}>No out-of-stock products. Everything has inventory.</p>
          </div>
        ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "25px",
          marginTop: "20px"
        }}>
          {displayedProducts.map((product) => {
            const outOfStock = product.has_stock === false;
            return (
            <div
              key={product.product_id}
              style={{
                background: "#f5f5f5",
                borderRadius: "12px",
                padding: "20px",
                border: outOfStock ? "2px solid #c62828" : "1px solid #ddd",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                e.currentTarget.style.borderColor = outOfStock ? "#e53935" : "#FF6B35";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = outOfStock ? "#c62828" : "#ddd";
              }}
            >
              {outOfStock && (
                <div
                  style={{
                    marginBottom: "12px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "#ffebee",
                    color: "#b71c1c",
                    fontSize: "13px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontFamily: "'Fragment Mono', monospace",
                    border: "1px solid #ef9a9a",
                  }}
                >
                  Out of stock — order inventory
                </div>
              )}
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
                  overflow: "hidden",
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
            );
          })}
        </div>
        )
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
