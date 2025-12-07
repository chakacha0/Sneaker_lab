import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { fetchProducts, fetchPriceRange, fetchAvailableSizes, searchProducts } from "../api/products";
import { fetchBrands } from "../api/brands";
import { fetchCategories } from "../api/categories";

function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min_price: 0, max_price: 1000 });
  const [loading, setLoading] = useState(true);

  // Получаем параметры из URL
  const brandIdFromUrl = searchParams.get("brandId");
  const searchQueryFromUrl = searchParams.get("search");
  const genderFromUrl = searchParams.get("gender");

  // Фильтры
  const [filters, setFilters] = useState({
    minPrice: undefined,
    maxPrice: undefined,
    categoryId: null,
    brandId: brandIdFromUrl ? parseInt(brandIdFromUrl) : null,
    selectedSizes: [],
    gender: genderFromUrl || null,
    sortBy: "created_at",
    sortOrder: "DESC",
  });
  
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const [sizesDropdownOpen, setSizesDropdownOpen] = useState(false);
  const sizesDropdownRef = useRef(null);

  // Закрываем выпадающий список при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sizesDropdownRef.current && !sizesDropdownRef.current.contains(event.target)) {
        setSizesDropdownOpen(false);
      }
    };

    if (sizesDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sizesDropdownOpen]);

  // Обновляем фильтры при изменении URL параметров
  useEffect(() => {
    const brandIdFromUrl = searchParams.get("brandId");
    const genderFromUrl = searchParams.get("gender");
    
    setFilters(prev => ({
      ...prev,
      brandId: brandIdFromUrl ? parseInt(brandIdFromUrl) : null,
      gender: genderFromUrl || null,
    }));
  }, [searchParams]);

  // Загружаем данные для фильтров
  useEffect(() => {
    async function loadFilterData() {
      try {
        const [brandsData, categoriesData, sizesData, priceRangeData] = await Promise.all([
          fetchBrands(),
          fetchCategories(),
          fetchAvailableSizes(),
          fetchPriceRange(),
        ]);
        
        setBrands(brandsData || []);
        setCategories(categoriesData || []);
        setSizes(sizesData && Array.isArray(sizesData) ? sizesData.map(s => s.size || s) : []);
        
        if (priceRangeData) {
          setPriceRange({
            min_price: priceRangeData.min_price || 0,
            max_price: priceRangeData.max_price || 1000,
          });
        }
        // Не устанавливаем фильтры по цене автоматически - пусть будут пустыми для показа всех товаров
        setFiltersInitialized(true);
      } catch (error) {
        console.error("Ошибка загрузки данных фильтров:", error);
      }
    }
    loadFilterData();
  }, []);

  // Загружаем товары при изменении фильтров или поискового запроса (только после инициализации)
  useEffect(() => {
    if (!filtersInitialized) return;
    
    async function loadProducts() {
      setLoading(true);
      try {
        // Если есть поисковый запрос, используем поиск, но все равно применяем фильтры
        if (searchQueryFromUrl && searchQueryFromUrl.trim()) {
          const searchResults = await searchProducts(searchQueryFromUrl.trim());
          let filteredResults = Array.isArray(searchResults) ? searchResults : [];
          
          // Применяем фильтры к результатам поиска
          if (filters.minPrice !== undefined && filters.minPrice !== null) {
            filteredResults = filteredResults.filter(p => p.price >= filters.minPrice);
          }
          if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
            filteredResults = filteredResults.filter(p => p.price <= filters.maxPrice);
          }
          if (filters.categoryId) {
            filteredResults = filteredResults.filter(p => p.category_id === filters.categoryId);
          }
          if (filters.brandId) {
            filteredResults = filteredResults.filter(p => p.brand_id === filters.brandId);
          }
          if (filters.gender) {
            filteredResults = filteredResults.filter(p => p.gender === filters.gender);
          }
          if (filters.selectedSizes.length > 0) {
            // Фильтрация по размерам требует дополнительной логики, пока пропускаем
          }
          
          // Сортировка
          if (filters.sortBy === "price") {
            filteredResults.sort((a, b) => filters.sortOrder === "ASC" ? a.price - b.price : b.price - a.price);
          } else if (filters.sortBy === "name") {
            filteredResults.sort((a, b) => {
              const nameA = a.name || "";
              const nameB = b.name || "";
              return filters.sortOrder === "ASC" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            });
          }
          
          setProducts(filteredResults);
        } else {
          // Иначе используем фильтры
          const cleanFilters = {
            ...filters,
            minPrice: filters.minPrice !== undefined && filters.minPrice !== null ? filters.minPrice : undefined,
            maxPrice: filters.maxPrice !== undefined && filters.maxPrice !== null ? filters.maxPrice : undefined,
          };
          
          const productsData = await fetchProducts(cleanFilters);
          setProducts(Array.isArray(productsData) ? productsData : []);
        }
      } catch (error) {
        console.error("Ошибка загрузки товаров:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [filters, filtersInitialized, searchQueryFromUrl]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Если изменяется brandId, обновляем URL параметр
    if (key === "brandId") {
      if (value) {
        setSearchParams({ brandId: value.toString() });
      } else {
        setSearchParams({});
      }
    }
  };

  const handleSizeToggle = (size) => {
    setFilters(prev => {
      const selectedSizes = prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter(s => s !== size)
        : [...prev.selectedSizes, size];
      return { ...prev, selectedSizes };
    });
  };

  const handleResetFilters = () => {
    setFilters({
      minPrice: priceRange.min_price || 0,
      maxPrice: priceRange.max_price || 1000,
      categoryId: null,
      brandId: null,
      selectedSizes: [],
      gender: null,
      sortBy: "created_at",
      sortOrder: "DESC",
    });
    // Очищаем URL параметры
    setSearchParams({});
  };

  const containerStyle = {
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "px",
  };

  const filtersContainerStyle = {
    marginBottom: "30px",
    padding: "10px 0",
  };

  const filtersRowStyle = {
    display: "flex",
    flexWrap: "nowrap",
    gap: "15px",
    alignItems: "flex-end",
    overflowX: "auto",
  };

  const filterGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0px",
  };

  const labelStyle = {
    fontSize: "11px",
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "4px",
    fontFamily: "'Google Sans Flex', sans-serif",    
    whiteSpace: "nowrap",
  };

  const inputStyle = {
    padding: "6px 10px",
    fontSize: "13px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    outline: "none",
    background: "#f5f5f5",
    color: "#333",
    transition: "all 0.3s ease",
    fontFamily: "'Google Sans Flex', sans-serif",
    width: "100%",
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
    minWidth: "130px",
  };

  const sizesSelectStyle = {
    ...selectStyle,
    minWidth: "150px",
  };

  const buttonStyle = {
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: "700",
    background: "#FF6B35",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
    fontFamily: "'Google Sans Flex', sans-serif",
    whiteSpace: "nowrap",
    height: "fit-content",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "25px",
  };

  const loadingStyle = {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    color: "#333",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  return (
    <div style={containerStyle}>
      {/* Показываем результаты поиска, если есть поисковый запрос */}
      {searchQueryFromUrl && (
        <div style={{ marginBottom: "20px", color: "#FF6B35", fontSize: "16px", fontWeight: "600", fontFamily: "'Fragment Mono', monospace" }}>
          Search results for: "{searchQueryFromUrl}"
        </div>
      )}
      
      {/* Фильтры (всегда показываем) */}
      <div style={filtersContainerStyle}>
        <div style={filtersRowStyle}>
          {/* Цена от */}
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Price from</label>
            <input
              type="number"
              value={filters.minPrice || ""}
              onChange={(e) => handleFilterChange("minPrice", e.target.value ? parseFloat(e.target.value) : null)}
              placeholder={priceRange.min_price || "0"}
              style={{...inputStyle, width: "100px"}}
            />
          </div>
          
          {/* Цена до */}
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Price to</label>
            <input
              type="number"
              value={filters.maxPrice || ""}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value ? parseFloat(e.target.value) : null)}
              placeholder={priceRange.max_price || "1000"}
              style={{...inputStyle, width: "100px"}}
            />
          </div>

          {/* Категория */}
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Category</label>
            <select
              value={filters.categoryId || ""}
              onChange={(e) => handleFilterChange("categoryId", e.target.value ? parseInt(e.target.value) : null)}
              style={{...selectStyle, minWidth: "150px"}}
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Бренд */}
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Brand</label>
            <select
              value={filters.brandId || ""}
              onChange={(e) => handleFilterChange("brandId", e.target.value ? parseInt(e.target.value) : null)}
              style={{...selectStyle, minWidth: "150px"}}
            >
              <option value="">All brands</option>
              {brands.map((brand) => (
                <option key={brand.brand_id} value={brand.brand_id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Пол */}
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Gender</label>
            <select
              value={filters.gender || ""}
              onChange={(e) => handleFilterChange("gender", e.target.value || null)}
              style={{...selectStyle, minWidth: "120px"}}
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          {/* Размеры - выпадающий список с кружочками */}
          <div ref={sizesDropdownRef} style={{...filterGroupStyle, position: "relative"}}>
            <label style={labelStyle}>Sizes</label>
            <div
              onClick={() => setSizesDropdownOpen(!sizesDropdownOpen)}
              style={{
                ...sizesSelectStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                minHeight: "32px",
              }}
            >
              <span style={{fontSize: "13px", color: filters.selectedSizes.length > 0 ? "#333" : "#999"}}>
                {filters.selectedSizes.length > 0 
                  ? `${filters.selectedSizes.length} selected` 
                  : "Select sizes"}
              </span>
              <span style={{fontSize: "10px", color: "#999"}}>▼</span>
            </div>
            {sizesDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  zIndex: 1000,
                  maxHeight: "200px",
                  overflowY: "auto",
                  marginTop: "4px",
                }}
              >
                {sizes.map((size) => {
                  const isSelected = filters.selectedSizes.includes(size);
                  return (
                    <div
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      style={{
                        padding: "8px 12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        transition: "background 0.2s",
                        fontFamily: "'Fragment Mono', monospace",
                        fontSize: "13px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f5f5f5";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fff";
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          border: "2px solid #ddd",
                          background: isSelected ? "#FF6B35" : "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s",
                        }}
                      >
                        {isSelected && (
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "#fff",
                            }}
                          />
                        )}
                      </div>
                      <span style={{color: "#333"}}>{size}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Сортировка */}
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Sort</label>
            <select
              value={`${filters.sortBy}_${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("_");
                handleFilterChange("sortBy", sortBy);
                handleFilterChange("sortOrder", sortOrder);
              }}
              style={{...selectStyle, minWidth: "150px"}}
            >
              <option value="created_at_DESC">Default</option>
              <option value="price_ASC">Price: Low to High</option>
              <option value="price_DESC">Price: High to Low</option>
              <option value="name_ASC">Name: A-Z</option>
              <option value="name_DESC">Name: Z-A</option>
            </select>
          </div>

          {/* Кнопка сброса */}
          <div style={filterGroupStyle}>
            <label style={{...labelStyle, opacity: 0, pointerEvents: "none"}}>Reset</label>
            <button 
              onClick={handleResetFilters} 
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = "#FF8C42";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#FF6B35";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Товары */}
      {loading ? (
        <div style={loadingStyle}>Loading...</div>
      ) : (
        <div style={gridStyle}>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "40px", gridColumn: "1 / -1", color: "#666", fontFamily: "'Fragment Mono', monospace" }}>
              No products found. Try changing filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Catalog;
