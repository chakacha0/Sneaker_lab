import React, { useState } from "react";
import { createReview } from "../api/reviews";

function ReviewModal({ isOpen, onClose, productId, productName, userId, orderItemId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setMessage("Please select a rating");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await createReview({
        user_id: userId,
        product_id: productId,
        rating: rating,
        text: text || null,
        order_item_id: orderItemId || null,
      });
      
      setMessage("Review successfully submitted!");
      setRating(0);
      setText("");
      
      setTimeout(() => {
        onClose();
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      }, 1000);
    } catch (error) {
      setMessage(error.message || "Error submitting review");
    } finally {
      setIsLoading(false);
    }
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    position: "relative",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "transparent",
    border: "none",
    fontSize: "32px",
    cursor: "pointer",
    color: "#666",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "all 0.3s ease",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#FF6B35",
    marginBottom: "20px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const starsContainerStyle = {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    alignItems: "center",
  };

  const starStyle = (starNumber) => ({
    fontSize: "32px",
    cursor: "pointer",
    color: starNumber <= (hoveredRating || rating) ? "#FFD700" : "#ddd",
    transition: "all 0.2s ease",
    userSelect: "none",
  });

  const textareaStyle = {
    width: "100%",
    padding: "12px",
    border: "2px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "'Google Sans Flex', sans-serif",
    resize: "vertical",
    minHeight: "120px",
    boxSizing: "border-box",
    marginBottom: "20px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "15px",
    fontSize: "16px",
    fontWeight: "700",
    background: "#FF6B35",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    cursor: isLoading ? "not-allowed" : "pointer",
    textTransform: "uppercase",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(255, 107, 53, 0.3)",
    opacity: isLoading ? 0.6 : 1,
  };

  const messageStyle = {
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    fontFamily: "'Google Sans Flex', sans-serif",
    textAlign: "center",
  };

  const messageSuccessStyle = {
    ...messageStyle,
    background: "rgba(76, 175, 80, 0.1)",
    color: "#4CAF50",
    border: "1px solid #4CAF50",
  };

  const messageErrorStyle = {
    ...messageStyle,
    background: "rgba(244, 67, 54, 0.1)",
    color: "#F44336",
    border: "1px solid #F44336",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={closeButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(0, 0, 0, 0.1)";
            e.target.style.color = "#000";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "#666";
          }}
          disabled={isLoading}
        >
          ×
        </button>

        <h2 style={titleStyle}>Write a review</h2>

        {productName && (
          <div style={{ marginBottom: "20px", color: "#666", fontSize: "14px" }}>
            Product: <strong>{productName}</strong>
          </div>
        )}

        {message && (
          <div
            style={
              message.includes("successfully") ? messageSuccessStyle : messageErrorStyle
            }
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Rating *</label>
          <div style={starsContainerStyle}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={starStyle(star)}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                ★
              </span>
            ))}
            {rating > 0 && (
              <span style={{ marginLeft: "10px", color: "#666", fontSize: "14px" }}>
                {rating} {rating === 1 ? "star" : rating < 5 ? "stars" : "stars"}
              </span>
            )}
          </div>

          <label style={labelStyle}>Review text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell us about your experience using the product..."
            style={textareaStyle}
            disabled={isLoading}
          />

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
            {isLoading ? "Sending..." : "Submit review"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewModal;

