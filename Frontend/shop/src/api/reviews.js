export async function createReview(reviewData) {
  const response = await fetch("http://localhost:8000/reviews/", {
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
  const response = await fetch(`http://localhost:8000/reviews/product/${productId}`, {
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
  const response = await fetch(`http://localhost:8000/reviews/product/${productId}/stats`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка получения статистики отзывов");
  }

  return response.json();
}

export async function getUserReviewForProduct(userId, productId) {
  const response = await fetch(`http://localhost:8000/reviews/user/${userId}/product/${productId}`, {
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
  const response = await fetch(`http://localhost:8000/reviews/${reviewId}`, {
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
  const response = await fetch(`http://localhost:8000/reviews/${reviewId}`, {
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

