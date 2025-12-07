import React from "react";
import { titleStyle, buttonPrimaryStyle } from "./adminStyles";

export default function AdminPromoCodesList({
  promoCodes,
  promoCodesLoading,
  onAddPromoCode,
  onEditPromoCode,
  onDeletePromoCode,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  const formatDiscount = (promoCode) => {
    if (promoCode.discount_percent) {
      return `${promoCode.discount_percent}%`;
    } else if (promoCode.discount_amount) {
      return `${promoCode.discount_amount} $`;
    }
    return "N/A";
  };

  const isActive = (promoCode) => {
    const now = new Date();
    const validFrom = promoCode.valid_from ? new Date(promoCode.valid_from) : null;
    const validTo = promoCode.valid_to ? new Date(promoCode.valid_to) : null;
    
    if (validFrom && now < validFrom) return false;
    if (validTo && now > validTo) return false;
    if (promoCode.usage_limit && promoCode.used_count >= promoCode.usage_limit) return false;
    
    return true;
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ ...titleStyle, marginBottom: 0, marginTop: "5px" }}>Promo Codes</h2>
        <button
          onClick={onAddPromoCode}
          style={buttonPrimaryStyle}
          onMouseEnter={(e) => {
            e.target.style.background = "#FF8C42";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(255, 107, 53, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#FF6B35";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(255, 107, 53, 0.3)";
          }}
        >
          + Add Promo Code
        </button>
      </div>
      
      {promoCodesLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#FF6B35" }}>
          Loading promo codes...
        </div>
      ) : promoCodes.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "25px",
          marginTop: "20px"
        }}>
          {promoCodes.map((promoCode) => (
            <div
              key={promoCode.promo_id}
              style={{
                background: "#f5f5f5",
                borderRadius: "12px",
                padding: "20px",
                border: `2px solid ${isActive(promoCode) ? "#28a745" : "#ddd"}`,
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                e.currentTarget.style.borderColor = "#FF6B35";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = isActive(promoCode) ? "#28a745" : "#ddd";
              }}
            >
              {isActive(promoCode) && (
                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "#28a745",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  fontFamily: "'Fragment Mono', monospace",
                }}>
                  Active
                </div>
              )}
              
              <div style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#FF6B35",
                marginBottom: "15px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontFamily: "'Fragment Mono', monospace",
              }}>
                {promoCode.code}
              </div>
              
              <div style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "10px",
              }}>
                Discount: {formatDiscount(promoCode)}
              </div>
              
              {promoCode.min_order_price && (
                <div style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "8px",
                  fontFamily: "'Fragment Mono', monospace",
                }}>
                  Min order: {promoCode.min_order_price} $
                </div>
              )}
              
              <div style={{
                fontSize: "12px",
                color: "#999",
                marginBottom: "8px",
                fontFamily: "'Fragment Mono', monospace",
              }}>
                Valid from: {formatDate(promoCode.valid_from)}
              </div>
              
              <div style={{
                fontSize: "12px",
                color: "#999",
                marginBottom: "8px",
                fontFamily: "'Fragment Mono', monospace",
              }}>
                Valid to: {formatDate(promoCode.valid_to)}
              </div>
              
              {promoCode.usage_limit && (
                <div style={{
                  fontSize: "12px",
                  color: "#666",
                  marginBottom: "8px",
                  fontFamily: "'Fragment Mono', monospace",
                }}>
                  Used: {promoCode.used_count || 0} / {promoCode.usage_limit}
                </div>
              )}
              
              <div style={{
                fontSize: "12px",
                color: "#666",
                fontFamily: "'Fragment Mono', monospace",
                marginBottom: "15px"
              }}>
                ID: {promoCode.promo_id}
              </div>
              
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => onEditPromoCode(promoCode)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    background: "transparent",
                    color: "#FF6B35",
                    border: "2px solid #FF6B35",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    transition: "all 0.3s ease",
                    fontFamily: "'Fragment Mono', monospace",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#FF6B35";
                    e.target.style.color = "#fff";
                    e.target.style.boxShadow = "0 4px 15px rgba(255, 107, 53, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#FF6B35";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeletePromoCode(promoCode)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    background: "transparent",
                    color: "#dc3545",
                    border: "2px solid #dc3545",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    transition: "all 0.3s ease",
                    fontFamily: "'Fragment Mono', monospace",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#dc3545";
                    e.target.style.color = "#fff";
                    e.target.style.boxShadow = "0 4px 15px rgba(220, 53, 69, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#dc3545";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "#666",
          fontSize: "18px",
          fontFamily: "'Fragment Mono', monospace"
        }}>
          <p>No promo codes found</p>
        </div>
      )}
    </div>
  );
}
