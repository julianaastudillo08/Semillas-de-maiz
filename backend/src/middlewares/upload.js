import multer from 'multer';
import path from 'path';
import { AppError } from './errorHandler.js';

// Configuración de almacenamiento temporal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/temp');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  // Tipos de archivo permitidos
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedAudioTypes = /mp3|wav|ogg|m4a/;
  
  const extname = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mimetype = file.mimetype;

  // Validar imágenes
  if (file.fieldname === 'image') {
    if (allowedImageTypes.test(extname) && mimetype.startsWith('image/')) {
      return cb(null, true);
    } else {
      return cb(new AppError('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)', 400));
    }
  }

  // Validar audios
  if (file.fieldname === 'audio') {
    if (allowedAudioTypes.test(extname) && mimetype.startsWith('audio/')) {
      return cb(null, true);
    } else {
      return cb(new AppError('Solo se permiten archivos de audio (mp3, wav, ogg, m4a)', 400));
    }
  }

  cb(null, true);
};

// Configuración de multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter
});

// Middleware para manejar errores de multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'El archivo es demasiado grande. Máximo 10MB' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Campo de archivo inesperado' });
    }
    return res.status(400).json({ message: 'Error al subir archivo' });
  }
  next(err);
};

// Middleware específico para subir archivos de audio
export const uploadAudioFile = upload.single('audio');

