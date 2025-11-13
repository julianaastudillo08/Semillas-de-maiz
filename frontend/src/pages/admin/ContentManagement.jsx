import { useEffect, useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi'

const ContentManagement = () => {
  const [words, setWords] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedWord, setSelectedWord] = useState(null)
  const [formData, setFormData] = useState({
    spanish_word: '',
    nasa_yuwe_word: '',
    pronunciation: '',
    example_spanish: '',
    example_nasa_yuwe: '',
    category_id: '',
    difficulty_level: 'facil'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [wordsRes, catsRes] = await Promise.all([
        api.get('/admin/words'),
        api.get('/dictionary/categories')
      ])
      setWords(wordsRes.data.words)
      setCategories(catsRes.data.categories)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar datos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setModalMode('create')
    setFormData({
      spanish_word: '',
      nasa_yuwe_word: '',
      pronunciation: '',
      example_spanish: '',
      example_nasa_yuwe: '',
      category_id: categories[0]?.id || '',
      difficulty_level: 'facil'
    })
    setShowModal(true)
  }

  const handleEdit = (word) => {
    setModalMode('edit')
    setSelectedWord(word)
    setFormData({
      spanish_word: word.spanish_word,
      nasa_yuwe_word: word.nasa_yuwe_word,
      pronunciation: word.pronunciation || '',
      example_spanish: word.example_spanish || '',
      example_nasa_yuwe: word.example_nasa_yuwe || '',
      category_id: word.category_id || '',
      difficulty_level: word.difficulty_level || 'facil'
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (modalMode === 'create') {
        await api.post('/admin/words', formData)
        toast.success('Palabra creada exitosamente')
      } else {
        await api.put(`/admin/words/${selectedWord.id}`, formData)
        toast.success('Palabra actualizada exitosamente')
      }
      
      setShowModal(false)
      fetchData()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (wordId) => {
    if (!window.confirm('¿Está seguro de eliminar esta palabra?')) return

    try {
      await api.delete(`/admin/words/${wordId}`)
      toast.success('Palabra eliminada exitosamente')
      fetchData()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId)
    return cat ? cat.name : 'Sin categoría'
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Contenido</h1>
        <button onClick={handleCreate} className="btn btn-primary flex items-center">
          <FiPlus className="mr-2" />
          Agregar Palabra
        </button>
      </div>

      {/* Words Table */}
      <div className="card overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Español</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nasa Yuwe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pronunciación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nivel</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {words.map((word) => (
              <tr key={word.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{word.spanish_word}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-primary-600 font-semibold">{word.nasa_yuwe_word}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 italic">{word.pronunciation || '-'}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="badge badge-info">{getCategoryName(word.category_id)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`badge ${
                    word.difficulty_level === 'facil' ? 'badge-success' :
                    word.difficulty_level === 'intermedio' ? 'badge-warning' :
                    'badge-danger'
                  }`}>
                    {word.difficulty_level}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(word)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(word.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {words.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No hay palabras registradas</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {modalMode === 'create' ? 'Agregar Palabra' : 'Editar Palabra'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Palabra en Español *</label>
                  <input
                    type="text"
                    value={formData.spanish_word}
                    onChange={(e) => setFormData({...formData, spanish_word: e.target.value})}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Palabra en Nasa Yuwe *</label>
                  <input
                    type="text"
                    value={formData.nasa_yuwe_word}
                    onChange={(e) => setFormData({...formData, nasa_yuwe_word: e.target.value})}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Pronunciación</label>
                <input
                  type="text"
                  value={formData.pronunciation}
                  onChange={(e) => setFormData({...formData, pronunciation: e.target.value})}
                  className="input"
                  placeholder="Ej: puus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ejemplo en Español</label>
                <textarea
                  value={formData.example_spanish}
                  onChange={(e) => setFormData({...formData, example_spanish: e.target.value})}
                  className="input"
                  rows="2"
                  placeholder="Ej: El perro es mi amigo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ejemplo en Nasa Yuwe</label>
                <textarea
                  value={formData.example_nasa_yuwe}
                  onChange={(e) => setFormData({...formData, example_nasa_yuwe: e.target.value})}
                  className="input"
                  rows="2"
                  placeholder="Ej: Pʉʉs nxi amiguwe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Categoría</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    className="input"
                  >
                    <option value="">Sin categoría</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nivel de Dificultad</label>
                  <select
                    value={formData.difficulty_level}
                    onChange={(e) => setFormData({...formData, difficulty_level: e.target.value})}
                    className="input"
                  >
                    <option value="facil">Fácil</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  {modalMode === 'create' ? 'Agregar' : 'Actualizar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

export default ContentManagement

