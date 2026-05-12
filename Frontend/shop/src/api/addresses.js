import { buildApiUrl } from '../config/api.js';

export async function createAddress(addressData) {
  const response = await fetch(buildApiUrl('addresses/'), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(addressData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка создания адреса");
  }

  return response.json();
}

export async function getUserAddresses(userId) {
  const response = await fetch(buildApiUrl(`addresses/user/${userId}`), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка получения адресов");
  }

  return response.json();
}

export async function getAddress(addressId) {
  const response = await fetch(buildApiUrl(`addresses/${addressId}`), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка получения адреса");
  }

  return response.json();
}
