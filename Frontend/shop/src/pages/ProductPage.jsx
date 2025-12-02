import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProduct, fetchProductSizes } from "../api/products";
import { addToCart } from "../api/cart";
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

  useEffect(() => {
    async function load() {
      try {
        const [productData, sizesData] = await Promise.all([
          fetchProduct(id),
          fetchProductSizes(id),
        ]);
        setProduct(productData);
        setSizes(sizesData.sizes || []);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
        setMessage("Ошибка загрузки товара");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleAddToCart = async () => {
    if (selectedSize === null) {
      setMessage("Выберите размер");
      return;
    }

    // Проверяем авторизацию
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      setMessage("Для добавления в корзину необходимо войти в аккаунт");
      return;
    }

    setIsAdding(true);
    setMessage("");

    try {
      await addToCart(user.user_id, product.product_id, selectedSize, 1);
      setMessage("Товар добавлен в корзину!");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage(error.message || "Ошибка добавления в корзину");
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Загрузка...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Товар не найден
      </div>
    );
  }

  const pageStyle = {
    display: "flex",
    gap: "40px",
    padding: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
    flexWrap: "wrap",
  };

  const leftStyle = {
    flex: "1",
    minWidth: "300px",
  };

  const rightStyle = {
    flex: "1",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const imageStyle = {
    width: "100%",
    borderRadius: "12px",
    objectFit: "cover",
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const brandStyle = {
    color: "#666",
    fontSize: "18px",
    margin: "8px 0",
  };

  const priceStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    margin: "16px 0",
  };

  const sizesContainerStyle = {
    marginTop: "20px",
  };

  const sizesTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "12px",
  };

  const sizesGridStyle = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  };

  const sizeButtonStyle = (size, isSelected, isAvailable) => ({
    padding: "12px 20px",
    borderRadius: "8px",
    border: isSelected ? "2px solid #000" : "1px solid #ddd",
    cursor: isAvailable ? "pointer" : "not-allowed",
    background: isSelected ? "#f0f0f0" : isAvailable ? "#fff" : "#f5f5f5",
    color: isAvailable ? "#000" : "#999",
    fontSize: "16px",
    fontWeight: isSelected ? "600" : "400",
    transition: "all 0.2s",
    opacity: isAvailable ? 1 : 0.6,
  });

  const buttonStyle = {
    marginTop: "20px",
    padding: "16px 32px",
    fontSize: "18px",
    fontWeight: "bold",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: isAdding ? "not-allowed" : "pointer",
    opacity: isAdding ? 0.6 : 1,
    transition: "all 0.3s",
  };

  const messageStyle = {
    marginTop: "12px",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: message.includes("добавлен") ? "#d4edda" : "#f8d7da",
    color: message.includes("добавлен") ? "#155724" : "#721c24",
    fontSize: "14px",
  };

  const descriptionStyle = {
    marginTop: "30px",
    lineHeight: "1.6",
    color: "#555",
  };

  return (
    <div style={pageStyle}>
      <div style={leftStyle}>
        <img
          src={getImageUrl(product.image_url) || "https://via.placeholder.com/500"}
          alt={product.name}
          style={imageStyle}
        />
      </div>

      <div style={rightStyle}>
        <h1 style={titleStyle}>{product.name}</h1>
        <p style={brandStyle}>{product.brand || "Бренд не указан"}</p>
        <h2 style={priceStyle}>
          {selectedSize !== null && sizes.find(s => s.size === selectedSize)?.quantity === 0
            ? "Нет в наличии"
            : `${product.price} €`}
        </h2>

        <div style={sizesContainerStyle}>
          <h3 style={sizesTitleStyle}>Размеры</h3>
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

        <button onClick={handleAddToCart} style={buttonStyle} disabled={isAdding}>
          {isAdding ? "Добавление..." : "Добавить в корзину"}
        </button>

        {message && <div style={messageStyle}>{message}</div>}

        <div style={descriptionStyle}>
          <h3 style={{ marginBottom: "12px" }}>Описание</h3>
          <p>{product.description || "Описание отсутствует"}</p>
        </div>
      </div>
    </div>
  );
}
