import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import api from '../../services/api'
import { FiBook, FiFileText, FiAward, FiTrendingUp } from 'react-icons/fi'

const StudentDashboard = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [recentAttempts, setRecentAttempts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [attemptsRes] = await Promise.all([
        api.get('/activities/attempts/my-attempts?limit=5'),
      ])
      
      setRecentAttempts(attemptsRes.data.attempts || [])
      
      // Calcular estadísticas locales
      const attempts = attemptsRes.data.attempts || []
      const completedAttempts = attempts.filter(a => a.completed)
      const avgScore = completedAttempts.length > 0
        ? completedAttempts.reduce((sum, a) => sum + a.score, 0) / completedAttempts.length
        : 0

      setStats({
        total_activities: completedAttempts.length,
        average_score: avgScore.toFixed(1)
      })
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-fadeIn">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Bienvenido, {user?.full_name}! 👋
        </h1>
        <p className="text-gray-600">
          Continúa aprendiendo Nasa Yuwe
        </p>
      </div>

      {/* Stats Cards */}
      {!isLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Actividades Completadas</p>
                <p className="text-3xl font-bold mt-1">{stats.total_activities}</p>
              </div>
              <FiFileText size={40} className="text-blue-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Promedio</p>
                <p className="text-3xl font-bold mt-1">{stats.average_score}%</p>
              </div>
              <FiTrendingUp size={40} className="text-green-200" />
            </div>
          </div>

          <Link to="/student/dictionary" className="card hover:shadow-xl transition bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Diccionario</p>
                <p className="text-lg font-semibold mt-1">Explorar palabras</p>
              </div>
              <FiBook size={40} className="text-purple-200" />
            </div>
          </Link>

          <Link to="/student/activities" className="card hover:shadow-xl transition bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Actividades</p>
                <p className="text-lg font-semibold mt-1">Practicar</p>
              </div>
              <FiAward size={40} className="text-orange-200" />
            </div>
          </Link>
        </div>
      )}

      {/* Recent Attempts */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Actividades Recientes
        </h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando...</p>
          </div>
        ) : recentAttempts.length > 0 ? (
          <div className="space-y-4">
            {recentAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{attempt.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">
                      {attempt.type === 'quiz' ? 'Quiz' : 
                       attempt.type === 'completar_oracion' ? 'Completar Oración' : 
                       'Asociar Imágenes'}
                    </span>
                    <span className={`badge ${
                      attempt.difficulty_level === 'facil' ? 'badge-success' : 
                      attempt.difficulty_level === 'intermedio' ? 'badge-warning' : 
                      'badge-danger'
                    }`}>
                      {attempt.difficulty_level === 'facil' ? 'Fácil' : 
                       attempt.difficulty_level === 'intermedio' ? 'Intermedio' : 
                       'Avanzado'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    attempt.score >= 70 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {attempt.score}%
                  </p>
                  <p className="text-sm text-gray-600">
                    {attempt.correct_answers}/{attempt.total_questions} correctas
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiFileText size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">
              Aún no has completado ninguna actividad.
            </p>
            <Link to="/student/activities" className="btn btn-primary mt-4 inline-block">
              Comenzar a Practicar
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard

