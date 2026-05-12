// API configuration
// Use relative paths for Docker container communication
// The nginx proxy will route these to the backend

export const API_BASE_URL = '/api';

// Helper function to build API URLs
export function buildApiUrl(path) {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
}
