import React from "react";
import {
  modalOverlayStyle,
  modalContentStyle,
  modalTitleStyle,
  labelStyle,
  valueStyle,
  buttonSecondaryStyle,
  buttonDangerStyle,
  messageSuccessStyle,
  messageErrorStyle,
  warningBoxStyle,
} from "./adminStyles";

export default function DeleteProductConfirmModal({
  isOpen,
  onClose,
  deletingProduct,
  productHasStock,
  onConfirm,
  isSubmitting,
  message,
}) {
  if (!isOpen || !deletingProduct) return null;

  return (
    <div style={{ ...modalOverlayStyle, zIndex: 10002 }} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ ...modalTitleStyle, color: "#dc3545", marginBottom: "20px" }}>
          Confirm Deletion
        </h2>

        {productHasStock && (
          <div style={warningBoxStyle}>
            <div style={{ fontWeight: "700", marginBottom: "8px", fontFamily: "'Fragment Mono', monospace" }}>
              ⚠️ Warning: Product has stock
            </div>
            <div style={{ fontSize: "14px", fontFamily: "'Fragment Mono', monospace" }}>
              Этот товар есть на складе. Если вы удалите его, этот товар больше не сможет продаваться. Все остатки на складе будут удалены.
            </div>
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <div style={labelStyle}>Product Name</div>
          <div style={valueStyle}>{deletingProduct.name}</div>
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
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            style={{
              ...buttonDangerStyle,
              background: isSubmitting ? "#ccc" : "#dc3545",
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
