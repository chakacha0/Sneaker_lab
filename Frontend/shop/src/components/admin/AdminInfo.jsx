import React from "react";
import { titleStyle, infoItemStyle, labelStyle, valueStyle } from "./adminStyles";

export default function AdminInfo({ user }) {
  return (
    <div>
      <h2 style={titleStyle}>Personal Information</h2>
      
      <div style={infoItemStyle}>
        <div style={labelStyle}>Email</div>
        <div style={valueStyle}>{user.email || "Not specified"}</div>
      </div>

      <div style={infoItemStyle}>
        <div style={labelStyle}>First Name</div>
        <div style={valueStyle}>{user.first_name || "Not specified"}</div>
      </div>

      <div style={infoItemStyle}>
        <div style={labelStyle}>Last Name</div>
        <div style={valueStyle}>{user.last_name || "Not specified"}</div>
      </div>

      <div style={infoItemStyle}>
        <div style={labelStyle}>Phone</div>
        <div style={valueStyle}>{user.phone_number || "Not specified"}</div>
      </div>

      <div style={infoItemStyle}>
        <div style={labelStyle}>Role</div>
        <div style={valueStyle}>
          <span style={{ 
            color: "#FF6B35", 
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>
            {user.role || "customer"}
          </span>
        </div>
      </div>

      <div style={infoItemStyle}>
        <div style={labelStyle}>Email Verified</div>
        <div style={valueStyle}>
          {user.email_verified ? (
            <span style={{ color: "#4CAF50" }}>✓ Yes</span>
          ) : (
            <span style={{ color: "#FF6B35" }}>✗ No</span>
          )}
        </div>
      </div>
    </div>
  );
}
