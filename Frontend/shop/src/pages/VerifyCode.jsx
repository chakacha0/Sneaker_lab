import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail } from "../api/users";

function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState(location.state?.email || "");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeChange = (index, value) => {
    // Разрешаем только цифры
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Автоматический переход на следующий input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Удаление и переход на предыдущий input
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);
      document.getElementById("code-5")?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      setMessage("Введите 6-значный код");
      return;
    }

    if (!email) {
      setMessage("Email не найден. Пожалуйста, зарегистрируйтесь снова.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await verifyEmail({ email, code: fullCode });
      setMessage(result.message);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setMessage(error.message || "Ошибка при подтверждении кода");
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: "500px",
    margin: "100px auto",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    fontFamily: "'Archivo Black', sans-serif",
  };

  const titleStyle = {
    fontSize: "24px",
    textAlign: "center",
    marginBottom: "10px",
    color: "#333",
  };

  const subtitleStyle = {
    fontSize: "14px",
    textAlign: "center",
    color: "#666",
    marginBottom: "30px",
  };

  const codeContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "30px",
  };

  const inputStyle = {
    width: "50px",
    height: "60px",
    fontSize: "24px",
    textAlign: "center",
    border: "2px solid #ccc",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.3s",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.6 : 1,
    transition: "background-color 0.3s",
  };

  const messageStyle = {
    marginTop: "15px",
    fontSize: "14px",
    textAlign: "center",
    color: message.includes("успешно") ? "#28a745" : "#d00",
    lineHeight: "1.6",
  };

  const emailStyle = {
    fontSize: "14px",
    textAlign: "center",
    color: "#666",
    marginBottom: "20px",
    fontWeight: "600",
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Подтверждение Email</h2>
      <p style={subtitleStyle}>
        Мы отправили код подтверждения на ваш email
      </p>

      {email && (
        <p style={emailStyle}>{email}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={codeContainerStyle}>
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              style={inputStyle}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button type="submit" style={buttonStyle} disabled={isLoading}>
          {isLoading ? "Проверка..." : "Подтвердить"}
        </button>
      </form>

      {message && <p style={messageStyle}>{message}</p>}

      <p
        style={{
          marginTop: "20px",
          fontSize: "12px",
          textAlign: "center",
          color: "#999",
          cursor: "pointer",
        }}
        onClick={() => navigate("/register")}
      >
        Вернуться к регистрации
      </p>
    </div>
  );
}

export default VerifyCode;

