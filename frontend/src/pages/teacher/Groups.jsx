import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FiPlus, FiUsers } from 'react-icons/fi'

const Groups = () => {
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    education_level: 'primaria',
    grade: '',
    difficulty_level: 'facil'
  })

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups')
      setGroups(response.data.groups)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    
    // Validar nombre de grupo
    if (!formData.name || formData.name.trim() === '') {
      toast.error('Por favor diligenciar el nombre del grupo')
      return
    }
    
    try {
      await api.post('/groups', formData)
      toast.success('Grupo creado exitosamente')
      setShowCreateModal(false)
      setFormData({ name: '', education_level: 'primaria', grade: '', difficulty_level: 'facil' })
      fetchGroups()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mis Grupos</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          Crear Grupo
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Link
              key={group.id}
              to={`/teacher/groups/${group.id}`}
              className="card hover:shadow-xl transition"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FiUsers size={24} className="text-primary-600" />
                <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {group.education_level} - {group.grade}
                </p>
                <p className="text-sm text-gray-600">
                  {group.student_count} estudiantes
                </p>
                <span className={`badge ${
                  group.difficulty_level === 'facil' ? 'badge-success' :
                  group.difficulty_level === 'intermedio' ? 'badge-warning' :
                  'badge-danger'
                }`}>
                  {group.difficulty_level}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FiUsers size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 mb-4">No tienes grupos creados</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            Crear Primer Grupo
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Crear Nuevo Grupo</h2>
            
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre del Grupo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nivel Educativo</label>
                <select
                  value={formData.education_level}
                  onChange={(e) => setFormData({ ...formData, education_level: e.target.value, grade: '' })}
                  className="input"
                >
                  <option value="preescolar">Preescolar</option>
                  <option value="primaria">Primaria</option>
                </select>
              </div>

              {/* Campo Grado solo si selecciona Primaria */}
              {formData.education_level === 'primaria' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Grado</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="input"
                  >
                    <option value="">Seleccione grado</option>
                    <option value="Primero">Primero</option>
                    <option value="Segundo">Segundo</option>
                    <option value="Tercero">Tercero</option>
                    <option value="Cuarto">Cuarto</option>
                    <option value="Quinto">Quinto</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Dificultad</label>
                <select
                  value={formData.difficulty_level}
                  onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                  className="input"
                >
                  <option value="facil">Fácil</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="btn btn-primary flex-1">
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Groups

