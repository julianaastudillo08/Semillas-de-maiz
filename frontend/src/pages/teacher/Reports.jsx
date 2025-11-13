import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FiDownload, FiUsers, FiTrendingUp, FiActivity, FiArrowLeft } from 'react-icons/fi'

const Reports = () => {
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [reportData, setReportData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups')
      setGroups(response.data.groups)
      if (response.data.groups.length > 0) {
        setSelectedGroup(response.data.groups[0].id)
        fetchReport(response.data.groups[0].id)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReport = async (groupId) => {
    try {
      const response = await api.get(`/reports/groups/${groupId}`)
      setReportData(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleGroupChange = (groupId) => {
    setSelectedGroup(groupId)
    fetchReport(groupId)
  }

  const exportReport = async (format) => {
    if (!selectedGroup) {
      toast.error('Por favor selecciona un grupo')
      return
    }

    const groupName = groups.find(g => g.id === selectedGroup)?.name || 'grupo'

    try {
      if (format === 'Excel') {
        toast.loading('Generando archivo Excel...')
        const response = await api.get(`/export/group/${selectedGroup}/excel`, {
          responseType: 'blob'
        })
        
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `reporte_${groupName}_${Date.now()}.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        toast.dismiss()
        toast.success('Archivo Excel generado correctamente')
      } else if (format === 'PDF') {
        toast.loading('Generando archivo PDF...')
        const response = await api.get(`/export/group/${selectedGroup}/pdf`, {
          responseType: 'blob'
        })
        
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `reporte_${groupName}_${Date.now()}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        toast.dismiss()
        toast.success('Archivo PDF generado correctamente')
      }
    } catch (error) {
      toast.dismiss()
      console.error('Error:', error)
      toast.error(`Error al generar archivo ${format}`)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div>
  }

  if (groups.length === 0) {
    return (
      <div className="card text-center py-12">
        <FiUsers size={64} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600">No existen grupos registrados</p>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <Link to="/teacher/groups" className="flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <FiArrowLeft className="mr-2" />
        Volver atrás a Grupos
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reportes de Grupos</h1>
        <div className="flex space-x-2">
          <button onClick={() => exportReport('PDF')} className="btn btn-secondary flex items-center">
            <FiDownload className="mr-2" />
            PDF
          </button>
          <button onClick={() => exportReport('Excel')} className="btn btn-secondary flex items-center">
            <FiDownload className="mr-2" />
            Excel
          </button>
        </div>
      </div>

      <div className="card mb-6">
        <label className="block text-sm font-medium mb-2">Seleccionar Grupo</label>
        <select value={selectedGroup} onChange={(e) => handleGroupChange(e.target.value)} className="input">
          {groups.map(group => (
            <option key={group.id} value={group.id}>{group.name} - {group.student_count} estudiantes</option>
          ))}
        </select>
      </div>

      {reportData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Estudiantes</p>
                  <p className="text-4xl font-bold mt-2">{reportData.statistics?.total_students || 0}</p>
                </div>
                <FiUsers size={48} className="text-blue-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Actividades Completadas</p>
                  <p className="text-4xl font-bold mt-2">{reportData.statistics?.completed_attempts || 0}</p>
                </div>
                <FiActivity size={48} className="text-green-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Promedio del Grupo</p>
                  <p className="text-4xl font-bold mt-2">{reportData.statistics?.average_score || 0}%</p>
                </div>
                <FiTrendingUp size={48} className="text-purple-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Total Intentos</p>
                  <p className="text-4xl font-bold mt-2">{reportData.statistics?.total_attempts || 0}</p>
                </div>
                <FiActivity size={48} className="text-orange-200" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Rendimiento por Estudiante</h2>
              {reportData.students_performance && reportData.students_performance.length > 0 ? (
                <div className="space-y-3">
                  {reportData.students_performance.slice(0, 10).map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{student.full_name}</p>
                        <p className="text-sm text-gray-600">{student.completed_attempts || 0} actividades</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${(student.average_score || 0) >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                          {student.average_score || 0}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-600">No hay datos disponibles</p>
              )}
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Actividades Más Realizadas</h2>
              {reportData.top_activities && reportData.top_activities.length > 0 ? (
                <div className="space-y-3">
                  {reportData.top_activities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="badge badge-info text-xs">{activity.type}</span>
                          <span className={`badge text-xs ${activity.difficulty_level === 'facil' ? 'badge-success' : activity.difficulty_level === 'intermedio' ? 'badge-warning' : 'badge-danger'}`}>
                            {activity.difficulty_level}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600">{activity.attempt_count}</p>
                        <p className="text-xs text-gray-600">{activity.average_score}% prom.</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-600">No hay datos disponibles</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
export default Reports

