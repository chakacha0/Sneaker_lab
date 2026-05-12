import { buildApiUrl } from '../config/api.js';

export async function addToCart(userId, productId, size, quantity = 1) {
  const response = await fetch(buildApiUrl('cart/add'), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      product_id: productId,
      size: size,
      quantity: quantity,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка добавления в корзину");
  }

  return response.json();
}

export async function getCart(userId) {
  const response = await fetch(buildApiUrl(`cart/${userId}`), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка получения корзины");
  }

  return response.json();
}

export async function removeCartItem(cartItemId) {
  const response = await fetch(buildApiUrl(`cart/item/${cartItemId}`), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка удаления товара");
  }

  return response.json();
}

export async function updateCartItemQuantity(cartItemId, quantity) {
  const response = await fetch(buildApiUrl(`cart/item/${cartItemId}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка обновления количества");
  }

  return response.json();
}

