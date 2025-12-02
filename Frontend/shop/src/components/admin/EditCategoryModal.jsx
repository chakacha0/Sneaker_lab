import React from "react";
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

export default function EditCategoryModal({
  isOpen,
  onClose,
  editingCategory,
  newCategory,
  setNewCategory,
  onSubmit,
  isSubmitting,
  message,
}) {
  if (!isOpen || !editingCategory) return null;

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Edit Category</h2>
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
            <label style={labelStyle}>Category Name *</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              required
              style={inputStyle}
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
              {isSubmitting ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
