import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FiCheck, FiX, FiUser, FiClock, FiMail } from 'react-icons/fi'
import ConfirmModal from '../../components/ConfirmModal'

const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  const fetchPendingUsers = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/admin/users/pending')
      setPendingUsers(response.data.pending_users)
    } catch (error) {
      console.error('Error al cargar usuarios pendientes:', error)
      toast.error('Error al cargar usuarios pendientes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (userId, userName) => {
    if (!window.confirm(`¿Aprobar al usuario ${userName}?`)) {
      return
    }

    try {
      await api.patch(`/admin/users/${userId}/approve`)
      toast.success(`Usuario ${userName} aprobado exitosamente`)
      fetchPendingUsers()
    } catch (error) {
      console.error('Error al aprobar usuario:', error)
      toast.error('Error al aprobar usuario')
    }
  }

  const handleRejectClick = (user) => {
    setSelectedUser(user)
    setShowRejectModal(true)
    setRejectionReason('')
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Debes proporcionar una razón para el rechazo')
      return
    }

    try {
      await api.patch(`/admin/users/${selectedUser.id}/reject`, {
        reason: rejectionReason
      })
      toast.success(`Usuario ${selectedUser.full_name} rechazado`)
      setShowRejectModal(false)
      setSelectedUser(null)
      setRejectionReason('')
      fetchPendingUsers()
    } catch (error) {
      console.error('Error al rechazar usuario:', error)
      toast.error('Error al rechazar usuario')
    }
  }

  const getRoleBadgeColor = (role) => {
    const colors = {
      estudiante: 'bg-blue-100 text-blue-800',
      docente: 'bg-purple-100 text-purple-800',
      administrador: 'bg-red-100 text-red-800'
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  const getRoleIcon = (role) => {
    const icons = {
      estudiante: '👨‍🎓',
      docente: '👩‍🏫',
      administrador: '👨‍💼'
    }
    return icons[role] || '👤'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ⏳ Usuarios Pendientes de Aprobación
          </h1>
          <p className="text-gray-600 mt-2">
            Revisa y aprueba nuevos registros de estudiantes, docentes y administradores
          </p>
        </div>
        <div className="bg-yellow-100 border border-yellow-400 rounded-lg px-4 py-2">
          <span className="text-yellow-800 font-semibold">
            {pendingUsers.length} pendiente{pendingUsers.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="card text-center py-16">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FiCheck className="text-green-600" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Todo al día!
          </h2>
          <p className="text-gray-600">
            No hay usuarios pendientes de aprobación en este momento
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingUsers.map((user) => (
            <div key={user.id} className="card hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                    {getRoleIcon(user.role)}
                  </div>

                  {/* Info del usuario */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {user.full_name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <FiMail size={16} />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiClock size={16} />
                        <span>
                          Registrado: {new Date(user.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          user.email_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.email_verified ? '✅ Email verificado' : '⏳ Email pendiente'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => handleApprove(user.id, user.full_name)}
                    className="btn bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2 px-4 py-2"
                  >
                    <FiCheck size={18} />
                    <span>Aprobar</span>
                  </button>
                  <button
                    onClick={() => handleRejectClick(user)}
                    className="btn bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2 px-4 py-2"
                  >
                    <FiX size={18} />
                    <span>Rechazar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de rechazo */}
      {showRejectModal && selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowRejectModal(false)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Rechazar Usuario
            </h2>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                ¿Estás seguro de rechazar a <strong>{selectedUser.full_name}</strong>?
              </p>
              <p className="text-sm text-gray-600">
                Email: {selectedUser.email}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razón del rechazo *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="input min-h-[100px]"
                placeholder="Ejemplo: No pertenece a la comunidad educativa, información incorrecta, etc."
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                className="btn bg-red-600 hover:bg-red-700 text-white flex-1"
                disabled={!rejectionReason.trim()}
              >
                Rechazar Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PendingUsers

