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
      setMessage("Please enter a 6-digit code");
      return;
    }

    if (!email) {
      setMessage("Email not found. Please register again.");
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
      setMessage(error.message || "Error verifying code");
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
    boxShadow: "0 8px 30px rgba(255, 107, 53, 0.3)",
    border: "1px solid #ddd",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "10px",
    color: "#FF6B35",
    textShadow: "0 0 10px rgba(255, 107, 53, 0.5)",
    textTransform: "uppercase",
    letterSpacing: "2px",
    borderBottom: "2px solid #FF6B35",
    paddingBottom: "15px",
  };

  const subtitleStyle = {
    fontSize: "14px",
    textAlign: "center",
    color: "#666",
    marginBottom: "20px",
    fontFamily: "'Google Sans Flex', sans-serif",
    lineHeight: "1.6",
  };

  const codeContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "30px",
  };

  const inputStyle = {
    width: "55px",
    height: "65px",
    fontSize: "28px",
    fontWeight: "700",
    textAlign: "center",
    border: "2px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "'Google Sans Flex', sans-serif",
    color: "#333",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "700",
    backgroundColor: "#FF6B35",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.6 : 1,
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontFamily: "'Google Sans Flex', sans-serif",
    boxShadow: "0 4px 15px rgba(255, 107, 53, 0.3)",
  };

  const messageStyle = {
    marginTop: "15px",
    fontSize: "14px",
    textAlign: "center",
    color: message.includes("successfully") || message.includes("success") || message.includes("verified") ? "#4CAF50" : "#FF6B35",
    lineHeight: "1.6",
    fontFamily: "'Google Sans Flex', sans-serif",
    fontWeight: "500",
  };

  const emailStyle = {
    fontSize: "14px",
    textAlign: "center",
    color: "#FF6B35",
    marginBottom: "20px",
    fontWeight: "600",
    fontFamily: "'Google Sans Flex', sans-serif",
    padding: "10px",
    background: "rgba(255, 107, 53, 0.1)",
    borderRadius: "8px",
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Email Verification</h2>
      <p style={subtitleStyle}>
        We've sent a verification code to your email address. Please enter the 6-digit code below.
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
              onFocus={(e) => {
                e.target.style.borderColor = "#FF6B35";
                e.target.style.boxShadow = "0 0 15px rgba(255, 107, 53, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#ddd";
                e.target.style.boxShadow = "none";
              }}
            />
          ))}
        </div>

        <button
          type="submit"
          style={buttonStyle}
          disabled={isLoading}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.background = "#FF8C42";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(255, 107, 53, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.target.style.background = "#FF6B35";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(255, 107, 53, 0.3)";
            }
          }}
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      {message && <p style={messageStyle}>{message}</p>}

      <p
        style={{
          marginTop: "20px",
          fontSize: "14px",
          textAlign: "center",
          color: "#666",
          cursor: "pointer",
          fontFamily: "'Google Sans Flex', sans-serif",
          transition: "color 0.3s ease",
        }}
        onClick={() => navigate("/")}
        onMouseEnter={(e) => {
          e.target.style.color = "#FF6B35";
        }}
        onMouseLeave={(e) => {
          e.target.style.color = "#666";
        }}
      >
        Back to Home
      </p>
    </div>
  );
}

export default VerifyCode;

