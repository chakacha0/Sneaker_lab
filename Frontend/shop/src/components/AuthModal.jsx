import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/users";

function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login"); // "login" или "register"
  const [loginMethod, setLoginMethod] = useState("email"); // "email" или "phone"
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await loginUser({
        email: loginForm.email,
        password: loginForm.password,
      });
      setMessage(result.message);
      // Сохраняем пользователя
      localStorage.setItem("user", JSON.stringify(result.user));
      setTimeout(() => {
        onClose();
        window.location.reload(); // Обновляем страницу для отображения авторизованного состояния
      }, 1000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await registerUser(registerForm);
      setMessage(result.message);
      if (result.email_sent) {
        setTimeout(() => {
          onClose();
          navigate("/verify-code", { state: { email: registerForm.email } });
        }, 1500);
      }
    } catch (error) {
      setMessage(error.message);
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
    overflow: "hidden",
    boxSizing: "border-box",
  };

  const modalStyle = {
    backgroundColor: "#fff",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflow: "auto",
    position: "relative",
    fontFamily: "'Archivo Black', sans-serif",
    boxSizing: "border-box",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 32px",
    borderBottom: "1px solid #eee",
  };

  const logoStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000",
    textTransform: "uppercase",
  };

  const closeButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#666",
    padding: "0",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const tabsStyle = {
    display: "flex",
    borderBottom: "1px solid #eee",
  };

  const tabStyle = {
    flex: 1,
    padding: "16px",
    textAlign: "center",
    cursor: "pointer",
    border: "none",
    background: "none",
    fontSize: "16px",
    color: "#999",
    borderBottom: "2px solid transparent",
    transition: "all 0.3s",
  };

  const activeTabStyle = {
    ...tabStyle,
    color: "#000",
    borderBottom: "2px solid #0066FF",
  };

  const contentStyle = {
    padding: "32px",
  };

  const methodSelectorStyle = {
    display: "flex",
    gap: "20px",
    marginBottom: "24px",
  };

  const methodButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "14px",
    color: "#999",
    cursor: "pointer",
    padding: "0",
  };

  const activeMethodStyle = {
    ...methodButtonStyle,
    color: "#333",
    fontWeight: "600",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    fontSize: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    marginBottom: "16px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#0066FF",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.6 : 1,
    transition: "background-color 0.3s",
    marginTop: "8px",
  };

  const linkStyle = {
    color: "#FF0000",
    textDecoration: "none",
    fontSize: "14px",
    display: "block",
    textAlign: "center",
    marginTop: "16px",
    cursor: "pointer",
  };

  const messageStyle = {
    marginTop: "12px",
    fontSize: "14px",
    color: message.includes("успешно") || message.includes("отправлен") ? "#28a745" : "#d00",
    textAlign: "center",
  };

  const legalTextStyle = {
    fontSize: "12px",
    color: "#999",
    marginTop: "8px",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={logoStyle}>SNEAKER LAB</div>
          <button style={closeButtonStyle} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={tabsStyle}>
          <button
            style={activeTab === "login" ? activeTabStyle : tabStyle}
            onClick={() => {
              setActiveTab("login");
              setMessage("");
            }}
          >
            Вход
          </button>
          <button
            style={activeTab === "register" ? activeTabStyle : tabStyle}
            onClick={() => {
              setActiveTab("register");
              setMessage("");
            }}
          >
            Регистрация
          </button>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {activeTab === "login" ? (
            <form onSubmit={handleLogin}>
              {/* Method Selector */}
              <div style={methodSelectorStyle}>
                <button
                  type="button"
                  style={loginMethod === "phone" ? activeMethodStyle : methodButtonStyle}
                  onClick={() => setLoginMethod("phone")}
                >
                  По номеру телефона
                </button>
                <button
                  type="button"
                  style={loginMethod === "email" ? activeMethodStyle : methodButtonStyle}
                  onClick={() => setLoginMethod("email")}
                >
                  Через Email
                </button>
              </div>

              {/* Input Fields */}
              {loginMethod === "email" ? (
                <>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    required
                    style={inputStyle}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    required
                    style={inputStyle}
                  />
                </>
              ) : (
                <input
                  type="tel"
                  name="phone"
                  placeholder="+375 (00) 000 00 00"
                  style={inputStyle}
                />
              )}

              <button type="submit" style={buttonStyle} disabled={isLoading}>
                {isLoading ? "Вход..." : loginMethod === "phone" ? "Получить код" : "Войти"}
              </button>

              {loginMethod === "phone" && (
                <a href="#" style={linkStyle} onClick={(e) => {
                  e.preventDefault();
                  setLoginMethod("email");
                }}>
                  Войти с помощью пароля
                </a>
              )}
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                required
                style={inputStyle}
              />
              <input
                type="password"
                name="password"
                placeholder="Пароль"
                value={registerForm.password}
                onChange={handleRegisterChange}
                required
                style={inputStyle}
              />
              <input
                type="text"
                name="first_name"
                placeholder="Имя"
                value={registerForm.first_name}
                onChange={handleRegisterChange}
                style={inputStyle}
              />
              <input
                type="text"
                name="last_name"
                placeholder="Фамилия"
                value={registerForm.last_name}
                onChange={handleRegisterChange}
                style={inputStyle}
              />
              <input
                type="tel"
                name="phone_number"
                placeholder="Номер телефона"
                value={registerForm.phone_number}
                onChange={handleRegisterChange}
                style={inputStyle}
              />
              <p style={legalTextStyle}>
                <span style={{ color: "#FF0000" }}>*</span> Условия публичной оферты
              </p>
              <button type="submit" style={buttonStyle} disabled={isLoading}>
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </button>
            </form>
          )}

          {message && <p style={messageStyle}>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;

