import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { FiUsers, FiBook, FiFileText, FiActivity } from 'react-icons/fi'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/admin/statistics')
      setStats(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    )
  }

  const getUserCount = (role) => {
    const user = stats?.users?.find(u => u.role === role)
    return user ? parseInt(user.count) : 0
  }

  const getActiveCount = (role) => {
    const user = stats?.users?.find(u => u.role === role)
    return user ? parseInt(user.active_count) : 0
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Panel de Administración
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/admin/users" className="card hover:shadow-xl transition bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Estudiantes</p>
              <p className="text-4xl font-bold mt-2">{getUserCount('estudiante')}</p>
              <p className="text-blue-200 text-xs mt-1">{getActiveCount('estudiante')} activos</p>
            </div>
            <FiUsers size={48} className="text-blue-200" />
          </div>
        </Link>

        <Link to="/admin/users" className="card hover:shadow-xl transition bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Docentes</p>
              <p className="text-4xl font-bold mt-2">{getUserCount('docente')}</p>
              <p className="text-green-200 text-xs mt-1">{getActiveCount('docente')} activos</p>
            </div>
            <FiUsers size={48} className="text-green-200" />
          </div>
        </Link>

        <Link to="/admin/content" className="card hover:shadow-xl transition bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Palabras</p>
              <p className="text-4xl font-bold mt-2">{stats?.total_words || 0}</p>
              <p className="text-purple-200 text-xs mt-1">En diccionario</p>
            </div>
            <FiBook size={48} className="text-purple-200" />
          </div>
        </Link>

        <Link to="/admin/content" className="card hover:shadow-xl transition bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Actividades</p>
              <p className="text-4xl font-bold mt-2">{stats?.total_activities || 0}</p>
              <p className="text-orange-200 text-xs mt-1">Disponibles</p>
            </div>
            <FiFileText size={48} className="text-orange-200" />
          </div>
        </Link>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actividad del Sistema</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FiActivity className="text-blue-600" size={24} />
                <div>
                  <p className="font-semibold text-gray-900">Actividades Completadas</p>
                  <p className="text-sm text-gray-600">Total de intentos</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats?.total_attempts || 0}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FiActivity className="text-green-600" size={24} />
                <div>
                  <p className="font-semibold text-gray-900">Promedio General</p>
                  <p className="text-sm text-gray-600">Calificación promedio</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats?.average_score || 0}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actividad por Mes</h2>
          {stats?.activity_by_month && stats.activity_by_month.length > 0 ? (
            <div className="space-y-3">
              {stats.activity_by_month.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.month}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${Math.min((item.attempt_count / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-12 text-right">
                      {item.attempt_count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No hay datos de actividad registrados</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/users"
            className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <FiUsers className="text-primary-600" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Gestionar Usuarios</p>
              <p className="text-sm text-gray-600">Crear, editar y eliminar</p>
            </div>
          </Link>

          <Link
            to="/admin/content"
            className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <FiBook className="text-primary-600" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Gestionar Contenido</p>
              <p className="text-sm text-gray-600">Palabras y actividades</p>
            </div>
          </Link>

          <Link
            to="/admin/statistics"
            className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <FiActivity className="text-primary-600" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Ver Estadísticas</p>
              <p className="text-sm text-gray-600">Reportes detallados</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

