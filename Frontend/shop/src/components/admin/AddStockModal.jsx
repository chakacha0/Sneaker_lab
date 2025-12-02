import React from "react";
import {
  modalOverlayStyle,
  modalContentStyle,
  modalHeaderStyle,
  modalTitleStyle,
  closeButtonStyle,
  labelStyle,
  valueStyle,
  inputStyle,
  buttonPrimaryStyle,
  buttonSecondaryStyle,
  messageSuccessStyle,
  messageErrorStyle,
} from "./adminStyles";

export default function AddStockModal({
  isOpen,
  onClose,
  selectedProduct,
  newStock,
  setNewStock,
  onSubmit,
  isSubmitting,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div style={{ ...modalOverlayStyle, zIndex: 10001 }} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Add Stock</h2>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        {selectedProduct && (
          <div style={{ marginBottom: "20px" }}>
            <div style={labelStyle}>Product Name</div>
            <div style={valueStyle}>{selectedProduct.name}</div>
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Size *</label>
            <input
              type="number"
              value={newStock.size}
              onChange={(e) => setNewStock({ ...newStock, size: e.target.value })}
              required
              disabled={isSubmitting}
              style={inputStyle}
              placeholder="Enter size"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Quantity *</label>
            <input
              type="number"
              value={newStock.quantity}
              onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
              required
              disabled={isSubmitting}
              style={inputStyle}
              placeholder="Enter quantity"
            />
          </div>

          {message && (
            <div style={message.includes("успешно") ? messageSuccessStyle : messageErrorStyle}>
              {message}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "30px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={buttonSecondaryStyle}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...buttonPrimaryStyle,
                background: isSubmitting ? "#ccc" : "#28a745",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Adding..." : "Add Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
