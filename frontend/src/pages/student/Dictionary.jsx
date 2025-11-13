import { useState, useEffect } from 'react'
import api from '../../services/api'
import { FiSearch, FiVolume2, FiBook } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { getImageUrl, handleImageError } from '../../utils/imageHelper'

const Dictionary = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryWords, setCategoryWords] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedWord, setSelectedWord] = useState(null)
  const [showNoResults, setShowNoResults] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/dictionary/categories')
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Error al cargar categorías:', error)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setShowNoResults(false)
    setSuggestions([])
    
    try {
      const response = await api.get(`/dictionary/search?query=${searchQuery}`)
      setSearchResults(response.data.words)
      
      if (response.data.words.length === 0) {
        setShowNoResults(true)
        toast.error('La palabra no se encuentra')
        if (response.data.suggestions && response.data.suggestions.length > 0) {
          setSuggestions(response.data.suggestions)
        }
      } else {
        setShowNoResults(false)
      }
    } catch (error) {
      console.error('Error en búsqueda:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = async (word) => {
    setSearchQuery(word.spanish_word || word.nasa_yuwe_word)
    const response = await api.get(`/dictionary/search?query=${word.spanish_word || word.nasa_yuwe_word}`)
    setSearchResults(response.data.words)
    setSuggestions([])
    setShowNoResults(false)
  }

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category)
    setIsLoading(true)
    
    try {
      const response = await api.get(`/dictionary/categories/${category.id}/words`)
      setCategoryWords(response.data.words)
    } catch (error) {
      console.error('Error al cargar palabras:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const WordCard = ({ word }) => (
    <div
      className="card hover:shadow-xl cursor-pointer transition-all"
      onClick={() => setSelectedWord(word)}
    >
      {/* Imagen de la palabra */}
      {word.image_url && (
        <div className="mb-4 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center" style={{ height: '200px' }}>
          <img
            src={getImageUrl(word.image_url)}
            alt={word.spanish_word}
            className="w-full h-full object-contain p-2"
            onError={handleImageError}
          />
        </div>
      )}
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{word.spanish_word}</h3>
          <p className="text-2xl font-semibold text-primary-600 mt-1">
            {word.nasa_yuwe_word}
          </p>
          {word.pronunciation && (
            <p className="text-sm text-gray-600 italic mt-1">
              /{word.pronunciation}/
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          {word.audio_url && (
            <button 
              className="p-2 hover:bg-blue-100 rounded-lg transition bg-blue-50"
              onClick={(e) => {
                e.stopPropagation();
                const audio = new Audio(`http://localhost:5000${word.audio_url}`);
                audio.play().catch(err => console.error('Error reproduciendo audio:', err));
              }}
              title="🇪🇸 Escuchar en Español"
            >
              <FiVolume2 size={20} className="text-blue-600" />
            </button>
          )}
          {word.audio_nasa_yuwe && (
            <button 
              className="p-2 hover:bg-green-100 rounded-lg transition bg-green-50"
              onClick={(e) => {
                e.stopPropagation();
                const audio = new Audio(`http://localhost:5000${word.audio_nasa_yuwe}`);
                audio.play().catch(err => console.error('Error reproduciendo audio:', err));
              }}
              title="🌽 Escuchar en Nasa Yuwe"
            >
              <FiVolume2 size={20} className="text-green-600" />
            </button>
          )}
        </div>
      </div>
      
      {word.example_spanish && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-700">{word.example_spanish}</p>
          <p className="text-sm text-primary-600 mt-1">{word.example_nasa_yuwe}</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        📖 Diccionario Nasa Yuwe
      </h1>

      {/* Search Bar */}
      <div className="card mb-6">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
              placeholder="Buscar palabra en español o Nasa Yuwe..."
            />
            <button type="submit" className="btn btn-primary absolute right-2 top-1/2 transform -translate-y-1/2">
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* No Results with Suggestions */}
      {showNoResults && (
        <div className="card mb-6 bg-yellow-50 border-2 border-yellow-200">
          <h3 className="font-bold text-gray-900 mb-2">La palabra no se encuentra</h3>
          {suggestions.length > 0 && (
            <>
              <p className="text-gray-700 mb-3">¿Quizás buscabas alguna de estas?</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 bg-white border border-yellow-300 rounded-lg hover:bg-yellow-100 transition text-sm font-medium"
                  >
                    {suggestion.spanish_word} → {suggestion.nasa_yuwe_word}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Resultados de búsqueda ({searchResults.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Explorar por Categorías
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`card text-center hover:shadow-xl transition ${
                selectedCategory?.id === category.id ? 'ring-2 ring-primary-600' : ''
              }`}
            >
              <div className="text-4xl mb-2">{category.icon_url}</div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {category.word_count} palabras
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Category Words */}
      {selectedCategory && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {selectedCategory.name}
          </h2>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : categoryWords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryWords.map((word) => (
                <WordCard key={word.id} word={word} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiBook size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No hay palabras en esta categoría</p>
            </div>
          )}
        </div>
      )}

      {/* Word Detail Modal */}
      {selectedWord && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedWord(null)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {selectedWord.spanish_word}
                </h2>
                <p className="text-4xl font-bold text-primary-600 mt-2">
                  {selectedWord.nasa_yuwe_word}
                </p>
                {selectedWord.pronunciation && (
                  <p className="text-lg text-gray-600 italic mt-2">
                    /{selectedWord.pronunciation}/
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedWord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedWord.image_url && (
              <div className="flex justify-center mb-6 bg-gray-50 rounded-lg p-4">
                <img
                  src={getImageUrl(selectedWord.image_url)}
                  alt={selectedWord.spanish_word}
                  className="max-w-full w-auto h-auto rounded-lg shadow-lg object-contain"
                  style={{ maxHeight: '350px' }}
                  onError={handleImageError}
                />
              </div>
            )}

            {selectedWord.example_spanish && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Ejemplo:</h3>
                <p className="text-gray-700 mb-2">{selectedWord.example_spanish}</p>
                <p className="text-primary-600">{selectedWord.example_nasa_yuwe}</p>
              </div>
            )}

            <div className="flex flex-col space-y-3 mt-6">
              {selectedWord.audio_url && (
                <button 
                  className="btn bg-blue-600 hover:bg-blue-700 text-white w-full flex items-center justify-center"
                  onClick={() => {
                    const audio = new Audio(`http://localhost:5000${selectedWord.audio_url}`);
                    audio.play().catch(err => {
                      console.error('Error reproduciendo audio:', err);
                      toast.error('Error al reproducir audio');
                    });
                  }}
                >
                  <FiVolume2 className="mr-2" />
                  🇪🇸 Escuchar en Español
                </button>
              )}
              
              {selectedWord.audio_nasa_yuwe && (
                <button 
                  className="btn bg-green-600 hover:bg-green-700 text-white w-full flex items-center justify-center"
                  onClick={() => {
                    const audio = new Audio(`http://localhost:5000${selectedWord.audio_nasa_yuwe}`);
                    audio.play().catch(err => {
                      console.error('Error reproduciendo audio:', err);
                      toast.error('Error al reproducir audio');
                    });
                  }}
                >
                  <FiVolume2 className="mr-2" />
                  🌽 Escuchar en Nasa Yuwe
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dictionary

