import React from "react";
import {
  modalOverlayStyle,
  modalContentStyle,
  modalTitleStyle,
  buttonPrimaryStyle,
  buttonSecondaryStyle,
  buttonDangerStyle,
  messageSuccessStyle,
  messageErrorStyle,
} from "./adminStyles";

export default function DeleteBrandConfirmModal({
  isOpen,
  onClose,
  deletingBrand,
  onConfirm,
  isSubmitting,
  message,
}) {
  if (!isOpen || !deletingBrand) return null;

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={modalTitleStyle}>Confirm Deletion</h2>
        
        <p style={{
          fontSize: "16px",
          color: "#333",
          marginBottom: "20px",
          fontFamily: "'Fragment Mono', monospace",
        }}>
          Are you sure you want to delete the brand <strong>"{deletingBrand.name}"</strong>?
        </p>

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
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            style={{
              ...buttonDangerStyle,
              background: isSubmitting ? "#ccc" : "#dc3545",
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
