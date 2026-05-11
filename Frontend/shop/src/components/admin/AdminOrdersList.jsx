import React from "react";
import { getImageUrl } from "../../utils/imageUrl";
import { titleStyle, buttonPrimaryStyle } from "./adminStyles";
import { ORDER_STATUS_OPTIONS, getOrderStatusLabel } from "../../utils/orderStatus";

const selectStyle = {
  padding: "10px 12px",
  borderRadius: "8px",
  border: "2px solid #ddd",
  fontSize: "14px",
  fontFamily: "'Google Sans Flex', sans-serif",
  minWidth: "220px",
  cursor: "pointer",
  background: "#fff",
};

export default function AdminOrdersList({
  orders,
  ordersLoading,
  onReload,
  onStatusChange,
  updatingOrderId,
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h2 style={{ ...titleStyle, marginBottom: 0, marginTop: "5px" }}>
          Customer orders
        </h2>
        <button
          type="button"
          onClick={onReload}
          disabled={ordersLoading}
          style={{
            ...buttonPrimaryStyle,
            opacity: ordersLoading ? 0.6 : 1,
            cursor: ordersLoading ? "wait" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!ordersLoading) {
              e.target.style.background = "#FF8C42";
              e.target.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#FF6B35";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Refresh
        </button>
      </div>

      {ordersLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#FF6B35" }}>
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 20px",
            color: "#666",
            fontFamily: "'Google Sans Flex', sans-serif",
          }}
        >
          No orders yet
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => {
            const date = new Date(order.created_at);
            const formattedDate = date.toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            });
            const customer =
              [order.first_name, order.last_name].filter(Boolean).join(" ").trim() ||
              order.email ||
              `User #${order.user_id}`;
            const currentStatus = order.status || "processing";

            return (
              <div
                key={order.order_id}
                style={{
                  border: "2px solid #ddd",
                  borderRadius: "12px",
                  padding: "20px",
                  background: "#fafafa",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                    marginBottom: "16px",
                    paddingBottom: "14px",
                    borderBottom: "2px solid #FF6B35",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#666",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        marginBottom: "6px",
                        fontFamily: "'Google Sans Flex', sans-serif",
                      }}
                    >
                      Order #{order.order_id}
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
                        color: "#333",
                        fontWeight: "600",
                        fontFamily: "'Google Sans Flex', sans-serif",
                      }}
                    >
                      {formattedDate}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#444",
                        marginTop: "8px",
                        fontFamily: "'Google Sans Flex', sans-serif",
                      }}
                    >
                      {customer}
                      {order.email ? (
                        <span style={{ color: "#888", marginLeft: "8px" }}>
                          ({order.email})
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#FF6B35",
                        fontFamily: "'Google Sans Flex', sans-serif",
                      }}
                    >
                      {parseFloat(order.total_price).toFixed(2)} $
                    </div>
                    <div
                      style={{
                        marginTop: "12px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "6px",
                      }}
                    >
                      <label
                        htmlFor={`order-status-${order.order_id}`}
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          fontFamily: "'Google Sans Flex', sans-serif",
                        }}
                      >
                        Status
                      </label>
                      <select
                        id={`order-status-${order.order_id}`}
                        value={currentStatus}
                        disabled={updatingOrderId === order.order_id}
                        onChange={(e) =>
                          onStatusChange(order.order_id, e.target.value)
                        }
                        style={selectStyle}
                      >
                        {ORDER_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {updatingOrderId === order.order_id ? (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#FF6B35",
                            fontFamily: "'Google Sans Flex', sans-serif",
                          }}
                        >
                          Saving...
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: "13px", color: "#555", marginBottom: "10px" }}>
                  Current:{" "}
                  <strong style={{ color: "#333" }}>
                    {getOrderStatusLabel(currentStatus)}
                  </strong>
                  {order.promo_code ? (
                    <span style={{ marginLeft: "12px" }}>
                      Promo: {order.promo_code}
                    </span>
                  ) : null}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {(order.items || []).map((item) => (
                    <div
                      key={item.order_item_id}
                      style={{
                        background: "#fff",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                        overflow: "hidden",
                        fontFamily: "'Google Sans Flex', sans-serif",
                      }}
                    >
                      <div
                        style={{
                          height: "100px",
                          background: "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.image_url ? (
                          <img
                            src={getImageUrl(item.image_url)}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: "12px", color: "#999" }}>No image</span>
                        )}
                      </div>
                      <div style={{ padding: "10px", fontSize: "12px" }}>
                        <div
                          style={{
                            fontWeight: "600",
                            color: "#333",
                            marginBottom: "4px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.name}
                        </div>
                        <div style={{ color: "#666" }}>
                          {item.brand ? `${item.brand} · ` : ""}size {item.size} ×{" "}
                          {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
