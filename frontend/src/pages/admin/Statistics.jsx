import { useEffect, useState } from 'react'
import api from '../../services/api'
import { FiUsers, FiActivity, FiTrendingUp, FiDownload } from 'react-icons/fi'

const Statistics = () => {
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
    return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div>
  }

  if (!stats) {
    return <div className="card text-center py-12"><p className="text-gray-600">No existen estadísticas disponibles</p></div>
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Estadísticas Generales</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div><p className="text-blue-100 text-sm">Total Usuarios</p><p className="text-4xl font-bold mt-2">{stats.users?.reduce((sum, u) => sum + parseInt(u.count), 0) || 0}</p></div>
            <FiUsers size={48} className="text-blue-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div><p className="text-purple-100 text-sm">Palabras</p><p className="text-4xl font-bold mt-2">{stats.total_words}</p></div>
            <FiActivity size={48} className="text-purple-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div><p className="text-green-100 text-sm">Actividades</p><p className="text-4xl font-bold mt-2">{stats.total_attempts}</p></div>
            <FiTrendingUp size={48} className="text-green-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div><p className="text-orange-100 text-sm">Promedio</p><p className="text-4xl font-bold mt-2">{stats.average_score}%</p></div>
            <FiTrendingUp size={48} className="text-orange-200" />
          </div>
        </div>
      </div>
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Usuarios por Rol</h2>
        <div className="space-y-4">
          {stats.users?.map((user, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 capitalize">{user.role} ({user.active_count} activos)</span>
                <span className="text-lg font-bold text-gray-900">{user.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className={`h-3 rounded-full ${user.role === 'estudiante' ? 'bg-blue-600' : user.role === 'docente' ? 'bg-green-600' : 'bg-purple-600'}`} style={{width: `${(parseInt(user.count) / stats.users.reduce((sum, u) => sum + parseInt(u.count), 0)) * 100}%`}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default Statistics

