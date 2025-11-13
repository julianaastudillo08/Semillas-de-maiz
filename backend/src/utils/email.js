import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configurar transporter de nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Envía un email de verificación
 * @param {string} email - Email del destinatario
 * @param {string} verificationToken - Token de verificación
 */
export const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: `"Semillas de Maíz" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verifica tu cuenta - Semillas de Maíz',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">¡Bienvenido a Semillas de Maíz!</h2>
        <p>Gracias por registrarte en nuestra plataforma educativa Nasa Yuwe.</p>
        <p>Por favor, verifica tu correo electrónico haciendo clic en el siguiente botón:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; background-color: #4F46E5; color: white; 
                  padding: 12px 24px; text-decoration: none; border-radius: 6px; 
                  margin: 20px 0;">
          Verificar Email
        </a>
        <p style="color: #666; font-size: 14px;">
          Si no solicitaste esta cuenta, puedes ignorar este email.
        </p>
        <p style="color: #666; font-size: 14px;">
          Este enlace expirará en 24 horas.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de verificación enviado a:', email);
  } catch (error) {
    console.error('Error al enviar email de verificación:', error);
    throw error;
  }
};

/**
 * Envía un email para recuperar contraseña
 * @param {string} email - Email del destinatario
 * @param {string} resetToken - Token de recuperación
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Semillas de Maíz" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Recuperar contraseña - Semillas de Maíz',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Recuperar Contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Tu código de recuperación es:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; 
                    border-radius: 6px; margin: 20px 0;">
          <h1 style="margin: 0; color: #1f2937; letter-spacing: 4px;">${resetToken}</h1>
        </div>
        <p>O haz clic en el siguiente botón para restablecer tu contraseña:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; background-color: #4F46E5; color: white; 
                  padding: 12px 24px; text-decoration: none; border-radius: 6px; 
                  margin: 20px 0;">
          Restablecer Contraseña
        </a>
        <p style="color: #666; font-size: 14px;">
          Si no solicitaste restablecer tu contraseña, puedes ignorar este email.
        </p>
        <p style="color: #666; font-size: 14px;">
          Este código expirará en 1 hora.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de recuperación enviado a:', email);
  } catch (error) {
    console.error('Error al enviar email de recuperación:', error);
    throw error;
  }
};

/**
 * Genera un código de 6 dígitos para recuperación de contraseña
 * @returns {string} Código de 6 dígitos
 */
export const generateRecoveryCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

