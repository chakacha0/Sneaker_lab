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

export default function AddAdministratorModal({
  isOpen,
  onClose,
  onSearch,
  searchResults,
  searchLoading,
  onPromote,
  isSubmitting,
  message,
}) {
  const [emailQuery, setEmailQuery] = useState("");

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (emailQuery.trim().length >= 2) {
      onSearch(emailQuery.trim());
    }
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={{ ...modalContentStyle, maxWidth: "700px" }} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Add Administrator</h2>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Search by Email</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                placeholder="Enter email to search..."
                style={inputStyle}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || emailQuery.trim().length < 2}
                style={{
                  ...buttonPrimaryStyle,
                  background: (isSubmitting || emailQuery.trim().length < 2) ? "#ccc" : "#FF6B35",
                  cursor: (isSubmitting || emailQuery.trim().length < 2) ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Search
              </button>
            </div>
          </div>
        </form>

        {message && (
          <div style={message.includes("успешно") ? messageSuccessStyle : messageErrorStyle}>
            {message}
          </div>
        )}

        {searchLoading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#FF6B35" }}>
            Searching...
          </div>
        ) : searchResults && searchResults.length > 0 ? (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <div style={{ marginBottom: "15px", fontSize: "14px", color: "#666", fontFamily: "'Fragment Mono', monospace" }}>
              Found {searchResults.length} user(s):
            </div>
            {searchResults.map((user) => (
              <div
                key={user.user_id}
                style={{
                  padding: "15px",
                  marginBottom: "10px",
                  background: "#f5f5f5",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: "600", color: "#333", marginBottom: "5px" }}>
                    {user.first_name} {user.last_name}
                  </div>
                  <div style={{ fontSize: "14px", color: "#666", fontFamily: "'Fragment Mono', monospace" }}>
                    {user.email}
                  </div>
                  {user.role === "admin" && (
                    <div style={{ fontSize: "12px", color: "#FF6B35", marginTop: "5px", fontWeight: "600" }}>
                      Already Admin
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onPromote(user)}
                  disabled={isSubmitting || user.role === "admin"}
                  style={{
                    ...buttonPrimaryStyle,
                    background: (isSubmitting || user.role === "admin") ? "#ccc" : "#FF6B35",
                    cursor: (isSubmitting || user.role === "admin") ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    padding: "8px 16px",
                  }}
                >
                  {user.role === "admin" ? "Already Admin" : "Promote"}
                </button>
              </div>
            ))}
          </div>
        ) : searchResults && searchResults.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px",
            color: "#666",
            fontSize: "16px",
            fontFamily: "'Fragment Mono', monospace"
          }}>
            No users found
          </div>
        ) : null}

        <div style={{ display: "flex", gap: "15px", justifyContent: "flex-end", marginTop: "20px" }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            style={buttonSecondaryStyle}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
