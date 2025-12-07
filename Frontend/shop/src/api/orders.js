export async function createOrder(orderData) {
  const response = await fetch("http://localhost:8000/orders/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка создания заказа");
  }

  return response.json();
}

export async function getOrder(orderId) {
  const response = await fetch(`http://localhost:8000/orders/${orderId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка получения заказа");
  }

  return response.json();
}

export async function getUserOrders(userId) {
  const response = await fetch(`http://localhost:8000/orders/user/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка получения заказов");
  }

  return response.json();
}

export async function calculateOrderTotal(userId, promoCode = null) {
  const response = await fetch("http://localhost:8000/orders/calculate-total", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      promo_code: promoCode,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка расчета стоимости");
  }

  return response.json();
}
