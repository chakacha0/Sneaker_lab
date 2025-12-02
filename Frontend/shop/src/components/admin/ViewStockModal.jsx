import React from "react";
import {
  modalOverlayStyle,
  modalContentStyle,
  modalHeaderStyle,
  modalTitleStyle,
  closeButtonStyle,
  labelStyle,
  valueStyle,
  buttonPrimaryStyle,
} from "./adminStyles";

export default function ViewStockModal({
  isOpen,
  onClose,
  selectedProduct,
  productStock,
  stockLoading,
  onAddStock,
}) {
  if (!isOpen || !selectedProduct) return null;

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Stock Information</h2>
          <button onClick={onClose} style={closeButtonStyle}>
            ×
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div style={labelStyle}>Product Name</div>
          <div style={valueStyle}>{selectedProduct.name}</div>
        </div>

        {stockLoading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#FF6B35" }}>
            Loading stock information...
          </div>
        ) : productStock.length > 0 ? (
          <div>
            <div style={labelStyle}>Stock by Size</div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "15px",
              marginTop: "15px"
            }}>
              {productStock.map((stock) => (
                <div
                  key={stock.size}
                  style={{
                    padding: "15px",
                    background: stock.quantity > 0 ? "#d4edda" : "#f8d7da",
                    borderRadius: "8px",
                    border: `2px solid ${stock.quantity > 0 ? "#28a745" : "#dc3545"}`,
                    textAlign: "center"
                  }}
                >
                  <div style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: stock.quantity > 0 ? "#155724" : "#721c24",
                    marginBottom: "5px"
                  }}>
                    Size {stock.size}
                  </div>
                  <div style={{
                    fontSize: "16px",
                    color: stock.quantity > 0 ? "#155724" : "#721c24",
                    fontFamily: "'Fragment Mono', monospace"
                  }}>
                    Qty: {stock.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "40px",
            color: "#666",
            fontSize: "16px",
            fontFamily: "'Fragment Mono', monospace"
          }}>
            No stock information available
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", gap: "15px" }}>
          <button
            onClick={onAddStock}
            style={{
              ...buttonPrimaryStyle,
              background: "#28a745",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#218838";
              e.target.style.boxShadow = "0 4px 15px rgba(40, 167, 69, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#28a745";
              e.target.style.boxShadow = "none";
            }}
          >
            + Add Stock
          </button>
          <button
            onClick={onClose}
            style={buttonPrimaryStyle}
            onMouseEnter={(e) => {
              e.target.style.background = "#FF8C42";
              e.target.style.boxShadow = "0 4px 15px rgba(255, 107, 53, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#FF6B35";
              e.target.style.boxShadow = "none";
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
