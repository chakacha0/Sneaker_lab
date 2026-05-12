import { buildApiUrl } from '../config/api.js';

export async function createOrder(orderData) {
  const response = await fetch(buildApiUrl('orders/'), {
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
  const response = await fetch(buildApiUrl(`orders/${orderId}`), {
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
  const response = await fetch(buildApiUrl(`orders/user/${userId}`), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка получения заказов");
  }

  return response.json();
}

export async function fetchAdminOrders() {
  const response = await fetch(buildApiUrl('orders/admin/list'), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Could not load orders");
  }

  return response.json();
}

export async function updateOrderStatus(orderId, status) {
  const response = await fetch(
    buildApiUrl(`orders/admin/${orderId}/status`),
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Could not update status");
  }

  return response.json();
}

export async function calculateOrderTotal(userId, promoCode = null) {
  const response = await fetch(buildApiUrl('orders/calculate-total'), {
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
