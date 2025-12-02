import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getUserFavourites } from "../api/favourites";
import AuthModal from "../components/AuthModal";

function Favourites() {
  const navigate = useNavigate();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user || !user.user_id) {
      setIsAuthModalOpen(true);
      setLoading(false);
      return;
    }

    async function loadFavourites() {
      try {
        const data = await getUserFavourites(user.user_id);
        setFavourites(data || []);
      } catch (error) {
        console.error("Ошибка загрузки избранного:", error);
        setFavourites([]);
      } finally {
        setLoading(false);
      }
    }

    loadFavourites();
  }, [user]);

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
    background: "#fff",
    minHeight: "100vh",
  };

  const titleStyle = {
    fontFamily: "'Fragment Mono', monospace",
    fontSize: "32px",
    fontWeight: "700",
    color: "#FF6B35",
    marginBottom: "30px",
    textTransform: "uppercase",
    letterSpacing: "2px",
    borderBottom: "3px solid #FF6B35",
    paddingBottom: "10px",
    display: "inline-block",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "25px",
  };

  const emptyStyle = {
    textAlign: "center",
    padding: "60px 20px",
    color: "#666",
    fontSize: "18px",
    fontFamily: "'Fragment Mono', monospace",
  };

  const loadingStyle = {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    color: "#333",
    fontFamily: "'Fragment Mono', monospace",
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>Loading...</div>
      </div>
    );
  }

  if (!user || !user.user_id) {
    return (
      <div style={containerStyle}>
        <h2 style={titleStyle}>Favourites</h2>
        <div style={emptyStyle}>
          <p>Please log in to view your favourite items</p>
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
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "1px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(255, 107, 53, 0.3)",
              fontFamily: "'Fragment Mono', monospace",
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
  );
}

export default Favourites;

