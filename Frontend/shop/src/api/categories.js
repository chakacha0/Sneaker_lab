export async function fetchCategories() {
  const response = await fetch("http://localhost:8002/categories/");
  return response.json();
}

export async function createCategory(categoryData) {
  const formData = new FormData();
  formData.append("name", categoryData.name);

  const response = await fetch("http://localhost:8002/categories/", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка при создании категории");
  }

  return response.json();
}

export async function updateCategory(categoryId, categoryData) {
  const formData = new FormData();
  formData.append("name", categoryData.name);

  const response = await fetch(`http://localhost:8002/categories/${categoryId}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка при обновлении категории");
  }

  return response.json();
}

export async function deleteCategory(categoryId) {
  const response = await fetch(`http://localhost:8002/categories/${categoryId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка при удалении категории");
  }

  return response.json();
}

export async function checkCategoryProducts(categoryId) {
  const response = await fetch(`http://localhost:8002/categories/${categoryId}/has-products`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка при проверке категории");
  }

  return response.json();
}
