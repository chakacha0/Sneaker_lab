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

export default function AddProductModal({
  isOpen,
  onClose,
  newProduct,
  setNewProduct,
  productImagePreview,
  onImageChange,
  brandsForSelect,
  categories,
  onSubmit,
  isSubmitting,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={{ ...modalContentStyle, maxWidth: "700px" }} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Add New Product</h2>
          <button onClick={onClose} style={closeButtonStyle} disabled={isSubmitting}>
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
          }
        }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Product Name *</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              rows="4"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <label style={labelStyle}>Brand *</label>
              <span style={{ fontSize: "12px", color: "#999", fontStyle: "italic" }}>
                (Если это новый бренд, добавьте сначала бренд)
              </span>
            </div>
            <select
              value={newProduct.brand_id}
              onChange={(e) => setNewProduct({ ...newProduct, brand_id: e.target.value })}
              required
              style={inputStyle}
            >
              <option value="">Select Brand</option>
              {brandsForSelect.map((brand) => (
                <option key={brand.brand_id} value={brand.brand_id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Category</label>
            <select
              value={newProduct.category_id}
              onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
              style={inputStyle}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Gender</label>
            <select
              value={newProduct.gender}
              onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
              style={inputStyle}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              style={inputStyle}
            />
            {productImagePreview && (
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
                  src={productImagePreview}
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
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
