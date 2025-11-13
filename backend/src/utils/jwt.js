import jwt from 'jsonwebtoken';

/**
 * Genera un token JWT para un usuario
 * @param {Object} user - Información del usuario
 * @returns {string} Token JWT
 */
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

/**
 * Verifica un token JWT
 * @param {string} token - Token a verificar
 * @returns {Object} Payload decodificado
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

/**
 * Genera un token de verificación de email
 * @returns {string} Token aleatorio
 */
export const generateVerificationToken = () => {
  return jwt.sign({ random: Math.random() }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

/**
 * Genera un token para recuperación de contraseña
 * @returns {string} Token aleatorio
 */
export const generateResetPasswordToken = () => {
  return jwt.sign({ random: Math.random() }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

