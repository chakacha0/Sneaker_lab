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

export default function EditProductModal({
  isOpen,
  onClose,
  editingProduct,
  editProduct,
  setEditProduct,
  editProductImagePreview,
  onImageChange,
  brandsForSelect,
  categories,
  onSubmit,
  isSubmitting,
  message,
}) {
  if (!isOpen || !editingProduct) return null;

  return (
    <div style={{ ...modalOverlayStyle, zIndex: 10001 }} onClick={onClose}>
      <div style={{ ...modalContentStyle, maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Edit Product</h2>
          <button onClick={onClose} style={closeButtonStyle} disabled={isSubmitting}>
            ×
          </button>
        </div>

        {message && (
          <div style={message.includes("успешно") ? messageSuccessStyle : messageErrorStyle}>
            {message}
          </div>
        )}

        <form onSubmit={onSubmit} onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
          }
        }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Product Name *</label>
            <input
              type="text"
              value={editProduct.name}
              onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
              required
              disabled={isSubmitting}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={editProduct.description}
              onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
              disabled={isSubmitting}
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Price</label>
            <input
              type="text"
              inputMode="decimal"
              value={editProduct.price}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setEditProduct({ ...editProduct, price: value });
                }
              }}
              disabled={isSubmitting}
              placeholder="0.00"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Brand</label>
            {brandsForSelect.length === 0 ? (
              <div style={{ color: "#FF6B35", fontSize: "14px", marginTop: "5px" }}>
                Загрузка брендов...
              </div>
            ) : (
              <>
                <select
                  value={editProduct.brand_id}
                  onChange={(e) => setEditProduct({ ...editProduct, brand_id: e.target.value })}
                  disabled={isSubmitting}
                  style={inputStyle}
                >
                  <option value="">Select Brand</option>
                  {brandsForSelect.map((brand) => (
                    <option key={brand.brand_id} value={brand.brand_id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                <div style={{ color: "#666", fontSize: "12px", marginTop: "5px", fontFamily: "'Fragment Mono', monospace" }}>
                  Если это новый бренд, добавьте сначала бренд
                </div>
              </>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Category</label>
            <select
              value={editProduct.category_id}
              onChange={(e) => setEditProduct({ ...editProduct, category_id: e.target.value })}
              disabled={isSubmitting}
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
              value={editProduct.gender}
              onChange={(e) => setEditProduct({ ...editProduct, gender: e.target.value })}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              style={inputStyle}
            />
            {editProductImagePreview && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={editProductImagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            )}
          </div>

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
                background: isSubmitting ? "#ccc" : "#FF6B35",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
