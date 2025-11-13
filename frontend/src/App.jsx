import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import StudentLayout from './layouts/StudentLayout'
import TeacherLayout from './layouts/TeacherLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import ForgotPassword from './pages/public/ForgotPassword'
import ResetPassword from './pages/public/ResetPassword'

// Student Pages
import StudentDashboard from './pages/student/Dashboard'
import Dictionary from './pages/student/Dictionary'
import Activities from './pages/student/Activities'
import ActivityDetail from './pages/student/ActivityDetail'
import Quiz from './pages/student/Quiz'

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard'
import Groups from './pages/teacher/Groups'
import GroupDetail from './pages/teacher/GroupDetail'
import Reports from './pages/teacher/Reports'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import ContentManagement from './pages/admin/ContentManagement'
import Statistics from './pages/admin/Statistics'
import PendingUsers from './pages/admin/PendingUsers'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const { user, isAuthenticated } = useAuthStore()

  // Redirect authenticated users from public routes
  const PublicRoute = ({ children }) => {
    if (isAuthenticated) {
      switch (user?.role) {
        case 'estudiante':
          return <Navigate to="/student" replace />
        case 'docente':
          return <Navigate to="/teacher" replace />
        case 'administrador':
          return <Navigate to="/admin" replace />
        default:
          return <Navigate to="/" replace />
      }
    }
    return children
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={
          isAuthenticated ? (
            user?.role === 'estudiante' ? <Navigate to="/student" /> :
            user?.role === 'docente' ? <Navigate to="/teacher" /> :
            user?.role === 'administrador' ? <Navigate to="/admin" /> :
            <Navigate to="/login" />
          ) : <Navigate to="/login" />
        } />
        <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['estudiante']}>
          <StudentLayout />
        </ProtectedRoute>
      }>
        <Route index element={<StudentDashboard />} />
        <Route path="dictionary" element={<Dictionary />} />
        <Route path="activities" element={<Activities />} />
        <Route path="activities/:activityId" element={<ActivityDetail />} />
        <Route path="activities/:activityId/quiz" element={<Quiz />} />
      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher" element={
        <ProtectedRoute allowedRoles={['docente']}>
          <TeacherLayout />
        </ProtectedRoute>
      }>
        <Route index element={<TeacherDashboard />} />
        <Route path="groups" element={<Groups />} />
        <Route path="groups/:groupId" element={<GroupDetail />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['administrador']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="pending-users" element={<PendingUsers />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="statistics" element={<Statistics />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <p className="text-xl text-gray-600 mt-4">Página no encontrada</p>
            <a href="/" className="btn btn-primary mt-6 inline-block">
              Volver al inicio
            </a>
          </div>
        </div>
      } />
    </Routes>
  )
}

export default App

