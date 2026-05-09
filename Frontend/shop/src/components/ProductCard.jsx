import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addToFavourites, removeFromFavourites, checkFavourite } from "../api/favourites";
import { getImageUrl } from "../utils/imageUrl";

function ProductCard({ product }) {
    const navigate = useNavigate();
    const [isFavourite, setIsFavourite] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    
    // Получаем пользователя из localStorage
    const user = JSON.parse(localStorage.getItem("user") || "null");
    
    // Проверяем, находится ли товар в избранном
    useEffect(() => {
        if (user && user.user_id) {
            checkFavourite(user.user_id, product.product_id, product.size || null)
                .then((data) => {
                    setIsFavourite(data.is_favourite);
                    setIsChecking(false);
                })
                .catch(() => {
                    setIsChecking(false);
                });
        } else {
            setIsChecking(false);
        }
    }, [user, product.product_id, product.size]);
    
    const handleFavouriteClick = async (e) => {
        e.stopPropagation(); // Prevent navigation to product page
        
        if (!user || !user.user_id) {
            alert("Please sign in to add items to favourites");
            return;
        }
        
        try {
            if (isFavourite) {
                await removeFromFavourites(user.user_id, product.product_id, product.size || null);
                setIsFavourite(false);
            } else {
                await addToFavourites(user.user_id, product.product_id, product.size || null);
                setIsFavourite(true);
            }
        } catch (error) {
            console.error("Error working with favourites:", error);
            alert("Error: " + error.message);
        }
    };

    const cardStyle = {
        fontFamily: "'Google Sans Flex', sans-serif",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: "1px solid #ddd",
    };

    const imageStyle = {
        background: "#fff",
        height: "200px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
    };

    const infoStyle = {
        padding: "15px",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "space-between",
    };

    const nameStyle = { 
        fontSize: "16px", 
        margin: "0 0 8px 0",
        color: "#333",
        fontWeight: "600",
        minHeight: "48px", // Фиксированная высота для названия (2 строки)
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    };
    const brandStyle = { 
        color: "#FF6B35", 
        fontSize: "12px", 
        marginBottom: "8px",
        textTransform: "uppercase",
        letterSpacing: "1px",
        fontWeight: "600",
    };
    
    const priceContainerStyle = {
        marginTop: "auto", // Прижимаем цену к низу
        paddingTop: "8px",
    };
    
    const priceStyle = { 
        fontWeight: "bold", 
        fontSize: "18px", 
        color: "#FF6B35",
        textShadow: "0 0 8px rgba(255, 107, 53, 0.5)",
        margin: "0 0 8px 0",
    };
    
    const outOfStockStyle = {
        backgroundColor: "#f44336",
        color: "#fff",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        display: "inline-block",
        fontFamily: "'Google Sans Flex', sans-serif",
        marginTop: "4px",
    };

    const heartStyle = {
        position: "absolute",
        top: "10px",
        right: "10px",
        width: "32px",
        height: "32px",
        cursor: "pointer",
        background: "rgba(255, 255, 255, 0.9)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        zIndex: 10,
        border: "1px solid rgba(255, 107, 53, 0.5)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    };

    return (
        <div
            style={{ ...cardStyle, position: "relative" }}
            onClick={() => navigate(`/product/${product.product_id}`)}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15), 0 0 30px rgba(255, 107, 53, 0.2)";
                e.currentTarget.style.borderColor = "#FF6B35";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "#ddd";
            }}
        >
            {/* Иконка избранного */}
            {!isChecking && (
                <div
                    style={heartStyle}
                    onClick={handleFavouriteClick}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 107, 53, 0.9)";
                        e.currentTarget.style.transform = "scale(1.1)";
                        e.currentTarget.style.borderColor = "#FF6B35";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = isFavourite ? "rgba(255, 107, 53, 0.2)" : "rgba(255, 255, 255, 0.9)";
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.borderColor = isFavourite ? "#FF6B35" : "rgba(255, 107, 53, 0.5)";
                    }}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={isFavourite ? "#FF6B35" : "none"}
                        stroke={isFavourite ? "#FF6B35" : "#333"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </div>
            )}
            
            <div style={imageStyle}>
                <img
                    src={getImageUrl(product.image_url) || "https://via.placeholder.com/400x300?text=No+Image"}
                    alt={product.name}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        objectPosition: "center",
                    }}
                />
            </div>
            <div style={infoStyle}>
                <div>
                    <h2 style={nameStyle}>{product.name}</h2>
                    <p style={brandStyle}>{product.brand}</p>
                </div>
                <div style={priceContainerStyle}>
                    <p style={priceStyle}>{product.price} $</p>
                    {/* Пометка "нет в наличии" - ниже цены */}
                    {product.has_stock === false && (
                        <div style={outOfStockStyle}>
                            Out of Stock
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
