import React, { useState } from "react";
import {
  modalOverlayStyle,
  modalContentStyle,
  modalHeaderStyle,
  modalTitleStyle,
  closeButtonStyle,
  labelStyle,
  inputStyle,
  buttonPrimaryStyle,
  buttonSecondaryStyle,
  messageSuccessStyle,
  messageErrorStyle,
} from "./adminStyles";

export default function AddPromoCodeModal({
  isOpen,
  onClose,
  newPromoCode,
  setNewPromoCode,
  onSubmit,
  isSubmitting,
  message,
}) {
  const [discountType, setDiscountType] = useState("percent"); // "percent" or "amount"

  if (!isOpen) return null;

  const handleDiscountTypeChange = (type) => {
    setDiscountType(type);
    setNewPromoCode({
      ...newPromoCode,
      discount_percent: type === "percent" ? newPromoCode.discount_percent : null,
      discount_amount: type === "amount" ? newPromoCode.discount_amount : null,
    });
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Add New Promo Code</h2>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Promo Code *</label>
            <input
              type="text"
              value={newPromoCode.code || ""}
              onChange={(e) => setNewPromoCode({ ...newPromoCode, code: e.target.value.toUpperCase() })}
              required
              style={inputStyle}
              placeholder="SUMMER2024"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Discount Type *</label>
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => handleDiscountTypeChange("percent")}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: discountType === "percent" ? "#FF6B35" : "#f5f5f5",
                  color: discountType === "percent" ? "#fff" : "#333",
                  border: `2px solid ${discountType === "percent" ? "#FF6B35" : "#ddd"}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontFamily: "'Fragment Mono', monospace",
                }}
              >
                Percentage
              </button>
              <button
                type="button"
                onClick={() => handleDiscountTypeChange("amount")}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: discountType === "amount" ? "#FF6B35" : "#f5f5f5",
                  color: discountType === "amount" ? "#fff" : "#333",
                  border: `2px solid ${discountType === "amount" ? "#FF6B35" : "#ddd"}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontFamily: "'Fragment Mono', monospace",
                }}
              >
                Amount
              </button>
            </div>
          </div>

          {discountType === "percent" ? (
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Discount Percent *</label>
              <input
                type="number"
                min="1"
                max="100"
                value={newPromoCode.discount_percent || ""}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, discount_percent: e.target.value ? parseInt(e.target.value) : null })}
                required
                style={inputStyle}
                placeholder="10"
              />
            </div>
          ) : (
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Discount Amount ($) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newPromoCode.discount_amount || ""}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, discount_amount: e.target.value ? parseFloat(e.target.value) : null })}
                required
                style={inputStyle}
                placeholder="500"
              />
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Valid From</label>
            <input
              type="date"
              value={newPromoCode.valid_from || ""}
              onChange={(e) => setNewPromoCode({ ...newPromoCode, valid_from: e.target.value || null })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Valid To</label>
            <input
              type="date"
              value={newPromoCode.valid_to || ""}
              onChange={(e) => setNewPromoCode({ ...newPromoCode, valid_to: e.target.value || null })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Min Order Price ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={newPromoCode.min_order_price || ""}
              onChange={(e) => setNewPromoCode({ ...newPromoCode, min_order_price: e.target.value ? parseFloat(e.target.value) : null })}
              style={inputStyle}
              placeholder="1000"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Usage Limit</label>
            <input
              type="number"
              min="1"
              value={newPromoCode.usage_limit || ""}
              onChange={(e) => setNewPromoCode({ ...newPromoCode, usage_limit: e.target.value ? parseInt(e.target.value) : null })}
              style={inputStyle}
              placeholder="100"
            />
          </div>

          {message && (
            <div style={message.includes("успешно") ? messageSuccessStyle : messageErrorStyle}>
              {message}
            </div>
          )}

          <div style={{ display: "flex", gap: "15px", justifyContent: "flex-end" }}>
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
                background: isSubmitting ? "#ccc" : "#FF6B35",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Adding..." : "Add Promo Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
