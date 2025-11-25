import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../api/products";

function Catalog() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts().then(setProducts);
    }, []);

    const containerStyle = {
        display: "flex",
        justifyContent: "center",
        padding: "20px",
    };

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
    };

    return (
        <div style={containerStyle}>
            <div style={gridStyle}>
                {products.map((product) => (
                    <ProductCard key={product.product_id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default Catalog;
