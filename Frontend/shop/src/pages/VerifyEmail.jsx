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
      setMessage("Verification token not found in the link");
      return;
    }

    const confirmEmail = async () => {
      try {
        const result = await verifyEmail(token);
        setStatus("success");
        setMessage(result.message);
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "Error verifying email");
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
    boxShadow: "0 8px 30px rgba(255, 107, 53, 0.3)",
    border: "1px solid #ddd",
    textAlign: "center",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#FF6B35",
    textShadow: "0 0 10px rgba(255, 107, 53, 0.5)",
    textTransform: "uppercase",
    letterSpacing: "2px",
    borderBottom: "2px solid #FF6B35",
    paddingBottom: "15px",
  };

  const messageStyle = {
    fontSize: "16px",
    marginBottom: "30px",
    color: status === "success" ? "#4CAF50" : status === "error" ? "#FF6B35" : "#666",
    lineHeight: "1.6",
    fontFamily: "'Google Sans Flex', sans-serif",
    fontWeight: "500",
  };

  const buttonStyle = {
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "700",
    backgroundColor: "#FF6B35",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontFamily: "'Google Sans Flex', sans-serif",
    boxShadow: "0 4px 15px rgba(255, 107, 53, 0.3)",
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Email Verification</h2>
      
      {status === "loading" && (
        <p style={messageStyle}>Verifying token...</p>
      )}
      
      {status === "success" && (
        <>
          <p style={messageStyle}>✓ {message}</p>
          <button 
            style={buttonStyle}
            onClick={() => navigate("/")}
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
            Go to Home
          </button>
        </>
      )}
      
      {status === "error" && (
        <>
          <p style={messageStyle}>✗ {message}</p>
          <button 
            style={buttonStyle}
            onClick={() => navigate("/")}
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
            Back to Home
          </button>
        </>
      )}
    </div>
  );
}

export default VerifyEmail;

