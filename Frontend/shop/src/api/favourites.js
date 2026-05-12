import { buildApiUrl } from '../config/api.js';

export async function addToFavourites(userId, productId, size = null) {
  const response = await fetch(buildApiUrl('favourites/add'), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      product_id: productId,
      size: size,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка добавления в избранное");
  }
  return response.json();
}

export async function removeFromFavourites(userId, productId, size = null) {
  const response = await fetch(buildApiUrl('favourites/remove'), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      product_id: productId,
      size: size,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка удаления из избранного");
  }
  return response.json();
}

export async function checkFavourite(userId, productId, size = null) {
  const params = new URLSearchParams({
    user_id: userId,
    product_id: productId,
  });
  if (size !== null) {
    params.append('size', size);
  }
  
  const response = await fetch(`${buildApiUrl('favourites/check')}?${params.toString()}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка проверки избранного");
  }
  return response.json();
}

export async function getUserFavourites(userId) {
  const response = await fetch(buildApiUrl(`favourites/${userId}`));
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка загрузки избранного");
  }
  return response.json();
}

