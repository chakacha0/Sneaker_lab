import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";

function Header() {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Обновляем пользователя при изменении localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem("user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    // Проверяем при монтировании
    handleStorageChange();
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };
const headerStyle = {
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  alignItems: "center",
  padding: "20px 40px",
  paddingBottom: "20px",
  background: "#fff",
  color: "#333",
  boxShadow: "0 4px 20px rgba(255, 107, 53, 0.2)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  width: "100%",
  boxSizing: "border-box",
  borderBottom: "2px solid #FF6B35",
  gap: "30px",
  marginBottom: "20px",
};

const logoStyle = {
  fontFamily: "'Unbounded', sans-serif",
  fontSize: "32px",
  fontWeight: "700",
  textTransform: "uppercase",
  textDecoration: "none",
  color: "#FF6B35",
  textShadow: "0 0 10px rgba(255, 107, 53, 0.5)",
  letterSpacing: "2px",
  transition: "all 0.3s ease",
};

const navStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "40px",
  fontWeight: "600",
  textTransform: "uppercase",
  fontSize: "14px",
  letterSpacing: "1px",
};

const searchContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const searchInputStyle = {
  width: "100%",
  maxWidth: "500px",
  padding: "10px 50px 10px 15px",
  fontSize: "14px",
  border: "1px solid #ddd",
  borderRadius: "25px",
  outline: "none",
  background: "#f5f5f5",
  color: "#333",
  transition: "all 0.3s ease",
  fontFamily: "'Google Sans Flex', sans-serif",
};

const searchButtonStyle = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  width: "24px",
  height: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  color: "#FF6B35",
  zIndex: 10,
  padding: 0,
};

const linkStyle = {
  fontFamily: "'Google Sans Flex', sans-serif",
  color: "#333",
  textDecoration: "none",
  transition: "all 0.3s ease",
  position: "relative",
  padding: "5px 0",
};


  return (
    <header style={headerStyle}>
      {/* Логотип */}
      <Link to="/" style={logoStyle}>
        SNEAKER LAB
      </Link>

      {/* Строка поиска */}
      <div style={searchContainerStyle}>
        <form 
          onSubmit={handleSearch} 
          style={{ 
            position: "relative", 
            width: "100%", 
            maxWidth: "500px",
            margin: "0 auto"
          }}
        >
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "#FF6B35";
              e.target.style.boxShadow = "0 0 10px rgba(255, 107, 53, 0.3)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#ddd";
              e.target.style.boxShadow = "none";
            }}
          />
          <button
            type="submit"
            style={searchButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#FF8C42";
              e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#FF6B35";
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </form>
      </div>

      {/* Навигация и иконки */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "20px",
        }}
      >
        {/* Навигация */}
        <nav style={{ ...navStyle, gap: "20px" }}>
          <Link
            to="/"
            style={linkStyle}
            onMouseEnter={(e) => {
              e.target.style.color = "#FF6B35";
              e.target.style.textShadow = "0 0 8px rgba(255, 107, 53, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = linkStyle.color;
              e.target.style.textShadow = "none";
            }}
          >
            Home
          </Link>
          <Link
            to="/catalog"
            style={linkStyle}
            onMouseEnter={(e) => {
              e.target.style.color = "#FF6B35";
              e.target.style.textShadow = "0 0 8px rgba(255, 107, 53, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = linkStyle.color;
              e.target.style.textShadow = "none";
            }}
          >
            Catalog
          </Link>
        </nav>

        {/* Иконка избранного */}
        <div
          onClick={() => {
            if (!user) {
              setIsAuthModalOpen(true);
            } else {
              navigate("/favourites");
            }
          }}
          style={{
            cursor: "pointer",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#333",
            fontSize: "24px",
            transition: "all 0.3s ease",
            borderRadius: "50%",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#FF6B35";
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#333";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>

        {/* Иконка корзины */}
        <div
          onClick={() => {
            if (!user) {
              setIsAuthModalOpen(true);
            } else {
              navigate("/cart");
            }
          }}
          style={{
            cursor: "pointer",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#333",
            fontSize: "24px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#FF6B35";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#333";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>

        {/* Иконка пользователя */}
        {user ? (
          <div
            onClick={() => {
              // Если пользователь - администратор, перенаправляем на админку
              if (user.role === 'admin') {
                navigate("/admin");
              } else {
                navigate("/profile");
              }
            }}
            style={{
              cursor: "pointer",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#333",
              fontSize: "24px",
              transition: "all 0.3s ease",
              borderRadius: "50%",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#FF6B35";
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#333";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        ) : (
          <div
            onClick={() => setIsAuthModalOpen(true)}
            style={{
              cursor: "pointer",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#333",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              borderRadius: "8px",
              fontFamily: "'Google Sans Flex', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#FF6B35";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#333";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Sign in / Sign up
          </div>
        )}
      </div>

      {/* Модальное окно */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}

export default Header;




