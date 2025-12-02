import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, removeCartItem, updateCartItemQuantity } from "../api/cart";
import AuthModal from "../components/AuthModal";
import { getImageUrl } from "../utils/imageUrl";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    
    if (!user) {
      setIsAuthModalOpen(true);
      setLoading(false);
      return;
    }

    try {
      const cartData = await getCart(user.user_id);
      setCart(cartData);
    } catch (error) {
      setMessage(error.message || "Ошибка загрузки корзины");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeCartItem(cartItemId);
      await loadCart();
      setMessage("Товар удален из корзины");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage(error.message || "Ошибка удаления товара");
    }
  };

  const handleQuantityChange = async (cartItemId, newQuantity, availableQuantity) => {
    if (newQuantity < 1) {
      return;
    }
    
    if (newQuantity > availableQuantity) {
      setMessage(`Недостаточно товара на складе. Доступно: ${availableQuantity}`);
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    try {
      await updateCartItemQuantity(cartItemId, newQuantity);
      await loadCart();
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Ошибка обновления количества");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Загрузка...
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Корзина пуста</h2>
        <button
          onClick={() => navigate("/catalog")}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Перейти в каталог
        </button>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => {
            setIsAuthModalOpen(false);
            if (localStorage.getItem("user")) {
              loadCart();
            }
          }}
        />
      </div>
    );
  }

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
  };

  const itemsContainerStyle = {
    flex: "2",
    minWidth: "300px",
  };

  const summaryStyle = {
    flex: "1",
    minWidth: "300px",
    backgroundColor: "#f9f9f9",
    padding: "24px",
    borderRadius: "12px",
    height: "fit-content",
    position: "sticky",
    top: "100px",
  };

  const itemStyle = {
    display: "flex",
    gap: "20px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  };

  const itemImageStyle = {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px",
  };

  const itemInfoStyle = {
    flex: "1",
  };

  const itemTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
  };

  const itemDetailsStyle = {
    color: "#666",
    fontSize: "14px",
    marginBottom: "8px",
  };

  const quantityControlStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "12px",
  };

  const quantityButtonStyle = {
    width: "32px",
    height: "32px",
    border: "1px solid #ddd",
    background: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const removeButtonStyle = {
    background: "none",
    border: "none",
    color: "#d00",
    cursor: "pointer",
    fontSize: "14px",
    textDecoration: "underline",
    marginTop: "8px",
  };

  const summaryTitleStyle = {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "20px",
  };

  const totalStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "2px solid #ddd",
  };

  const checkoutButtonStyle = {
    width: "100%",
    padding: "16px",
    fontSize: "18px",
    fontWeight: "bold",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
  };

  return (
    <div style={containerStyle}>
      <div style={itemsContainerStyle}>
        <h1 style={{ fontSize: "32px", marginBottom: "30px" }}>Корзина</h1>
        
        {message && (
          <div
            style={{
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: message.includes("удален") ? "#d4edda" : "#f8d7da",
              color: message.includes("удален") ? "#155724" : "#721c24",
              marginBottom: "20px",
            }}
          >
            {message}
          </div>
        )}

        {cart.items.map((item) => (
          <div key={item.cart_item_id} style={itemStyle}>
            <img
              src={getImageUrl(item.image_url) || "https://via.placeholder.com/120"}
              alt={item.name}
              style={itemImageStyle}
            />
            <div style={itemInfoStyle}>
              <h3 style={itemTitleStyle}>{item.name}</h3>
              <p style={itemDetailsStyle}>
                Бренд: {item.brand || "Не указан"}
              </p>
              <p style={itemDetailsStyle}>
                Размер: {item.size}
              </p>
              <p style={{ ...itemDetailsStyle, fontWeight: "600", fontSize: "16px" }}>
                Цена: {item.price} €
              </p>
              <div style={quantityControlStyle}>
                <span>Количество:</span>
                <button
                  style={quantityButtonStyle}
                  onClick={() => handleQuantityChange(item.cart_item_id, item.quantity - 1, item.available_quantity || 0)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span style={{ fontSize: "16px", fontWeight: "600", minWidth: "30px", textAlign: "center" }}>
                  {item.quantity}
                </span>
                <button
                  style={{
                    ...quantityButtonStyle,
                    opacity: (item.quantity >= (item.available_quantity || 0)) ? 0.5 : 1,
                    cursor: (item.quantity >= (item.available_quantity || 0)) ? "not-allowed" : "pointer",
                  }}
                  onClick={() => handleQuantityChange(item.cart_item_id, item.quantity + 1, item.available_quantity || 0)}
                  disabled={item.quantity >= (item.available_quantity || 0)}
                >
                  +
                </button>
                {item.available_quantity !== undefined && (
                  <span style={{ fontSize: "12px", color: "#666", marginLeft: "8px" }}>
                    (Доступно: {item.available_quantity})
                  </span>
                )}
              </div>
              <button
                style={removeButtonStyle}
                onClick={() => handleRemoveItem(item.cart_item_id)}
              >
                Удалить
              </button>
            </div>
            <div style={{ fontSize: "18px", fontWeight: "600" }}>
              {(item.price * item.quantity).toFixed(2)} €
            </div>
          </div>
        ))}
      </div>

      <div style={summaryStyle}>
        <h2 style={summaryTitleStyle}>Итого</h2>
        <div style={totalStyle}>
          {cart.total.toFixed(2)} €
        </div>
        <button style={checkoutButtonStyle} onClick={() => alert("Оформление заказа будет реализовано позже")}>
          Оформить заказ
        </button>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          if (localStorage.getItem("user")) {
            loadCart();
          }
        }}
      />
    </div>
  );
}

export default Cart;

