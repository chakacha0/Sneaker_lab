import { buildApiUrl } from '../config/api.js';

export async function fetchBrands() {
    const response = await fetch(buildApiUrl('brands/'));
    return response.json();
}

export async function createBrand(brandData) {
  const formData = new FormData();
  
  formData.append("name", brandData.name);
  if (brandData.description) {
    formData.append("description", brandData.description);
  }
  if (brandData.country) {
    formData.append("country", brandData.country);
  }
  if (brandData.image) {
    formData.append("image", brandData.image);
  }
  
  const response = await fetch(buildApiUrl('brands/'), {
    method: "POST",
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка создания бренда");
  }
  
  return response.json();
}

export async function updateBrand(brandId, brandData) {
  const formData = new FormData();
  
  if (brandData.name) {
    formData.append("name", brandData.name);
  }
  if (brandData.description !== undefined) {
    formData.append("description", brandData.description || "");
  }
  if (brandData.country !== undefined) {
    formData.append("country", brandData.country || "");
  }
  if (brandData.image) {
    formData.append("image", brandData.image);
  }
  
  const response = await fetch(buildApiUrl(`brands/${brandId}`), {
    method: "PUT",
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка обновления бренда");
  }
  
  return response.json();
}

export async function deleteBrand(brandId) {
  const response = await fetch(buildApiUrl(`brands/${brandId}`), {
    method: "DELETE",
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Ошибка удаления бренда");
  }
  
  return response.json();
}
