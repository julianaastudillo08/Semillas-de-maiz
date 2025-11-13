import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FiMail, FiLoader, FiArrowLeft } from 'react-icons/fi'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.post('/auth/forgot-password', { email })
      setEmailSent(true)
      toast.success('Correo electrónico enviado')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🌽 Semillas de Maíz
          </h1>
          <p className="text-lg text-gray-600">
            Recuperar Contraseña
          </p>
        </div>

        <div className="card">
          {!emailSent ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Olvidaste tu contraseña?
              </h2>
              <p className="text-gray-600 mb-6">
                Ingresa tu correo electrónico y te enviaremos un código para
                restablecer tu contraseña.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-10"
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Código'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¡Correo Enviado!
              </h3>
              <p className="text-gray-600 mb-6">
                Hemos enviado un código de recuperación a tu correo
                electrónico. Por favor revisa tu bandeja de entrada.
              </p>
              <Link
                to="/reset-password"
                className="btn btn-primary w-full inline-block"
              >
                Ir a Restablecer Contraseña
              </Link>
            </div>
          )}

          <Link
            to="/login"
            className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-900 mt-6"
          >
            <FiArrowLeft />
            <span>Volver a iniciar sesión</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

