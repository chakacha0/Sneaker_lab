export async function fetchPromoCodes() {
  const response = await fetch("http://localhost:8000/promo-codes/");
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка получения промокодов");
  }
  return response.json();
}

export async function createPromoCode(promoCodeData) {
  const response = await fetch("http://localhost:8000/promo-codes/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(promoCodeData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка создания промокода");
  }
  
  return response.json();
}

export async function updatePromoCode(promoId, promoCodeData) {
  const response = await fetch(`http://localhost:8000/promo-codes/${promoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(promoCodeData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка обновления промокода");
  }
  
  return response.json();
}

export async function deletePromoCode(promoId) {
  const response = await fetch(`http://localhost:8000/promo-codes/${promoId}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка удаления промокода");
  }
  
  return response.json();
}
