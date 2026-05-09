import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/users";

function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
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
  const [fieldErrors, setFieldErrors] = useState({});

  if (!isOpen) return null;

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
  };

  const validateLoginForm = () => {
    const errors = {};
    
    if (!loginForm.email || loginForm.email.trim() === "") {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!loginForm.password || loginForm.password.trim() === "") {
      errors.password = "Password is required";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setFieldErrors({});

    if (!validateLoginForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginUser({
        email: loginForm.email,
        password: loginForm.password,
      });
      setMessage(result.message);
      // Save user
      localStorage.setItem("user", JSON.stringify(result.user));
      setTimeout(() => {
        onClose();
        window.location.reload(); // Reload page to show authenticated state
      }, 1000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validateRegisterForm = () => {
    const errors = {};
    
    if (!registerForm.email || registerForm.email.trim() === "") {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!registerForm.password || registerForm.password.trim() === "") {
      errors.password = "Password is required";
    } else if (registerForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setFieldErrors({});

    if (!validateRegisterForm()) {
      return;
    }

    setIsLoading(true);

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

  // Styles in website theme
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
    fontFamily: "'Google Sans Flex', sans-serif",
    boxSizing: "border-box",
    border: "1px solid #ddd",
    boxShadow: "0 8px 30px rgba(255, 107, 53, 0.3)",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 32px",
    borderBottom: "2px solid #FF6B35",
    background: "linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(255, 107, 53, 0.02) 100%)",
  };

  const logoStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#FF6B35",
    textTransform: "uppercase",
    letterSpacing: "2px",
    textShadow: "0 0 10px rgba(255, 107, 53, 0.5)",
    fontFamily: "'Unbounded', sans-serif",
  };

  const closeButtonStyle = {
    background: "transparent",
    border: "2px solid #FF6B35",
    borderRadius: "50%",
    fontSize: "24px",
    cursor: "pointer",
    color: "#FF6B35",
    padding: "0",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const tabsStyle = {
    display: "flex",
    borderBottom: "1px solid #ddd",
    background: "#fafafa",
  };

  const tabStyle = {
    flex: 1,
    padding: "16px 20px",
    textAlign: "center",
    cursor: "pointer",
    border: "none",
    background: "transparent",
    fontSize: "16px",
    fontWeight: "600",
    color: "#666",
    borderBottom: "2px solid transparent",
    transition: "all 0.3s ease",
    fontFamily: "'Google Sans Flex', sans-serif",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const activeTabStyle = {
    ...tabStyle,
    color: "#FF6B35",
    borderBottom: "2px solid #FF6B35",
    background: "#fff",
  };

  const contentStyle = {
    padding: "32px",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    border: "2px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    marginBottom: "16px",
    boxSizing: "border-box",
    fontFamily: "'Google Sans Flex', sans-serif",
    transition: "all 0.3s ease",
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
    marginTop: "8px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontFamily: "'Google Sans Flex', sans-serif",
    boxShadow: "0 4px 15px rgba(255, 107, 53, 0.3)",
  };

  const messageStyle = {
    marginTop: "12px",
    fontSize: "14px",
    color: message.includes("successfully") || message.includes("sent") || message.includes("success") ? "#4CAF50" : "#FF6B35",
    textAlign: "center",
    fontFamily: "'Google Sans Flex', sans-serif",
    fontWeight: "500",
  };

  const errorMessageStyle = {
    fontSize: "12px",
    color: "#FF6B35",
    marginTop: "-12px",
    marginBottom: "8px",
    fontFamily: "'Google Sans Flex', sans-serif",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const errorIconStyle = {
    fontSize: "14px",
    color: "#FF6B35",
  };

  const legalTextStyle = {
    fontSize: "12px",
    color: "#666",
    marginTop: "8px",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={logoStyle}>SNEAKER LAB</div>
          <button 
            style={closeButtonStyle} 
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.background = "#FF6B35";
              e.target.style.color = "#fff";
              e.target.style.transform = "rotate(90deg)";
              e.target.style.boxShadow = "0 0 15px rgba(255, 107, 53, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#FF6B35";
              e.target.style.transform = "rotate(0deg)";
              e.target.style.boxShadow = "none";
            }}
          >
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
              setFieldErrors({});
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "login") {
                e.target.style.color = "#FF6B35";
                e.target.style.background = "rgba(255, 107, 53, 0.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "login") {
                e.target.style.color = "#666";
                e.target.style.background = "transparent";
              }
            }}
          >
            Sign In
          </button>
          <button
            style={activeTab === "register" ? activeTabStyle : tabStyle}
            onClick={() => {
              setActiveTab("register");
              setMessage("");
              setFieldErrors({});
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "register") {
                e.target.style.color = "#FF6B35";
                e.target.style.background = "rgba(255, 107, 53, 0.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "register") {
                e.target.style.color = "#666";
                e.target.style.background = "transparent";
              }
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {activeTab === "login" ? (
            <form onSubmit={handleLogin} noValidate>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  style={{
                    ...inputStyle,
                    borderColor: fieldErrors.email ? "#FF6B35" : "#ddd",
                    marginBottom: fieldErrors.email ? "4px" : "16px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#FF6B35";
                    e.target.style.boxShadow = "0 0 10px rgba(255, 107, 53, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = fieldErrors.email ? "#FF6B35" : "#ddd";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {fieldErrors.email && (
                  <div style={errorMessageStyle}>
                    <span style={errorIconStyle}>⚠</span>
                    <span>{fieldErrors.email}</span>
                  </div>
                )}
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  style={{
                    ...inputStyle,
                    borderColor: fieldErrors.password ? "#FF6B35" : "#ddd",
                    marginBottom: fieldErrors.password ? "4px" : "16px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#FF6B35";
                    e.target.style.boxShadow = "0 0 10px rgba(255, 107, 53, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = fieldErrors.password ? "#FF6B35" : "#ddd";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {fieldErrors.password && (
                  <div style={errorMessageStyle}>
                    <span style={errorIconStyle}>⚠</span>
                    <span>{fieldErrors.password}</span>
                  </div>
                )}
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
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} noValidate>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  style={{
                    ...inputStyle,
                    borderColor: fieldErrors.email ? "#FF6B35" : "#ddd",
                    marginBottom: fieldErrors.email ? "4px" : "16px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#FF6B35";
                    e.target.style.boxShadow = "0 0 10px rgba(255, 107, 53, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = fieldErrors.email ? "#FF6B35" : "#ddd";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {fieldErrors.email && (
                  <div style={errorMessageStyle}>
                    <span style={errorIconStyle}>⚠</span>
                    <span>{fieldErrors.email}</span>
                  </div>
                )}
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  style={{
                    ...inputStyle,
                    borderColor: fieldErrors.password ? "#FF6B35" : "#ddd",
                    marginBottom: fieldErrors.password ? "4px" : "16px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#FF6B35";
                    e.target.style.boxShadow = "0 0 10px rgba(255, 107, 53, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = fieldErrors.password ? "#FF6B35" : "#ddd";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {fieldErrors.password && (
                  <div style={errorMessageStyle}>
                    <span style={errorIconStyle}>⚠</span>
                    <span>{fieldErrors.password}</span>
                  </div>
                )}
              </div>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={registerForm.first_name}
                onChange={handleRegisterChange}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FF6B35";
                  e.target.style.boxShadow = "0 0 10px rgba(255, 107, 53, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#ddd";
                  e.target.style.boxShadow = "none";
                }}
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={registerForm.last_name}
                onChange={handleRegisterChange}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FF6B35";
                  e.target.style.boxShadow = "0 0 10px rgba(255, 107, 53, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#ddd";
                  e.target.style.boxShadow = "none";
                }}
              />
              <input
                type="tel"
                name="phone_number"
                placeholder="Phone Number (Optional)"
                value={registerForm.phone_number}
                onChange={handleRegisterChange}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FF6B35";
                  e.target.style.boxShadow = "0 0 10px rgba(255, 107, 53, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#ddd";
                  e.target.style.boxShadow = "none";
                }}
              />
              <p style={legalTextStyle}>
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
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
                {isLoading ? "Registering..." : "Sign Up"}
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

