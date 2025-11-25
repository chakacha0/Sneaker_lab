export async function fetchProducts() {
  const response = await fetch("http://localhost:8000/products/");
  return response.json();
}
