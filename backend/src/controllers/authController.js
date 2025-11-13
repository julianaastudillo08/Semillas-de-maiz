import bcrypt from 'bcrypt';
import { body } from 'express-validator';
import pool from '../config/database.js';
import { generateToken, generateVerificationToken, generateResetPasswordToken } from '../utils/jwt.js';
import { sendVerificationEmail, sendPasswordResetEmail, generateRecoveryCode } from '../utils/email.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Validaciones para registro
 */
export const registerValidation = [
  body('full_name').trim().notEmpty().withMessage('El nombre completo es requerido'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('confirm_password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Las contraseñas no coinciden');
    }
    return true;
  }),
  body('role').optional().isIn(['estudiante', 'docente']).withMessage('Rol inválido')
];

/**
 * Registro de usuario
 */
export const register = async (req, res, next) => {
  try {
    const { full_name, email, password, role = 'estudiante' } = req.body;

    // Verificar si el email ya existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new AppError('El correo electrónico ya está registrado', 400);
    }

    // Hashear contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // Generar token de verificación
    const verificationToken = generateVerificationToken();

    // Insertar usuario (pendiente de aprobación)
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, verification_token, is_approved)
       VALUES ($1, $2, $3, $4, $5, false)
       RETURNING id, full_name, email, role, is_active, email_verified, is_approved, created_at`,
      [full_name, email, password_hash, role, verificationToken]
    );

    const user = result.rows[0];

    // Enviar email de verificación (no bloqueante)
    sendVerificationEmail(email, verificationToken).catch(err => 
      console.error('Error al enviar email de verificación:', err)
    );

    res.status(201).json({
      message: 'Registro exitoso. Tu cuenta está pendiente de aprobación por un administrador. Se ha enviado un email de verificación.',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        is_approved: user.is_approved
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Validaciones para login
 */
export const loginValidation = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es requerida')
];

/**
 * Inicio de sesión
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new AppError('El correo electrónico no se encuentra registrado', 401);
    }

    const user = result.rows[0];

    // Verificar si la cuenta está aprobada
    if (!user.is_approved && user.role !== 'administrador') {
      if (user.rejection_reason) {
        throw new AppError(`Tu cuenta fue rechazada. Razón: ${user.rejection_reason}`, 401);
      } else {
        throw new AppError('Tu cuenta está pendiente de aprobación por un administrador.', 401);
      }
    }

    // Verificar si la cuenta está activa
    if (!user.is_active) {
      throw new AppError('La cuenta está inactiva. Contacte al administrador.', 401);
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      throw new AppError('La contraseña es inválida', 401);
    }

    // Generar token
    const token = generateToken(user);

    // Actualizar último inicio de sesión
    await pool.query(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        email_verified: user.email_verified
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Solicitar recuperación de contraseña
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Buscar usuario
    const result = await pool.query(
      'SELECT id, email, full_name FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new AppError('Correo electrónico inválido', 404);
    }

    const user = result.rows[0];

    // Generar código de recuperación
    const recoveryCode = generateRecoveryCode();
    const resetToken = generateResetPasswordToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Guardar token en la base de datos
    await pool.query(
      `UPDATE users 
       SET reset_password_token = $1, reset_password_expires = $2
       WHERE id = $3`,
      [recoveryCode, expiresAt, user.id]
    );

    // Enviar email con código
    await sendPasswordResetEmail(user.email, recoveryCode);

    res.json({
      message: 'Correo electrónico enviado con el código de recuperación'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verificar código de recuperación
 */
export const verifyResetCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const result = await pool.query(
      `SELECT id FROM users 
       WHERE email = $1 
       AND reset_password_token = $2 
       AND reset_password_expires > NOW()`,
      [email, code]
    );

    if (result.rows.length === 0) {
      throw new AppError('Código inválido o expirado', 400);
    }

    res.json({
      message: 'Código válido',
      valid: true
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Restablecer contraseña
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, new_password, confirm_password } = req.body;

    // Validar que las contraseñas coincidan
    if (new_password !== confirm_password) {
      throw new AppError('Las contraseñas no coinciden', 400);
    }

    // Buscar usuario con código válido
    const result = await pool.query(
      `SELECT id FROM users 
       WHERE email = $1 
       AND reset_password_token = $2 
       AND reset_password_expires > NOW()`,
      [email, code]
    );

    if (result.rows.length === 0) {
      throw new AppError('Código inválido o expirado', 400);
    }

    const user = result.rows[0];

    // Hashear nueva contraseña
    const password_hash = await bcrypt.hash(new_password, 10);

    // Actualizar contraseña y limpiar token
    await pool.query(
      `UPDATE users 
       SET password_hash = $1, 
           reset_password_token = NULL, 
           reset_password_expires = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [password_hash, user.id]
    );

    res.json({
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verificar email
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    const result = await pool.query(
      `UPDATE users 
       SET email_verified = true, verification_token = NULL
       WHERE verification_token = $1
       RETURNING id, email`,
      [token]
    );

    if (result.rows.length === 0) {
      throw new AppError('Token de verificación inválido', 400);
    }

    res.json({
      message: 'Email verificado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
export const getProfile = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, role, is_active, email_verified, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

