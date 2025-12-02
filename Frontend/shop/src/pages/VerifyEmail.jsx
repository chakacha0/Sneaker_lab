import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/users";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setStatus("error");
      setMessage("Токен подтверждения не найден в ссылке");
      return;
    }

    const confirmEmail = async () => {
      try {
        const result = await verifyEmail(token);
        setStatus("success");
        setMessage(result.message);
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "Ошибка при подтверждении email");
      }
    };

    confirmEmail();
  }, [searchParams]);

  const containerStyle = {
    maxWidth: "500px",
    margin: "100px auto",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    textAlign: "center",
    fontFamily: "'Archivo Black', sans-serif",
  };

  const titleStyle = {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  };

  const messageStyle = {
    fontSize: "16px",
    marginBottom: "30px",
    color: status === "success" ? "#28a745" : status === "error" ? "#d00" : "#666",
    lineHeight: "1.6",
  };

  const buttonStyle = {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Подтверждение Email</h2>
      
      {status === "loading" && (
        <p style={messageStyle}>Проверка токена...</p>
      )}
      
      {status === "success" && (
        <>
          <p style={messageStyle}>✓ {message}</p>
          <button 
            style={buttonStyle}
            onClick={() => navigate("/")}
          >
            Перейти на главную
          </button>
        </>
      )}
      
      {status === "error" && (
        <>
          <p style={messageStyle}>✗ {message}</p>
          <button 
            style={buttonStyle}
            onClick={() => navigate("/register")}
          >
            Вернуться к регистрации
          </button>
        </>
      )}
    </div>
  );
}

export default VerifyEmail;

