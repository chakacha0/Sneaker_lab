import React, { useState, useEffect, useCallback, useRef } from "react";
import { createAddress } from "../api/addresses";
import { createOrder, calculateOrderTotal } from "../api/orders";

function CheckoutModal({ isOpen, onClose, cart, onOrderSuccess }) {
  const [addressForm, setAddressForm] = useState({
    country: "",
    city: "",
    street: "",
    house: "",
    apartment: "",
    postal_code: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // "error" or "success"
  const [promoInfo, setPromoInfo] = useState(null); // { final_total, promo_valid, promo_message, discount }
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false); // Флаг успешного оформления заказа
  const [orderData, setOrderData] = useState(null); // Данные о созданном заказе
  const promoCodeRef = useRef(""); // Для проверки актуальности промокода при асинхронных операциях
  const lastCheckedCodeRef = useRef(""); // Для предотвращения повторных запросов

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!isOpen) {
      // Сбрасываем форму при закрытии
      setAddressForm({
        country: "",
        city: "",
        street: "",
        house: "",
        apartment: "",
        postal_code: "",
      });
      setPromoCode("");
      setMessage("");
      setPromoInfo(null);
      setOrderSuccess(false);
      setOrderData(null);
      promoCodeRef.current = "";
      lastCheckedCodeRef.current = "";
    }
  }, [isOpen]);

  // Функция для проверки промокода
  const checkPromoCode = useCallback(async (code) => {
    if (!code || !code.trim() || !user || !cart) {
      setPromoInfo(null);
      promoCodeRef.current = "";
      lastCheckedCodeRef.current = "";
      return;
    }

    const trimmedCode = code.trim().toUpperCase();
    
    // Если проверяем тот же код, пропускаем повторный запрос
    if (lastCheckedCodeRef.current === trimmedCode) {
      return;
    }
    
    // Обновляем ref перед началом проверки
    promoCodeRef.current = trimmedCode;
    lastCheckedCodeRef.current = trimmedCode;

    setIsCheckingPromo(true);
    
    try {
      const result = await calculateOrderTotal(user.user_id, trimmedCode);
      // Проверяем, что промокод не изменился во время запроса
      if (promoCodeRef.current === trimmedCode) {
        setPromoInfo({
          final_total: result.final_total,
          promo_valid: result.promo_valid,
          promo_message: result.promo_message,
          discount: result.discount,
          original_total: result.original_total,
        });
      }
    } catch (error) {
      // Проверяем, что промокод не изменился во время запроса
      if (promoCodeRef.current === trimmedCode) {
        setPromoInfo({
          final_total: cart.total,
          promo_valid: false,
          promo_message: error.message || "Error checking promo code",
          discount: 0,
          original_total: cart.total,
        });
      }
    } finally {
      if (promoCodeRef.current === trimmedCode) {
        setIsCheckingPromo(false);
      }
    }
  }, [user, cart]);

  // Проверяем промокод при изменении (с задержкой)
  useEffect(() => {
    const trimmedCode = promoCode.trim().toUpperCase();
    
    // Очищаем информацию о промокоде только если поле пустое
    if (!trimmedCode) {
      setPromoInfo(null);
      promoCodeRef.current = "";
      lastCheckedCodeRef.current = "";
      setIsCheckingPromo(false);
      return;
    }
    
    // Если промокод не изменился с последней проверки, не делаем новый запрос
    if (trimmedCode === lastCheckedCodeRef.current) {
      return;
    }
    
    // Сохраняем текущий код для проверки в timeout
    const codeToCheck = trimmedCode;
    
    const timeoutId = setTimeout(() => {
      // Проверяем, что промокод не изменился во время ожидания
      const currentCode = promoCode.trim().toUpperCase();
      if (currentCode === codeToCheck && currentCode) {
        checkPromoCode(promoCode);
      }
    }, 1000); // Задержка 1000ms для уменьшения количества запросов

    return () => {
      clearTimeout(timeoutId);
      // НЕ очищаем promoInfo здесь, чтобы избежать мигания
    };
  }, [promoCode, checkPromoCode]);

  if (!isOpen || !user || !cart) return null;

  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Создаем адрес
      const address = await createAddress({
        user_id: user.user_id,
        country: addressForm.country,
        city: addressForm.city,
        street: addressForm.street,
        house: addressForm.house,
        apartment: addressForm.apartment || null,
        postal_code: addressForm.postal_code || null,
      });

      // Создаем заказ
      const orderData = {
        user_id: user.user_id,
        address_id: address.address_id,
        promo_code: promoCode.trim() || null,
      };

      const result = await createOrder(orderData);
      
      // Сохраняем данные о заказе и показываем экран успеха
      setOrderData(result);
      setOrderSuccess(true);
      setMessage("Order successfully placed!");
      setMessageType("success");

      // Закрываем модальное окно и вызываем callback через 4 секунды (увеличено с 1.5)
      setTimeout(() => {
        onClose();
        if (onOrderSuccess) {
          onOrderSuccess();
        }
      }, 4000);
    } catch (error) {
      setMessage(error.message || "Error placing order");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Стили
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
    overflow: "auto",
    boxSizing: "border-box",
    padding: "20px",
  };

  const modalStyle = {
    backgroundColor: "#fff",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflow: "auto",
    position: "relative",
    fontFamily: "'Google Sans Flex', sans-serif",
    boxSizing: "border-box",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 32px",
    borderBottom: "1px solid #eee",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const closeButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "32px",
    cursor: "pointer",
    color: "#666",
    padding: "0",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: "1",
  };

  const contentStyle = {
    padding: "32px",
  };

  const formGroupStyle = {
    marginBottom: "20px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    fontSize: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const promoSectionStyle = {
    marginTop: "24px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
  };

  const totalSectionStyle = {
    marginTop: "24px",
    padding: "20px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    borderTop: "2px solid #ddd",
  };

  const totalRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "16px",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const totalFinalStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "2px solid #ccc",
    fontSize: "20px",
    fontWeight: "bold",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const buttonStyle = {
    width: "100%",
    padding: "16px",
    fontSize: "18px",
    fontWeight: "bold",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.6 : 1,
    marginTop: "20px",
    transition: "opacity 0.3s",
  };

  const messageStyle = {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    textAlign: "center",
    backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
    color: messageType === "success" ? "#155724" : "#721c24",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const requiredStyle = {
    color: "#d00",
  };

  const handleClose = () => {
    if (orderSuccess) {
      // Если заказ успешно оформлен, закрываем с вызовом callback
      onClose();
      if (onOrderSuccess) {
        onOrderSuccess();
      }
    } else {
      // Иначе просто закрываем
      onClose();
    }
  };

  return (
    <div style={overlayStyle} onClick={orderSuccess ? undefined : onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>{orderSuccess ? "Order Confirmation" : "Checkout"}</h2>
          {!orderSuccess && (
            <button style={closeButtonStyle} onClick={onClose} disabled={isLoading}>
              ×
            </button>
          )}
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {/* Экран успешного оформления заказа */}
          {orderSuccess && orderData ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>✓</div>
              <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#28a745", marginBottom: "16px", fontFamily: "'Google Sans Flex', sans-serif" }}>
                Order Successfully Placed!
              </h2>
              <div style={{ backgroundColor: "#f0f0f0", borderRadius: "8px", padding: "20px", marginBottom: "24px" }}>
                <div style={{ fontSize: "16px", color: "#666", marginBottom: "8px", fontFamily: "'Google Sans Flex', sans-serif" }}>
                  Order Number:
                </div>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#000", marginBottom: "16px", fontFamily: "'Google Sans Flex', sans-serif" }}>
                  #{orderData.order?.order_id || orderData.order_id || "N/A"}
                </div>
                <div style={{ fontSize: "16px", color: "#666", marginBottom: "8px", fontFamily: "'Google Sans Flex', sans-serif" }}>
                  Total Amount:
                </div>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#FF6B35", fontFamily: "'Google Sans Flex', sans-serif" }}>
                  {(() => {
                    // Пытаемся получить цену из разных возможных структур ответа
                    const totalPrice = orderData.order?.total_price || orderData.total_price;
                    if (totalPrice) {
                      return parseFloat(totalPrice).toFixed(2);
                    }
                    // Если нет в ответе, используем промокод или корзину
                    if (promoInfo && promoInfo.promo_valid) {
                      return promoInfo.final_total.toFixed(2);
                    }
                    return cart.total.toFixed(2);
                  })()} $
                </div>
              </div>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px", fontFamily: "'Google Sans Flex', sans-serif" }}>
                Thank you for your order! You will receive a confirmation email shortly.
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (onOrderSuccess) {
                    onOrderSuccess();
                  }
                }}
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  backgroundColor: "#FF6B35",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginTop: "20px",
                  transition: "all 0.3s",
                  fontFamily: "'Google Sans Flex', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FF8C42";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#FF6B35";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
            {/* Address Form */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Country <span style={requiredStyle}>*</span>
              </label>
              <input
                type="text"
                name="country"
                value={addressForm.country}
                onChange={handleAddressChange}
                required
                style={inputStyle}
                placeholder="e.g., Belarus"
                disabled={isLoading}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                City <span style={requiredStyle}>*</span>
              </label>
              <input
                type="text"
                name="city"
                value={addressForm.city}
                onChange={handleAddressChange}
                required
                style={inputStyle}
                placeholder="e.g., Minsk"
                disabled={isLoading}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Street <span style={requiredStyle}>*</span>
              </label>
              <input
                type="text"
                name="street"
                value={addressForm.street}
                onChange={handleAddressChange}
                required
                style={inputStyle}
                placeholder="e.g., Lenin Street"
                disabled={isLoading}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                House <span style={requiredStyle}>*</span>
              </label>
              <input
                type="text"
                name="house"
                value={addressForm.house}
                onChange={handleAddressChange}
                required
                style={inputStyle}
                placeholder="e.g., 10"
                disabled={isLoading}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Apartment</label>
              <input
                type="text"
                name="apartment"
                value={addressForm.apartment}
                onChange={handleAddressChange}
                style={inputStyle}
                placeholder="e.g., 25"
                disabled={isLoading}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Postal Code</label>
              <input
                type="text"
                name="postal_code"
                value={addressForm.postal_code}
                onChange={handleAddressChange}
                style={inputStyle}
                placeholder="e.g., 220000"
                disabled={isLoading}
              />
            </div>

            {/* Promo Code Section */}
            <div style={promoSectionStyle}>
              <label style={labelStyle}>Promo Code</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                style={inputStyle}
                placeholder="Enter promo code"
                disabled={isLoading}
              />
              {isCheckingPromo && promoCode.trim() && promoCodeRef.current === promoCode.trim().toUpperCase() && (
                <p style={{ fontSize: "12px", color: "#666", marginTop: "8px", fontStyle: "italic", fontFamily: "'Google Sans Flex', sans-serif" }}>
                  Checking promo code...
                </p>
              )}
              {!isCheckingPromo && 
               promoInfo && 
               promoCode.trim() && 
               promoCodeRef.current === promoCode.trim().toUpperCase() && 
               lastCheckedCodeRef.current === promoCode.trim().toUpperCase() &&
               promoInfo.promo_message && (
                <p
                  key={promoCode.trim().toUpperCase()} // Добавляем key для предотвращения мигания
                  style={{
                    fontSize: "13px",
                    marginTop: "8px",
                    color: promoInfo.promo_valid ? "#28a745" : "#d00",
                    fontWeight: "600",
                    fontFamily: "'Google Sans Flex', sans-serif",
                  }}
                >
                  {promoInfo.promo_message}
                </p>
              )}
            </div>

            {/* Total Section */}
            <div style={totalSectionStyle}>
              <div style={totalRowStyle}>
                <span>Order total:</span>
                <span>{cart.total.toFixed(2)} $</span>
              </div>
              {promoInfo && promoInfo.promo_valid && promoInfo.discount > 0 && (
                <div style={{ ...totalRowStyle, fontSize: "14px", color: "#28a745" }}>
                  <span>Discount:</span>
                  <span>-{promoInfo.discount.toFixed(2)} $</span>
                </div>
              )}
              <div style={totalFinalStyle}>
                <span>Total to pay:</span>
                <span>
                  {promoInfo && promoInfo.promo_valid
                    ? promoInfo.final_total.toFixed(2)
                    : cart.total.toFixed(2)}{" "}
                  $
                </span>
              </div>
              {promoInfo && 
               !promoInfo.promo_valid && 
               !isCheckingPromo &&
               promoCode.trim() && 
               promoCodeRef.current === promoCode.trim().toUpperCase() && 
               lastCheckedCodeRef.current === promoCode.trim().toUpperCase() && (
                <p style={{ fontSize: "12px", color: "#d00", marginTop: "8px", fontStyle: "italic", fontFamily: "'Google Sans Flex', sans-serif" }}>
                  Promo code not applied. Order will be placed without discount.
                </p>
              )}
            </div>

            <button type="submit" style={buttonStyle} disabled={isLoading}>
              {isLoading ? "Processing..." : "Place Order"}
            </button>

            {message && <div style={messageStyle}>{message}</div>}
          </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;
