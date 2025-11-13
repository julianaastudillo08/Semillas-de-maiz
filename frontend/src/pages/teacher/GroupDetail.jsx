import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiUserPlus, FiTrash2, FiSearch, FiDownload, FiFileText } from 'react-icons/fi'

const GroupDetail = () => {
  const { groupId } = useParams()
  const [group, setGroup] = useState(null)
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([])

  useEffect(() => {
    fetchGroupDetail()
  }, [groupId])

  const fetchGroupDetail = async () => {
    try {
      const response = await api.get(`/groups/${groupId}`)
      setGroup(response.data.group)
      setStudents(response.data.students)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar grupo')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    try {
      const response = await api.get(`/groups/students/search?query=${searchTerm}`)
      setSearchResults(response.data.students)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleAssign = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Debe seleccionar al menos un estudiante')
      return
    }

    try {
      await api.post(`/groups/${groupId}/students`, {
        student_ids: selectedStudents
      })
      toast.success('¡Asignación correcta!')
      setShowModal(false)
      setSelectedStudents([])
      setSearchTerm('')
      setSearchResults([])
      fetchGroupDetail()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleRemove = async (studentId) => {
    if (!window.confirm('¿Desea quitar este estudiante del grupo?')) return

    try {
      await api.delete(`/groups/${groupId}/students/${studentId}`)
      toast.success('Estudiante eliminado del grupo')
      fetchGroupDetail()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleExportExcel = async () => {
    try {
      toast.loading('Generando archivo Excel...')
      const response = await api.get(`/export/group/${groupId}/excel`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `reporte_${group.name}_${Date.now()}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.dismiss()
      toast.success('Archivo Excel generado correctamente')
    } catch (error) {
      toast.dismiss()
      console.error('Error:', error)
      toast.error('Error al generar archivo Excel')
    }
  }

  const handleExportPDF = async () => {
    try {
      toast.loading('Generando archivo PDF...')
      const response = await api.get(`/export/group/${groupId}/pdf`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `reporte_${group.name}_${Date.now()}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.dismiss()
      toast.success('Archivo PDF generado correctamente')
    } catch (error) {
      toast.dismiss()
      console.error('Error:', error)
      toast.error('Error al generar archivo PDF')
    }
  }

  const toggleStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }

  if (isLoading) {
    return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div>
  }

  return (
    <div className="animate-fadeIn">
      <Link to="/teacher/groups" className="flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <FiArrowLeft className="mr-2" />
        Volver a Grupos
      </Link>

      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{group?.name}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{group?.education_level} {group?.grade && `- ${group.grade}`}</span>
              <span className={`badge ${group?.difficulty_level === 'facil' ? 'badge-success' : group?.difficulty_level === 'intermedio' ? 'badge-warning' : 'badge-danger'}`}>
                {group?.difficulty_level}
              </span>
              <span>{students.length} estudiantes</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button onClick={handleExportExcel} className="btn btn-success flex items-center" title="Exportar a Excel">
              <FiDownload className="mr-2" />
              Excel
            </button>
            <button onClick={handleExportPDF} className="btn btn-danger flex items-center" title="Exportar a PDF">
              <FiFileText className="mr-2" />
              PDF
            </button>
            <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center">
              <FiUserPlus className="mr-2" />
              Asignar Estudiantes
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Estudiantes del Grupo</h2>
        {students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Promedio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actividades</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{student.full_name}</div></td>
                    <td className="px-6 py-4"><div className="text-sm text-gray-600">{student.email}</div></td>
                    <td className="px-6 py-4"><span className="badge badge-info">{student.average_score || 0}%</span></td>
                    <td className="px-6 py-4"><span className="text-sm text-gray-600">{student.total_activities_completed || 0}</span></td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleRemove(student.id)} className="text-red-600 hover:text-red-900">
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No hay estudiantes asignados a este grupo</p>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">Asignar Estudiantes</button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">Asignar Estudiantes al Grupo</h2>
            <div className="flex space-x-2 mb-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pl-10" placeholder="Buscar estudiante..." />
              </div>
              <button onClick={handleSearch} className="btn btn-primary">Buscar</button>
            </div>

            <div className="mb-4 max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((student) => (
                    <div key={student.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => toggleStudent(student.id)} className="mr-3" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{student.full_name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchTerm ? (
                <p className="text-gray-600 text-center py-8">No se encontraron estudiantes</p>
              ) : (
                <p className="text-gray-600 text-center py-8">Busca estudiantes por nombre</p>
              )}
            </div>

            <div className="flex space-x-3">
              <button onClick={handleAssign} disabled={selectedStudents.length === 0} className="btn btn-primary flex-1">
                Asignar al Grupo ({selectedStudents.length})
              </button>
              <button onClick={() => {setShowModal(false); setSelectedStudents([]); setSearchResults([])}} className="btn btn-secondary flex-1">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default GroupDetail

