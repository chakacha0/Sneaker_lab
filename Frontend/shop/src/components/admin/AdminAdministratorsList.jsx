import React from "react";
import { titleStyle, buttonPrimaryStyle } from "./adminStyles";

export default function AdminAdministratorsList({
  admins,
  adminsLoading,
  onAddAdministrator,
  onRemoveAdmin,
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ ...titleStyle, marginBottom: 0, marginTop: "5px" }}>Administrators</h2>
        <button
          onClick={onAddAdministrator}
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
          + Add Administrator
        </button>
      </div>
      
      {adminsLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#FF6B35" }}>
          Loading administrators...
        </div>
      ) : admins.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "25px",
          marginTop: "20px"
        }}>
          {admins.map((admin) => (
            <div
              key={admin.user_id}
              style={{
                background: "#f5f5f5",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #ddd",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                e.currentTarget.style.borderColor = "#FF6B35";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "#ddd";
              }}
            >
              <div style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#FF6B35",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                {admin.first_name} {admin.last_name}
              </div>
              <div style={{
                fontSize: "14px",
                color: "#666",
                fontFamily: "'Fragment Mono', monospace",
                marginBottom: "8px"
              }}>
                {admin.email}
              </div>
              {admin.phone_number && (
                <div style={{
                  fontSize: "12px",
                  color: "#999",
                  fontFamily: "'Fragment Mono', monospace",
                  marginBottom: "15px"
                }}>
                  {admin.phone_number}
                </div>
              )}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => onRemoveAdmin(admin)}
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
                  Remove Admin
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
          <p>No administrators found</p>
        </div>
      )}
    </div>
  );
}
