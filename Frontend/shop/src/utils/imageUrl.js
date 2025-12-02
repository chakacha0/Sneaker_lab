/**
 * Преобразует URL изображения в полный URL бэкенда
 * Если URL уже полный (начинается с http:// или https://), возвращает как есть
 * Если URL относительный, добавляет базовый URL бэкенда
 */
export function getImageUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  // Если URL уже полный, проверяем, правильный ли это backend URL
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // Если это неправильный URL (например, с портом 5500 или другим хостом), исправляем его
    if (imageUrl.includes('127.0.0.1:5500') || imageUrl.includes('localhost:5500') || imageUrl.includes('/backend/static/')) {
      // Извлекаем путь из неправильного URL
      const urlObj = new URL(imageUrl);
      let path = urlObj.pathname;
      
      // Убираем /backend если есть
      if (path.startsWith('/backend/')) {
        path = path.substring('/backend'.length);
      }
      
      // Формируем правильный URL
      const backendUrl = 'http://localhost:8000';
      return `${backendUrl}${path}`;
    }
    return imageUrl;
  }

  // Если URL относительный, добавляем базовый URL бэкенда
  const backendUrl = 'http://localhost:8000';
  
  // Нормализуем путь: заменяем обратные слэши на прямые (Windows -> Unix)
  let cleanUrl = imageUrl.trim().replace(/\\/g, '/');
  
  // Убираем ведущий /static/ если он есть (FastAPI сам добавляет /static/ при монтировании)
  if (cleanUrl.startsWith('/static/')) {
    cleanUrl = cleanUrl.substring(7); // Убираем '/static'
  } else if (cleanUrl.startsWith('static/')) {
    cleanUrl = cleanUrl.substring(6); // Убираем 'static'
  }
  
  // Убираем ведущий слэш, если он есть
  if (cleanUrl.startsWith('/')) {
    cleanUrl = cleanUrl.substring(1);
  }
  
  // Формируем финальный URL: /static/ + путь относительно static директории
  const fullUrl = `${backendUrl}/static/${cleanUrl}`;
  console.log(`[getImageUrl] Original: "${imageUrl}" -> Final: "${fullUrl}"`);
  
  return fullUrl;
}
