import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { FiFileText, FiEdit3, FiImage } from 'react-icons/fi'

const Activities = () => {
  const [difficulty, setDifficulty] = useState('facil')
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchActivities()
  }, [difficulty])

  const fetchActivities = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/activities/difficulty/${difficulty}`)
      setActivities(response.data.activities)
    } catch (error) {
      console.error('Error al cargar actividades:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'quiz':
        return FiFileText
      case 'completar_oracion':
        return FiEdit3
      case 'asociar_imagen':
        return FiImage
      default:
        return FiFileText
    }
  }

  const getActivityTypeLabel = (type) => {
    switch (type) {
      case 'quiz':
        return 'Quiz Múltiple'
      case 'completar_oracion':
        return 'Completar Oración'
      case 'asociar_imagen':
        return 'Asociar Imágenes'
      default:
        return type
    }
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        ✏️ Actividades de Aprendizaje
      </h1>

      {/* Difficulty Selector */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Selecciona el nivel de dificultad
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setDifficulty('facil')}
            className={`btn ${
              difficulty === 'facil'
                ? 'bg-green-600 text-white'
                : 'btn-secondary'
            }`}
          >
            😊 Fácil
          </button>
          <button
            onClick={() => setDifficulty('intermedio')}
            className={`btn ${
              difficulty === 'intermedio'
                ? 'bg-yellow-600 text-white'
                : 'btn-secondary'
            }`}
          >
            🤔 Intermedio
          </button>
          <button
            onClick={() => setDifficulty('avanzado')}
            className={`btn ${
              difficulty === 'avanzado'
                ? 'bg-red-600 text-white'
                : 'btn-secondary'
            }`}
          >
            🔥 Avanzado
          </button>
        </div>
      </div>

      {/* Activities Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando actividades...</p>
        </div>
      ) : activities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type)
            return (
              <Link
                key={activity.id}
                to={`/student/activities/${activity.id}`}
                className="card hover:shadow-xl transition group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="text-primary-600" size={24} />
                      <span className="badge badge-info">
                        {getActivityTypeLabel(activity.type)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition">
                      {activity.title}
                    </h3>
                  </div>
                </div>

                {activity.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {activity.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{activity.question_count} preguntas</span>
                    {activity.time_limit && (
                      <span>{Math.floor(activity.time_limit / 60)} min</span>
                    )}
                  </div>
                  <span className={`badge ${
                    difficulty === 'facil' ? 'badge-success' :
                    difficulty === 'intermedio' ? 'badge-warning' :
                    'badge-danger'
                  }`}>
                    {difficulty === 'facil' ? 'Fácil' :
                     difficulty === 'intermedio' ? 'Intermedio' :
                     'Avanzado'}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 card">
          <FiFileText size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">
            No hay actividades disponibles para este nivel de dificultad.
          </p>
        </div>
      )}
    </div>
  )
}

export default Activities

