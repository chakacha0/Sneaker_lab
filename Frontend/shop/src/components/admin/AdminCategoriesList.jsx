import React from "react";
import { titleStyle, buttonPrimaryStyle } from "./adminStyles";

export default function AdminCategoriesList({
  categories,
  categoriesLoading,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ ...titleStyle, marginBottom: 0, marginTop: "5px" }}>Categories</h2>
        <button
          onClick={onAddCategory}
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
          + Add Category
        </button>
      </div>
      
      {categoriesLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#FF6B35" }}>
          Loading categories...
        </div>
      ) : categories.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "25px",
          marginTop: "20px"
        }}>
          {categories.map((category) => (
            <div
              key={category.category_id}
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
              <div style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#FF6B35",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                {category.name}
              </div>
              {category.category_id && (
                <div style={{
                  fontSize: "12px",
                  color: "#666",
                  fontFamily: "'Fragment Mono', monospace",
                  marginBottom: "15px"
                }}>
                  ID: {category.category_id}
                </div>
              )}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => onEditCategory(category)}
                  style={{
                    flex: 1,
                    padding: "10px",
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
                  Edit
                </button>
                <button
                  onClick={() => onDeleteCategory(category)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    fontSize: "14px",
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
          <p>No categories found</p>
        </div>
      )}
    </div>
  );
}
