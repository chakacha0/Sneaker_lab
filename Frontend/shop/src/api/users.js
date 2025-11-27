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
