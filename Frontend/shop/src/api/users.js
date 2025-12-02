export async function registerUser(userData) {
  const response = await fetch("http://localhost:8000/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка регистрации");
  }

  return response.json();
}

export async function verifyEmail(data) {
  const response = await fetch(`http://localhost:8000/users/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка подтверждения email");
  }

  return response.json();
}

export async function loginUser(credentials) {
  const response = await fetch("http://localhost:8000/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка входа");
  }

  return response.json();
}