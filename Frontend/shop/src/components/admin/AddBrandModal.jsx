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

export default function AddBrandModal({
  isOpen,
  onClose,
  newBrand,
  setNewBrand,
  imagePreview,
  onImageChange,
  onSubmit,
  isSubmitting,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Add New Brand</h2>
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
            <label style={labelStyle}>Brand Name *</label>
            <input
              type="text"
              value={newBrand.name}
              onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={newBrand.description}
              onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
              rows="4"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Country</label>
            <input
              type="text"
              value={newBrand.country}
              onChange={(e) => setNewBrand({ ...newBrand, country: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Brand Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              style={inputStyle}
            />
            {imagePreview && (
              <div style={{
                marginTop: "15px",
                width: "100%",
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f5f5f5",
                borderRadius: "8px",
                overflow: "hidden",
              }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>
            )}
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
              {isSubmitting ? "Adding..." : "Add Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
