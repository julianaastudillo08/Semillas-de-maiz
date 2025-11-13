import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { FiClock, FiFileText, FiPlay } from 'react-icons/fi'

const ActivityDetail = () => {
  const { activityId } = useParams()
  const navigate = useNavigate()
  const [activity, setActivity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchActivity()
  }, [activityId])

  const fetchActivity = async () => {
    try {
      const response = await api.get(`/activities/${activityId}`)
      setActivity(response.data.activity)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartActivity = async () => {
    try {
      const response = await api.post(`/activities/${activityId}/start`)
      navigate(`/student/activities/${activityId}/quiz`, {
        state: { attemptId: response.data.attempt.id, activity }
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Actividad no encontrada</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {activity.title}
        </h1>
        
        {activity.description && (
          <p className="text-gray-600 mb-6">{activity.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <FiFileText className="text-primary-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">Preguntas</p>
              <p className="font-semibold">{activity.questions?.length || 0}</p>
            </div>
          </div>
          
          {activity.time_limit && (
            <div className="flex items-center space-x-3">
              <FiClock className="text-primary-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Tiempo Límite</p>
                <p className="font-semibold">{Math.floor(activity.time_limit / 60)} minutos</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <div>
              <p className="text-sm text-gray-600">Nota mínima</p>
              <p className="font-semibold">{activity.passing_score}%</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleStartActivity}
          className="btn btn-primary w-full flex items-center justify-center text-lg"
        >
          <FiPlay className="mr-2" />
          Empezar Actividad
        </button>
      </div>
    </div>
  )
}

export default ActivityDetail

