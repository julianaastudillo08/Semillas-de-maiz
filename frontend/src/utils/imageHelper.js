/**
 * Utilidad para manejar las URLs de imágenes desde el backend
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Obtiene la URL completa de una imagen desde el backend
 * @param {string} imagePath - Ruta de la imagen (ej: /images/perro.png)
 * @returns {string} - URL completa
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Si la ruta ya es completa, devuélvela tal cual
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Si la ruta comienza con /, agrégala directamente al backend URL
  if (imagePath.startsWith('/')) {
    return `${BACKEND_URL}${imagePath}`;
  }
  
  // Si no, agrégala con /images/ por defecto
  return `${BACKEND_URL}/images/${imagePath}`;
};

/**
 * Imagen por defecto cuando falla la carga
 */
export const FALLBACK_IMAGE = 'https://via.placeholder.com/300x300?text=Imagen+no+disponible';

/**
 * Maneja el error de carga de imagen
 * @param {Event} e - Evento de error
 */
export const handleImageError = (e) => {
  e.target.onerror = null; // Prevenir bucle infinito
  e.target.src = FALLBACK_IMAGE;
};

