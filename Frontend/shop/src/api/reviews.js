import { buildApiUrl } from '../config/api.js';

export async function createReview(reviewData) {
  const response = await fetch(buildApiUrl('reviews/'), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка создания отзыва");
  }

  return response.json();
}

export async function getProductReviews(productId) {
  const response = await fetch(buildApiUrl(`reviews/product/${productId}`), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка получения отзывов");
  }

  return response.json();
}

export async function getProductReviewStats(productId) {
  const response = await fetch(buildApiUrl(`reviews/product/${productId}/stats`), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка получения статистики отзывов");
  }

  return response.json();
}

export async function getUserReviewForProduct(userId, productId, orderItemId = null) {
  let url = buildApiUrl(`reviews/user/${userId}/product/${productId}`);
  if (orderItemId) {
    url += `?order_item_id=${orderItemId}`;
  }
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка получения отзыва");
  }

  const data = await response.json();
  return data; // Может быть null, если отзыв не найден
}

export async function getUserReviewForOrderItem(userId, orderItemId) {
  const response = await fetch(buildApiUrl(`reviews/user/${userId}/order-item/${orderItemId}`), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка получения отзыва");
  }

  const data = await response.json();
  return data; // Может быть null, если отзыв не найден
}

export async function updateReview(reviewId, reviewData) {
  const response = await fetch(buildApiUrl(`reviews/${reviewId}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка обновления отзыва");
  }

  return response.json();
}

export async function deleteReview(reviewId, userId) {
  const response = await fetch(buildApiUrl(`reviews/${reviewId}`), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка удаления отзыва");
  }

  return response.json();
}

