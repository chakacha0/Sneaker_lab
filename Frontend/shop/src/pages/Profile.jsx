import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getUserFavourites } from "../api/favourites";
import { getCart } from "../api/cart";
import AuthModal from "../components/AuthModal";

function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      setIsAuthModalOpen(true);
      setLoading(false);
      return;
    }

    const userData = JSON.parse(savedUser);
    
    // Если пользователь - администратор, перенаправляем на админку
    if (userData.role === 'admin') {
      navigate("/admin");
      return;
    }
    
    setUser(userData);
    setLoading(false);

    // Загружаем данные в зависимости от активной вкладки
    if (userData && userData.user_id) {
      loadTabData(userData.user_id, "info");
    }
  }, [navigate]);

  const loadTabData = async (userId, tab) => {
    try {
      if (tab === "favourites") {
        const data = await getUserFavourites(userId);
        setFavourites(data || []);
      } else if (tab === "cart") {
        const data = await getCart(userId);
        setCartItems(data?.items || []);
      }
    } catch (error) {
      console.error(`Ошибка загрузки данных для ${tab}:`, error);
      if (tab === "favourites") {
        setFavourites([]);
      } else if (tab === "cart") {
        setCartItems([]);
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (user && user.user_id) {
      loadTabData(user.user_id, tab);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  const containerStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "40px 20px",
    background: "#fff",
    minHeight: "100vh",
    display: "flex",
    gap: "30px",
  };

  const menuStyle = {
    width: "250px",
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    height: "fit-content",
    border: "1px solid #ddd",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  };

  const menuTitleStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#FF6B35",
    textShadow: "0 0 10px rgba(255, 107, 53, 0.5)",
    marginBottom: "30px",
    textTransform: "uppercase",
    letterSpacing: "2px",
    borderBottom: "2px solid #FF6B35",
    paddingBottom: "10px",
    fontFamily: "'Fragment Mono', monospace",
  };

  const menuItemStyle = {
    padding: "15px 20px",
    marginBottom: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: "#333",
    fontSize: "16px",
    fontWeight: "600",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "transparent",
    fontFamily: "'Fragment Mono', monospace",
  };

  const activeMenuItemStyle = {
    ...menuItemStyle,
    background: "#FF6B35",
    color: "#fff",
    borderColor: "#FF6B35",
    boxShadow: "0 0 15px rgba(255, 107, 53, 0.3)",
  };

  const contentStyle = {
    flex: 1,
    background: "#fff",
    borderRadius: "12px",
    padding: "30px",
    border: "1px solid #ddd",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "700",
    color: "#FF6B35",
    textShadow: "0 0 10px rgba(255, 107, 53, 0.5)",
    marginBottom: "30px",
    textTransform: "uppercase",
    letterSpacing: "2px",
    borderBottom: "2px solid #FF6B35",
    paddingBottom: "10px",
    fontFamily: "'Fragment Mono', monospace",
  };

  const infoItemStyle = {
    marginBottom: "20px",
    padding: "15px",
    background: "#f5f5f5",
    borderRadius: "8px",
    border: "1px solid #ddd",
  };

  const labelStyle = {
    fontSize: "12px",
    color: "#FF6B35",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "8px",
    fontWeight: "600",
  };

  const valueStyle = {
    fontSize: "16px",
    color: "#333",
    fontWeight: "500",
    fontFamily: "'Fragment Mono', monospace",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "25px",
  };

  const emptyStyle = {
    textAlign: "center",
    padding: "60px 20px",
    color: "#666",
    fontSize: "18px",
    fontFamily: "'Fragment Mono', monospace",
  };

  const logoutButtonStyle = {
    width: "100%",
    padding: "15px 20px",
    marginTop: "20px",
    borderRadius: "8px",
    cursor: "pointer",
    background: "transparent",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "#FF6B35",
    color: "#FF6B35",
    fontSize: "16px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ color: "#FF6B35", fontSize: "18px", textAlign: "center", width: "100%" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={containerStyle}>
        <div style={emptyStyle}>
          <p>Please log in to view your profile</p>
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => {
            setIsAuthModalOpen(false);
            navigate("/");
          }}
        />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Боковое меню */}
      <div style={menuStyle}>
        <h2 style={menuTitleStyle}>Menu</h2>
        
        <div
          style={activeTab === "info" ? activeMenuItemStyle : menuItemStyle}
          onClick={() => handleTabChange("info")}
          onMouseEnter={(e) => {
            if (activeTab !== "info") {
              e.target.style.background = "rgba(255, 107, 53, 0.1)";
              e.target.style.borderColor = "#FF6B35";
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== "info") {
              e.target.style.background = "transparent";
              e.target.style.borderColor = "transparent";
            }
          }}
        >
          Personal Info
        </div>

        <div
          style={activeTab === "favourites" ? activeMenuItemStyle : menuItemStyle}
          onClick={() => handleTabChange("favourites")}
          onMouseEnter={(e) => {
            if (activeTab !== "favourites") {
              e.target.style.background = "rgba(255, 107, 53, 0.1)";
              e.target.style.borderColor = "#FF6B35";
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== "favourites") {
              e.target.style.background = "transparent";
              e.target.style.borderColor = "transparent";
            }
          }}
        >
          Favourites
        </div>

        <div
          style={activeTab === "cart" ? activeMenuItemStyle : menuItemStyle}
          onClick={() => handleTabChange("cart")}
          onMouseEnter={(e) => {
            if (activeTab !== "cart") {
              e.target.style.background = "rgba(255, 107, 53, 0.1)";
              e.target.style.borderColor = "#FF6B35";
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== "cart") {
              e.target.style.background = "transparent";
              e.target.style.borderColor = "transparent";
            }
          }}
        >
          Cart
        </div>

        <button
          onClick={handleLogout}
          style={logoutButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = "#FF6B35";
            e.target.style.color = "#000";
            e.target.style.boxShadow = "0 0 15px rgba(255, 107, 53, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "#FF6B35";
            e.target.style.boxShadow = "none";
          }}
        >
          Log Out
        </button>
      </div>

      {/* Контент */}
      <div style={contentStyle}>
        {activeTab === "info" && (
          <div>
            <h2 style={titleStyle}>Personal Information</h2>
            
            <div style={infoItemStyle}>
              <div style={labelStyle}>Email</div>
              <div style={valueStyle}>{user.email || "Not specified"}</div>
            </div>

            <div style={infoItemStyle}>
              <div style={labelStyle}>First Name</div>
              <div style={valueStyle}>{user.first_name || "Not specified"}</div>
            </div>

            <div style={infoItemStyle}>
              <div style={labelStyle}>Last Name</div>
              <div style={valueStyle}>{user.last_name || "Not specified"}</div>
            </div>

            <div style={infoItemStyle}>
              <div style={labelStyle}>Phone</div>
              <div style={valueStyle}>{user.phone_number || "Not specified"}</div>
            </div>

            <div style={infoItemStyle}>
              <div style={labelStyle}>Email Verified</div>
              <div style={valueStyle}>
                {user.email_verified ? (
                  <span style={{ color: "#4CAF50" }}>✓ Yes</span>
                ) : (
                  <span style={{ color: "#FF6B35" }}>✗ No</span>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "favourites" && (
          <div>
            <h2 style={titleStyle}>Favourites</h2>
            {favourites.length > 0 ? (
              <div style={gridStyle}>
                {favourites.map((fav) => (
                  <ProductCard key={fav.fav_id} product={fav} />
                ))}
              </div>
            ) : (
              <div style={emptyStyle}>
                <p>You don't have any favourite items yet</p>
                <button
                  onClick={() => navigate("/catalog")}
                  style={{
                    marginTop: "20px",
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: "700",
                    background: "#FF6B35",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(255, 107, 53, 0.3)",
                  }}
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
                  Go to Catalog
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "cart" && (
          <div>
            <h2 style={titleStyle}>Cart</h2>
            {cartItems.length > 0 ? (
              <div style={gridStyle}>
                {cartItems.map((item) => (
                  <ProductCard key={item.cart_item_id} product={item} />
                ))}
              </div>
            ) : (
              <div style={emptyStyle}>
                <p>Your cart is empty</p>
                <button
                  onClick={() => navigate("/catalog")}
                  style={{
                    marginTop: "20px",
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: "700",
                    background: "#FF6B35",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(255, 107, 53, 0.3)",
                  }}
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
                  Go to Catalog
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

