import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Sube un archivo a Cloudinary
 * @param {string} filePath - Ruta del archivo
 * @param {string} folder - Carpeta destino en Cloudinary
 * @param {string} resourceType - Tipo de recurso (image, video, raw, auto)
 * @returns {Promise<object>} Resultado de la subida
 */
export const uploadFile = async (filePath, folder = 'nasa-yuwe', resourceType = 'auto') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type
    };
  } catch (error) {
    console.error('Error al subir archivo a Cloudinary:', error);
    throw error;
  }
};

/**
 * Elimina un archivo de Cloudinary
 * @param {string} publicId - ID público del archivo en Cloudinary
 * @param {string} resourceType - Tipo de recurso (image, video, raw)
 * @returns {Promise<object>} Resultado de la eliminación
 */
export const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Error al eliminar archivo de Cloudinary:', error);
    throw error;
  }
};

export default cloudinary;

