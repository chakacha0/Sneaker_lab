import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getUserFavourites } from "../api/favourites";
import { getCart } from "../api/cart";
import { getUserOrders } from "../api/orders";
import AuthModal from "../components/AuthModal";
import ReviewModal from "../components/ReviewModal";
import { getImageUrl } from "../utils/imageUrl";
import { getUserReviewForProduct } from "../api/reviews";

function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userReviews, setUserReviews] = useState({}); // { productId: review }

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
      } else if (tab === "orders") {
        const data = await getUserOrders(userId);
        setOrders(data || []);
        // Загружаем отзывы для всех товаров в заказах
        if (data && data.length > 0) {
          const productIds = new Set();
          data.forEach(order => {
            if (order.items) {
              order.items.forEach(item => {
                productIds.add(item.product_id);
              });
            }
          });
          
          const reviewsMap = {};
          for (const productId of productIds) {
            try {
              const review = await getUserReviewForProduct(userId, productId);
              if (review) {
                reviewsMap[productId] = review;
              }
            } catch (error) {
              console.error(`Ошибка загрузки отзыва для товара ${productId}:`, error);
            }
          }
          setUserReviews(reviewsMap);
        }
      }
    } catch (error) {
      console.error(`Ошибка загрузки данных для ${tab}:`, error);
      if (tab === "favourites") {
        setFavourites([]);
      } else if (tab === "cart") {
        setCartItems([]);
      } else if (tab === "orders") {
        setOrders([]);
      }
    }
  };

  const handleOpenReviewModal = (item) => {
    setSelectedProduct(item);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedProduct(null);
  };

  const handleReviewSubmitted = async () => {
    // Перезагружаем отзывы после отправки
    if (user && user.user_id && selectedProduct) {
      try {
        const review = await getUserReviewForProduct(user.user_id, selectedProduct.product_id);
        if (review) {
          setUserReviews(prev => ({
            ...prev,
            [selectedProduct.product_id]: review
          }));
        }
      } catch (error) {
        console.error("Ошибка загрузки отзыва:", error);
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
    
    fontFamily: "'Google Sans Flex', sans-serif",
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
    fontFamily: "'Google Sans Flex', sans-serif",
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
    marginTop: "5px",
    textTransform: "uppercase",
    letterSpacing: "2px",
    borderBottom: "2px solid #FF6B35",
    paddingBottom: "10px",
    fontFamily: "'Google Sans Flex', sans-serif",
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
    fontFamily: "'Google Sans Flex', sans-serif",
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
    fontFamily: "'Google Sans Flex', sans-serif",
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

        <div
          style={activeTab === "orders" ? activeMenuItemStyle : menuItemStyle}
          onClick={() => handleTabChange("orders")}
          onMouseEnter={(e) => {
            if (activeTab !== "orders") {
              e.target.style.background = "rgba(255, 107, 53, 0.1)";
              e.target.style.borderColor = "#FF6B35";
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== "orders") {
              e.target.style.background = "transparent";
              e.target.style.borderColor = "transparent";
            }
          }}
        >
          Order History
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

        {activeTab === "orders" && (
          <div>
            <h2 style={titleStyle}>Order History</h2>
            {orders.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                {orders.map((order) => {
                  const orderDate = new Date(order.created_at);
                  const formattedDate = orderDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={order.order_id}
                      style={{
                        border: "2px solid #ddd",
                        borderRadius: "12px",
                        padding: "25px",
                        background: "#fafafa",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      }}
                    >
                      {/* Заголовок заказа */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "20px",
                          paddingBottom: "15px",
                          borderBottom: "2px solid #FF6B35",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              textTransform: "uppercase",
                              letterSpacing: "1px",
                              marginBottom: "5px",
                              fontFamily: "'Google Sans Flex', sans-serif",
                            }}
                          >
                            Order #{order.order_id}
                          </div>
                          <div
                            style={{
                              fontSize: "16px",
                              color: "#333",
                              fontWeight: "600",
                              fontFamily: "'Google Sans Flex', sans-serif",
                            }}
                          >
                            {formattedDate}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "#FF6B35",
                            fontFamily: "'Google Sans Flex', sans-serif",
                          }}
                        >
                          {parseFloat(order.total_price).toFixed(2)} $
                        </div>
                      </div>

                      {/* Товары заказа */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                          gap: "20px",
                        }}
                      >
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item) => {
                            const hasReview = userReviews[item.product_id];
                            return (
                            <div
                              key={item.order_item_id}
                              style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                overflow: "hidden",
                                background: "#fff",
                                transition: "transform 0.2s, box-shadow 0.2s",
                                display: "flex",
                                flexDirection: "column",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-5px)";
                                e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 107, 53, 0.3)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              {/* Изображение товара */}
                              <div
                                style={{
                                  width: "100%",
                                  height: "200px",
                                  background: "#f5f5f5",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  overflow: "hidden",
                                  cursor: "pointer",
                                }}
                                onClick={() => navigate(`/product/${item.product_id}`)}
                              >
                                {item.image_url ? (
                                  <img
                                    src={getImageUrl(item.image_url)}
                                    alt={item.name}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      color: "#999",
                                      fontSize: "14px",
                                      fontFamily: "'Google Sans Flex', sans-serif",
                                    }}
                                  >
                                    No Image
                                  </div>
                                )}
                              </div>

                              {/* Информация о товаре */}
                              <div style={{ padding: "15px" }}>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#FF6B35",
                                    textTransform: "uppercase",
                                    marginBottom: "5px",
                                    fontFamily: "'Google Sans Flex', sans-serif",
                                  }}
                                >
                                  {item.brand || "Brand"}
                                </div>
                                <div
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#333",
                                    marginBottom: "8px",
                                    fontFamily: "'Google Sans Flex', sans-serif",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {item.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#666",
                                    marginBottom: "5px",
                                    fontFamily: "'Google Sans Flex', sans-serif",
                                  }}
                                >
                                  Size: {item.size}
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#666",
                                    marginBottom: "8px",
                                    fontFamily: "'Google Sans Flex', sans-serif",                                  }}
                                >
                                  Quantity: {item.quantity}
                                </div>
                                <div
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    color: "#FF6B35",
                                    fontFamily: "'Google Sans Flex', sans-serif",
                                    marginBottom: "12px",
                                  }}
                                >
                                  {parseFloat(item.price_at_purchase).toFixed(2)} $
                                </div>
                                
                                {/* Кнопка отзыва */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenReviewModal(item);
                                  }}
                                  style={{
                                    width: "100%",
                                    padding: "10px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    background: hasReview ? "#4CAF50" : "#FF6B35",
                                    color: "#000",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    transition: "all 0.3s ease",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    fontFamily: "'Google Sans Flex', sans-serif",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.background = hasReview ? "#66BB6A" : "#FF8C42";
                                    e.target.style.transform = "translateY(-2px)";
                                    e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.background = hasReview ? "#4CAF50" : "#FF6B35";
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                                  }}
                                >
                                  {hasReview ? "✓ Отзыв оставлен" : "Написать отзыв"}
                                </button>
                              </div>
                            </div>
                            );
                          })
                        ) : (
                          <div style={{ ...emptyStyle, gridColumn: "1 / -1" }}>
                            No items in this order
                          </div>
                        )}
                      </div>

                      {/* Промокод если использован */}
                      {order.promo_code && (
                        <div
                          style={{
                            marginTop: "15px",
                            padding: "10px 15px",
                            background: "rgba(255, 107, 53, 0.1)",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#FF6B35",
                            fontFamily: "'Fragment Mono', monospace",
                          }}
                        >
                          Promo Code: {order.promo_code}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={emptyStyle}>
                <p>You don't have any orders yet</p>
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

      {/* Модальное окно отзыва */}
      {isReviewModalOpen && selectedProduct && user && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={handleCloseReviewModal}
          productId={selectedProduct.product_id}
          productName={selectedProduct.name}
          userId={user.user_id}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
}

export default Profile;

