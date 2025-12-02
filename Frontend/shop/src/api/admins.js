export async function fetchAdmins() {
  const response = await fetch("http://localhost:8000/admins/");
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка при получении списка администраторов");
  }
  return response.json();
}

export async function searchUsersByEmail(emailQuery) {
  const response = await fetch(`http://localhost:8000/admins/search-users?email_query=${encodeURIComponent(emailQuery)}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка при поиске пользователей");
  }
  return response.json();
}

export async function promoteToAdmin(userId) {
  const response = await fetch(`http://localhost:8000/admins/promote/${userId}`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка при назначении администратором");
  }

  return response.json();
}

export async function removeAdminRole(userId) {
  const response = await fetch(`http://localhost:8000/admins/remove/${userId}`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка при отзыве прав администратора");
  }

  return response.json();
}
