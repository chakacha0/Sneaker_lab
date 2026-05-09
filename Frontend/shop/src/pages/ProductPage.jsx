import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProduct, fetchProductSizes } from "../api/products";
import { addToCart } from "../api/cart";
import { addToFavourites, removeFromFavourites, checkFavourite } from "../api/favourites";
import { getProductReviews, getProductReviewStats } from "../api/reviews";
import { getImageUrl } from "../utils/imageUrl";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isCheckingFavourite, setIsCheckingFavourite] = useState(true);
  const [isAddingToFavourites, setIsAddingToFavourites] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ total_reviews: 0, average_rating: 0 });
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [productData, sizesData] = await Promise.all([
          fetchProduct(id),
          fetchProductSizes(id),
        ]);
        setProduct(productData);
        setSizes(sizesData.sizes || []);
        
        // Загружаем отзывы
        try {
          const [reviewsData, statsData] = await Promise.all([
            getProductReviews(productData.product_id),
            getProductReviewStats(productData.product_id),
          ]);
          setReviews(reviewsData || []);
          setReviewStats(statsData || { total_reviews: 0, average_rating: 0 });
        } catch (error) {
          console.error("Error loading reviews:", error);
          setReviews([]);
          setReviewStats({ total_reviews: 0, average_rating: 0 });
        } finally {
          setLoadingReviews(false);
        }
        
        // Проверяем, находится ли товар в избранном
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (user && user.user_id) {
          try {
            const favouriteData = await checkFavourite(user.user_id, productData.product_id, null);
            setIsFavourite(favouriteData.is_favourite);
          } catch (error) {
            console.error("Error checking favourite:", error);
          } finally {
            setIsCheckingFavourite(false);
          }
        } else {
          setIsCheckingFavourite(false);
        }
      } catch (error) {
        console.error("Error loading:", error);
        setMessage("Error loading product");
        setIsCheckingFavourite(false);
        setLoadingReviews(false);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleAddToCart = async () => {
    // Проверяем авторизацию в первую очередь
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      setMessage("Please log in or sign up");
      return;
    }

    // Затем проверяем выбранный размер
    if (selectedSize === null) {
      // Проверяем, есть ли доступные размеры
      const hasAvailableSizes = sizes.some(s => s.quantity > 0);
      if (!hasAvailableSizes) {
        setMessage("There are no sizes available, may become available later.");
      } else {
        setMessage("Select a size");
      }
      return;
    }

    setIsAdding(true);
    setMessage("");

    try {
      await addToCart(user.user_id, product.product_id, selectedSize, 1);
      setMessage("Item added to cart!");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage(error.message || "Error adding to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleFavourite = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      setMessage("Please log in to add items to favourites");
      return;
    }

    setIsAddingToFavourites(true);
    setMessage("");

    try {
      if (isFavourite) {
        await removeFromFavourites(user.user_id, product.product_id, selectedSize || null);
        setIsFavourite(false);
        setMessage("Removed from favourites");
      } else {
        await addToFavourites(user.user_id, product.product_id, selectedSize || null);
        setIsFavourite(true);
        setMessage("Added to favourites");
      }
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage(error.message || "Error updating favourites");
    } finally {
      setIsAddingToFavourites(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px", fontFamily: "'Google Sans Flex', sans-serif" }}>
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "40px", fontFamily: "'Google Sans Flex', sans-serif" }}>
        Product not found
      </div>
    );
  }

  const pageStyle = {
    display: "flex",
    gap: "30px",
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    flexWrap: "wrap",
  };

  const leftStyle = {
    flex: "1",
    minWidth: "300px",
    marginRight: "10px",
  };

  const rightStyle = {
    flex: "1",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  const imageContainerStyle = {
    width: "100%",
    padding: "10px",
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const imageStyle = {
    width: "95%",
    maxWidth: "550px",
    borderRadius: "8px",
    objectFit: "contain",
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0 0 5px 0",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const brandStyle = {
    color: "#666",
    fontSize: "18px",
    margin: "3px 0",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const priceStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    margin: "5px 0",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const sizesContainerStyle = {
    marginTop: "10px",
  };

  const sizesTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "6px",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const sizesGridStyle = {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  };

  const sizeButtonStyle = (size, isSelected, isAvailable) => ({
    padding: "8px 16px",
    borderRadius: "8px",
    border: isSelected ? "2px solid #000" : "1px solid #ddd",
    cursor: isAvailable ? "pointer" : "not-allowed",
    background: isSelected ? "#f0f0f0" : isAvailable ? "#fff" : "#f5f5f5",
    color: isAvailable ? "#000" : "#999",
    fontSize: "16px",
    fontWeight: isSelected ? "600" : "400",
    transition: "all 0.2s",
    opacity: isAvailable ? 1 : 0.6,
    fontFamily: "'Google Sans Flex', sans-serif",
  });

  const buttonsContainerStyle = {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    flexWrap: "wrap",
  };

  const buttonStyle = {
    flex: "1",
    minWidth: "150px",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "600",
    background: "#FF6B35",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const buttonDisabledStyle = {
    ...buttonStyle,
    opacity: 0.6,
    cursor: "not-allowed",
  };

  const messageStyle = {
    marginTop: "6px",
    padding: "8px",
    borderRadius: "8px",
    backgroundColor: message.includes("added") || message.includes("Added") ? "#d4edda" : "#f8d7da",
    color: message.includes("added") || message.includes("Added") ? "#155724" : "#721c24",
    fontSize: "14px",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const descriptionStyle = {
    marginTop: "12px",
    lineHeight: "1.6",
    color: "#555",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  return (
    <div style={pageStyle}>
      <div style={leftStyle}>
        <div style={imageContainerStyle}>
          <img
            src={getImageUrl(product.image_url) || "https://via.placeholder.com/500"}
            alt={product.name}
            style={imageStyle}
          />
        </div>
      </div>

      <div style={rightStyle}>
        <h1 style={titleStyle}>{product.name}</h1>
        <p style={brandStyle}>{product.brand || "Brand not specified"}</p>
        <h2 style={priceStyle}>
          {selectedSize !== null && sizes.find(s => s.size === selectedSize)?.quantity === 0
            ? "Out of stock"
            : `${product.price} $`}
        </h2>

        <div style={sizesContainerStyle}>
          <h3 style={sizesTitleStyle}>Sizes</h3>
          <div style={sizesGridStyle}>
            {sizes.map((sizeData) => {
              const size = sizeData.size;
              const quantity = sizeData.quantity;
              const isAvailable = quantity > 0;
              const isSelected = selectedSize === size;

              return (
                <div
                  key={size}
                  onClick={() => {
                    if (isAvailable) {
                      setSelectedSize(size);
                      setMessage("");
                    }
                  }}
                  style={sizeButtonStyle(size, isSelected, isAvailable)}
                >
                  {size}
                </div>
              );
            })}
          </div>
        </div>

        <div style={buttonsContainerStyle}>
          <button 
            onClick={handleAddToCart} 
            style={isAdding ? buttonDisabledStyle : buttonStyle} 
            disabled={isAdding}
            onMouseEnter={(e) => {
              if (!isAdding) {
                e.target.style.background = "#FF8C42";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 12px rgba(255, 107, 53, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isAdding) {
                e.target.style.background = "#FF6B35";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
          
          <button 
            onClick={handleToggleFavourite} 
            style={isAddingToFavourites ? buttonDisabledStyle : buttonStyle} 
            disabled={isAddingToFavourites || isCheckingFavourite}
            onMouseEnter={(e) => {
              if (!isAddingToFavourites && !isCheckingFavourite) {
                e.target.style.background = "#FF8C42";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 12px rgba(255, 107, 53, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isAddingToFavourites && !isCheckingFavourite) {
                e.target.style.background = "#FF6B35";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            {isAddingToFavourites 
              ? "Processing..." 
              : isFavourite 
                ? "Remove from Favourites" 
                : "Add to Favourites"}
          </button>
        </div>

        {message && <div style={messageStyle}>{message}</div>}

        <div style={descriptionStyle}>
          <h3 style={{ marginBottom: "6px", fontFamily: "'Google Sans Flex', sans-serif" }}>Description</h3>
          <p style={{ fontFamily: "'Google Sans Flex', sans-serif" }}>{product.description || "No description available"}</p>
        </div>
      </div>

      {/* Секция отзывов */}
      <div style={{
        width: "100%",
        marginTop: "5px",
        padding: "20px",
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e0e0e0",
      }}>
        <h2 style={{
          fontSize: "28px",
          marginTop: "5px",
          fontWeight: "700",
          color: "#FF6B35",
          marginBottom: "12px",
          fontFamily: "'Google Sans Flex', sans-serif",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}>
          Reviews
        </h2>

        {/* Статистика отзывов */}
        {!loadingReviews && reviewStats.total_reviews > 0 && (
          <div style={{
            marginBottom: "15px",
            padding: "15px",
            background: "#f9f9f9",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}>
            <div>
              <div style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "#FF6B35",
                fontFamily: "'Google Sans Flex', sans-serif",
              }}>
                {reviewStats.average_rating.toFixed(1)}
              </div>
              <div style={{
                fontSize: "14px",
                color: "#666",
                fontFamily: "'Google Sans Flex', sans-serif",
              }}>
                Average Rating
              </div>
            </div>
            <div>
              <div style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "#333",
                fontFamily: "'Google Sans Flex', sans-serif",
              }}>
                {reviewStats.total_reviews}
              </div>
              <div style={{
                fontSize: "14px",
                color: "#666",
                fontFamily: "'Google Sans Flex', sans-serif",
              }}>
                {reviewStats.total_reviews === 1 ? "Review" : "Reviews"}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "5px",
              alignItems: "center",
            }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    fontSize: "24px",
                    color: star <= Math.round(reviewStats.average_rating) ? "#FFD700" : "#ddd",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Список отзывов */}
        {loadingReviews ? (
          <div style={{
            textAlign: "center",
            padding: "20px",
            fontFamily: "'Google Sans Flex', sans-serif",
            color: "#666",
          }}>
            Loading reviews...
          </div>
        ) : reviews.length > 0 ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}>
            {reviews.map((review) => {
              const reviewDate = new Date(review.created_at);
              const formattedDate = reviewDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <div
                  key={review.review_id}
                  style={{
                    padding: "12px",
                    background: "#f9f9f9",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}>
                    <div>
                      <div style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#333",
                        marginBottom: "5px",
                        fontFamily: "'Google Sans Flex', sans-serif",
                      }}>
                        {review.first_name && review.last_name
                          ? `${review.first_name} ${review.last_name}`
                          : review.email
                          ? review.email.split("@")[0]
                          : "Anonymous"}
                      </div>
                      <div style={{
                        fontSize: "14px",
                        color: "#666",
                        fontFamily: "'Google Sans Flex', sans-serif",
                      }}>
                        {formattedDate}
                      </div>
                    </div>
                    <div style={{
                      display: "flex",
                      gap: "3px",
                    }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          style={{
                            fontSize: "24px",
                            color: star <= review.rating ? "#FFD700" : "#ddd",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {review.text && (
                    <div style={{
                      fontSize: "16px",
                      color: "#555",
                      lineHeight: "1.6",
                      fontFamily: "'Google Sans Flex', sans-serif",
                    }}>
                      {review.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "20px",
            color: "#666",
            fontFamily: "'Google Sans Flex', sans-serif",
          }}>
            No reviews yet. Be the first to review this product!
          </div>
        )}
      </div>
    </div>
  );
}
