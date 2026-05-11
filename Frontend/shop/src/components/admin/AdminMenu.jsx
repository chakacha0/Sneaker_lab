import React from "react";
import {
  menuStyle,
  menuTitleStyle,
  menuItemStyle,
  activeMenuItemStyle,
  logoutButtonStyle,
  menuDividerStyle,
  customerMenuTitleStyle,
} from "./adminStyles";

export default function AdminMenu({ activeTab, onTabChange, onLogout }) {
  return (
    <div style={menuStyle}>
      <h2 style={menuTitleStyle}>Admin Menu</h2>
      
      <div
        style={activeTab === "info" ? activeMenuItemStyle : menuItemStyle}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onTabChange("info");
        }}
        onMouseEnter={(e) => {
          if (activeTab !== "info") {
            e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
            e.currentTarget.style.borderColor = "#FF6B35";
          }
        }}
        onMouseLeave={(e) => {
          if (activeTab !== "info") {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
          }
        }}
      >
        Personal Info
      </div>

      <div
        style={activeTab === "brands" ? activeMenuItemStyle : menuItemStyle}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onTabChange("brands");
        }}
        onMouseEnter={(e) => {
          if (activeTab !== "brands") {
            e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
            e.currentTarget.style.borderColor = "#FF6B35";
          }
        }}
        onMouseLeave={(e) => {
          if (activeTab !== "brands") {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
          }
        }}
      >
        Brands
      </div>

      <div
        style={activeTab === "products" ? activeMenuItemStyle : menuItemStyle}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onTabChange("products");
        }}
        onMouseEnter={(e) => {
          if (activeTab !== "products") {
            e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
            e.currentTarget.style.borderColor = "#FF6B35";
          }
        }}
        onMouseLeave={(e) => {
          if (activeTab !== "products") {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
          }
        }}
      >
        Products
      </div>

      <div
        style={activeTab === "categories" ? activeMenuItemStyle : menuItemStyle}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onTabChange("categories");
        }}
        onMouseEnter={(e) => {
          if (activeTab !== "categories") {
            e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
            e.currentTarget.style.borderColor = "#FF6B35";
          }
        }}
        onMouseLeave={(e) => {
          if (activeTab !== "categories") {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
          }
        }}
      >
        Categories
      </div>

      <div
        style={activeTab === "administrators" ? activeMenuItemStyle : menuItemStyle}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onTabChange("administrators");
        }}
        onMouseEnter={(e) => {
          if (activeTab !== "administrators") {
            e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
            e.currentTarget.style.borderColor = "#FF6B35";
          }
        }}
        onMouseLeave={(e) => {
          if (activeTab !== "administrators") {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
          }
        }}
      >
        Administrators
      </div>

      <div
        style={activeTab === "promo-codes" ? activeMenuItemStyle : menuItemStyle}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onTabChange("promo-codes");
        }}
        onMouseEnter={(e) => {
          if (activeTab !== "promo-codes") {
            e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
            e.currentTarget.style.borderColor = "#FF6B35";
          }
        }}
        onMouseLeave={(e) => {
          if (activeTab !== "promo-codes") {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
          }
        }}
      >
        Promo Codes
      </div>

      <div
        style={activeTab === "customer-orders" ? activeMenuItemStyle : menuItemStyle}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onTabChange("customer-orders");
        }}
        onMouseEnter={(e) => {
          if (activeTab !== "customer-orders") {
            e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
            e.currentTarget.style.borderColor = "#FF6B35";
          }
        }}
        onMouseLeave={(e) => {
          if (activeTab !== "customer-orders") {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
          }
        }}
      >
        Customer orders
      </div>

      <div
        style={activeTab === "reports" ? activeMenuItemStyle : menuItemStyle}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onTabChange("reports");
        }}
        onMouseEnter={(e) => {
          if (activeTab !== "reports") {
            e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
            e.currentTarget.style.borderColor = "#FF6B35";
          }
        }}
        onMouseLeave={(e) => {
          if (activeTab !== "reports") {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
          }
        }}
      >
        Reports
      </div>

      {/* Разделитель между админскими и покупательскими вкладками */}
      <div>
        <h3 style={menuTitleStyle}>Customer Menu</h3>
      </div>

      <div
        style={activeTab === "favourites" ? activeMenuItemStyle : menuItemStyle}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onTabChange("favourites");
        }}
        onMouseEnter={(e) => {
          if (activeTab !== "favourites") {
            e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
            e.currentTarget.style.borderColor = "#FF6B35";
          }
        }}
        onMouseLeave={(e) => {
          if (activeTab !== "favourites") {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
          }
        }}
      >
        Favourites
      </div>

      <div
        style={activeTab === "cart" ? activeMenuItemStyle : menuItemStyle}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onTabChange("cart");
        }}
        onMouseEnter={(e) => {
          if (activeTab !== "cart") {
            e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
            e.currentTarget.style.borderColor = "#FF6B35";
          }
        }}
        onMouseLeave={(e) => {
          if (activeTab !== "cart") {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
          }
        }}
      >
        Cart
      </div>

      <div
        style={activeTab === "orders" ? activeMenuItemStyle : menuItemStyle}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onTabChange("orders");
        }}
        onMouseEnter={(e) => {
          if (activeTab !== "orders") {
            e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
            e.currentTarget.style.borderColor = "#FF6B35";
          }
        }}
        onMouseLeave={(e) => {
          if (activeTab !== "orders") {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
          }
        }}
      >
        Order History
      </div>

      <button
        onClick={onLogout}
        style={logoutButtonStyle}
        onMouseEnter={(e) => {
          e.target.style.background = "#FF6B35";
          e.target.style.color = "#000";
          e.target.style.boxShadow = "0 0 15px rgba(255, 107, 53, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "transparent";
          e.target.style.color = "#FF6B35";
          e.target.style.boxShadow = "none";
        }}
      >
        Log Out
      </button>
    </div>
  );
}
