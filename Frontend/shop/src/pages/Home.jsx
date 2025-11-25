import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import BrandCard from "../components/BrandCard";
import { fetchProducts } from "../api/products";
import { fetchBrands } from "../api/brands";

function Home() {
  const [brands, setBrands] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchBrands().then(setBrands);
    fetchProducts().then((products) => {
      // Сортируем по продажам и берём топ 10
      const top10 = products
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 10);
      setTopProducts(top10);
    });
  }, []);

  const sectionStyle = {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 20px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
  };

  const productsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  };

  return (
    <div>
      {/* Секция брендов */}
      <section style={sectionStyle}>
        <h2>Бренды</h2>
        <div style={gridStyle}>
          {brands.map((brand) => (
            <BrandCard key={brand.brand_id} brand={brand} />
          ))}
        </div>
      </section>

      {/* Секция топ продаж */}
      <section style={sectionStyle}>
        <h2>Топ 10 продаж</h2>
        <div style={productsGridStyle}>
          {topProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
