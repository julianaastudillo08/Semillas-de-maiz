import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { FiUsers, FiBarChart2, FiTrendingUp } from 'react-icons/fi'

const TeacherDashboard = () => {
  const [stats, setStats] = useState(null)
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, groupsRes] = await Promise.all([
        api.get('/reports/teacher/statistics'),
        api.get('/groups')
      ])
      
      setStats(statsRes.data)
      setGroups(groupsRes.data.groups)
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

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Panel de Docente
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Grupos</p>
              <p className="text-4xl font-bold mt-2">{stats?.total_groups || 0}</p>
            </div>
            <FiUsers size={48} className="text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Estudiantes</p>
              <p className="text-4xl font-bold mt-2">{stats?.total_students || 0}</p>
            </div>
            <FiUsers size={48} className="text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Promedio General</p>
              <p className="text-4xl font-bold mt-2">{stats?.average_score || 0}%</p>
            </div>
            <FiTrendingUp size={48} className="text-purple-200" />
          </div>
        </div>
      </div>

      {/* Groups */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Mis Grupos</h2>
          <Link to="/teacher/groups" className="btn btn-primary">
            Ver Todos
          </Link>
        </div>

        {groups.length > 0 ? (
          <div className="space-y-4">
            {groups.slice(0, 5).map((group) => (
              <Link
                key={group.id}
                to={`/teacher/groups/${group.id}`}
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {group.education_level} - {group.grade}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">
                      {group.student_count} estudiantes
                    </p>
                    <span className="badge badge-info mt-1">
                      {group.difficulty_level}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No tienes grupos creados aún</p>
            <Link to="/teacher/groups" className="btn btn-primary">
              Crear Primer Grupo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherDashboard

