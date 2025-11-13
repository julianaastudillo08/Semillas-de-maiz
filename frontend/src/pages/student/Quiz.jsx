import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FiClock, FiCheck, FiX } from 'react-icons/fi'
import { getImageUrl, handleImageError } from '../../utils/imageHelper'

const Quiz = () => {
  const { activityId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { attemptId, activity } = location.state || {}

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(activity?.time_limit || 300)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const questions = activity?.questions || []
  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    if (!attemptId || !activity) {
      navigate(`/student/activities/${activityId}`)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          toast.error('¡Tiempo agotado! Las respuestas se enviarán automáticamente.')
          setTimeout(() => handleSubmit(true), 1000)
          return 0
        }
        if (prev === 30) {
          toast('⏰ Quedan 30 segundos', { icon: '⚠️' })
        }
        if (prev === 60) {
          toast('⏰ Queda 1 minuto', { icon: '⚠️' })
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAnswerSelect = (optionId) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionId
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async (autoSubmit = false) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, optionId]) => ({
        question_id: questionId,
        selected_option_id: optionId
      }))

      const response = await api.post(`/activities/attempts/${attemptId}/submit`, {
        answers: formattedAnswers,
        time_taken: activity.time_limit - timeLeft
      })

      setResult(response.data)
      
      if (!autoSubmit) {
        toast.success('¡Actividad completada!')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al enviar respuestas')
      setIsSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="max-w-4xl mx-auto animate-fadeIn">
        <div className="card text-center">
          {/* Success/Fail Icon */}
          <div className="mb-6">
            {result.score >= 70 ? (
              <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FiCheck className="text-green-600" size={48} />
              </div>
            ) : (
              <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FiX className="text-red-600" size={48} />
              </div>
            )}
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {result.score >= 70 ? '¡Excelente Trabajo!' : '¡Sigue Practicando!'}
            </h2>
            <p className="text-gray-600">
              {result.score >= 70 ? 'Has aprobado esta actividad' : 'Necesitas más práctica'}
            </p>
          </div>
          
          <div className="mb-8">
            <div className="text-7xl font-bold mb-2" style={{
              color: result.score >= 70 ? '#10B981' : '#EF4444'
            }}>
              {result.score}%
            </div>
            <p className="text-xl text-gray-600">
              {result.correct_answers} de {result.total_questions} correctas
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Tiempo: {Math.floor(result.time_taken / 60)}:{(result.time_taken % 60).toString().padStart(2, '0')}
            </p>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4 text-left">Revisión de Respuestas:</h3>
            <div className="space-y-3 text-left max-h-96 overflow-y-auto">
              {result.answers?.map((answer, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  answer.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      answer.is_correct ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {answer.is_correct ? (
                        <FiCheck className="text-white" size={18} />
                      ) : (
                        <FiX className="text-white" size={18} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">
                        Pregunta {index + 1}: {answer.question_text}
                      </p>
                      {!answer.is_correct && (
                        <>
                          {answer.selected_option_text && (
                            <p className="text-sm text-red-700 mb-1">
                              ❌ Tu respuesta: {answer.selected_option_text}
                            </p>
                          )}
                          <p className="text-sm text-green-700">
                            ✅ Respuesta correcta: {answer.correct_answer}
                          </p>
                        </>
                      )}
                      {answer.is_correct && (
                        <p className="text-sm text-green-700">
                          ✅ ¡Correcto! {answer.correct_answer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/student/activities')}
              className="btn btn-primary flex-1"
            >
              Actividades de Aprendizaje
            </button>
            <button
              onClick={() => navigate('/student')}
              className="btn btn-secondary flex-1"
            >
              Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div>
            <p className="text-sm text-gray-600">
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-lg font-semibold">
            <FiClock />
            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.question_text}
            </h3>

            {/* Image if exists */}
            {currentQuestion.image_url && (
              <div className="flex justify-center mb-6">
                <img 
                  src={getImageUrl(currentQuestion.image_url)}
                  alt={currentQuestion.question_text}
                  className="max-w-md w-full h-auto rounded-xl shadow-lg object-contain"
                  style={{ maxHeight: '300px' }}
                  onError={handleImageError}
                />
              </div>
            )}

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition ${
                    answers[currentQuestion.id] === option.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion.id] === option.id
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion.id] === option.id && (
                        <FiCheck className="text-white" size={16} />
                      )}
                    </div>
                    <span className="font-medium">{option.option_label}.</span>
                    <span>{option.option_text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="btn btn-secondary"
              >
                Anterior
              </button>
              
              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Enviando...' : 'Finalizar'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="btn btn-primary"
                >
                  Siguiente
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Quiz

