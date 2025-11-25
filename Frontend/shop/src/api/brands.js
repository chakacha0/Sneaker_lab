export async function fetchBrands() {
    const response = await fetch("http://localhost:8000/brands/");
    return response.json();
}
