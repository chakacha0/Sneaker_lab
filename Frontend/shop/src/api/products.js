import { buildApiUrl } from '../config/api.js';

export async function fetchProducts(filters = {}) {
  // Строим query параметры
  const params = new URLSearchParams();
  
  if (filters.minPrice !== undefined && filters.minPrice !== null) {
    params.append('min_price', filters.minPrice);
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
    params.append('max_price', filters.maxPrice);
  }
  if (filters.categoryId) {
    params.append('category_id', filters.categoryId);
  }
  if (filters.brandId) {
    params.append('brand_id', filters.brandId);
  }
  // Проверяем и selectedSizes (из фильтров) и sizes (прямая передача)
  const sizesToSend = filters.selectedSizes || filters.sizes || [];
  if (sizesToSend && sizesToSend.length > 0) {
    params.append('sizes', sizesToSend.join(','));
  }
  if (filters.gender) {
    params.append('gender', filters.gender);
  }
  if (filters.inStock !== undefined && filters.inStock !== null) {
    params.append('in_stock', filters.inStock.toString());
  }
  if (filters.ids && filters.ids.length > 0) {
    params.append('ids', filters.ids.join(','));
  }
  if (filters.sortBy) {
    params.append('sort_by', filters.sortBy);
  }
  if (filters.sortOrder) {
    params.append('sort_order', filters.sortOrder);
  }
  
  const queryString = params.toString();
  const url = `${buildApiUrl('products')}${queryString ? '?' + queryString : ''}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка загрузки товаров");
  }
  return response.json();
}

export async function fetchAiProductRecommendations(query, previousQuery = "") {
  const response = await fetch(buildApiUrl('products/ai-recommendations'), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      previous_query: previousQuery,
    }),
  });

  if (!response.ok) {
    let errorMessage = "Ошибка AI-подбора товаров";
    try {
      const error = await response.json();
      errorMessage = error.detail || error.message || errorMessage;
    } catch (e) {
      errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function fetchPriceRange() {
  const response = await fetch(buildApiUrl('products/price-range'));
  return response.json();
}

export async function fetchAvailableSizes() {
  const response = await fetch(buildApiUrl('products/available-sizes'));
  return response.json();
}

export async function fetchProduct(productId) {
  const res = await fetch(buildApiUrl(`products/${productId}`));
  return res.json();
}

export async function fetchProductSizes(productId) {
  const res = await fetch(buildApiUrl(`products/${productId}/sizes`));
  return res.json();
}

export async function addProductStock(productId, size, quantity) {
  const response = await fetch(buildApiUrl(`products/${productId}/stock`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      size: parseInt(size),
      quantity: parseInt(quantity),
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка добавления количества товара");
  }
  
  return response.json();
}

export async function updateProduct(productId, productData) {
  const formData = new FormData();
  
  if (productData.name) {
    formData.append("name", productData.name);
  }
  if (productData.description !== undefined) {
    formData.append("description", productData.description);
  }
  if (productData.price !== undefined && productData.price !== null) {
    // Преобразуем цену в строку, избегая проблем с точностью float
    const priceStr = typeof productData.price === 'string' 
      ? productData.price 
      : (Number.isInteger(productData.price) 
          ? productData.price.toString() 
          : parseFloat(productData.price).toFixed(2));
    formData.append("price", priceStr);
  }
  if (productData.brand_id) {
    formData.append("brand_id", productData.brand_id.toString());
  }
  if (productData.category_id) {
    formData.append("category_id", productData.category_id.toString());
  }
  if (productData.gender) {
    formData.append("gender", productData.gender);
  }
  if (productData.image) {
    formData.append("image", productData.image);
  }
  
  const response = await fetch(buildApiUrl(`products/${productId}`), {
    method: "PUT",
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка обновления товара");
  }
  
  return response.json();
}

export async function deleteProduct(productId) {
  const response = await fetch(buildApiUrl(`products/${productId}`), {
    method: "DELETE",
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка удаления товара");
  }
  
  return response.json();
}

export async function checkProductStock(productId) {
  const response = await fetch(buildApiUrl(`products/${productId}/has-stock`));
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка проверки наличия товара");
  }
  
  return response.json();
}

export async function searchProducts(query) {
  const response = await fetch(`${buildApiUrl('products/search')}?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    let errorMessage = "Ошибка поиска";
    try {
      const error = await response.json();
      errorMessage = error.detail || error.message || errorMessage;
    } catch (e) {
      errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function createProduct(productData) {
  const formData = new FormData();
  
  formData.append("name", productData.name);
  if (productData.description) {
    formData.append("description", productData.description);
  }
  if (productData.price !== undefined && productData.price !== null) {
    formData.append("price", productData.price.toString());
  }
  if (productData.brand_id) {
    formData.append("brand_id", productData.brand_id.toString());
  }
  if (productData.category_id) {
    formData.append("category_id", productData.category_id.toString());
  }
  if (productData.gender) {
    formData.append("gender", productData.gender);
  }
  if (productData.image) {
    formData.append("image", productData.image);
  }
  
  const response = await fetch(buildApiUrl('products/'), {
    method: "POST",
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка создания товара");
  }
  
  return response.json();
}

