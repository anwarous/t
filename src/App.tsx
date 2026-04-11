import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useUserStore, useAuthStore } from '@/store'
import Layout from '@/components/layout/Layout'
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import CodeEditorPage from '@/pages/CodeEditor'
import VisualizationPage from '@/pages/Visualization'
import MentorPage from '@/pages/Mentor'
import LearnPage from '@/pages/Learn'
import { ToastProvider } from '@/components/ui/Toast'
import NotFound from '@/pages/NotFound'
import ProfilePage from '@/pages/Profile'
import SandboxPage from '@/pages/Sandbox'
import SignIn from '@/pages/SignIn'
import SignUp from '@/pages/SignUp'
import AdminPage from '@/pages/Admin'

// Apply theme class to <html> whenever the store's theme changes
function ThemeWatcher() {
  const theme = useUserStore(s => s.user.theme)
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
    }
  }, [theme])
  return null
}

// Redirect unauthenticated users to /signin
function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />
  }
  return <>{children}</>
}

// Redirect already-authenticated users away from signin/signup
function RedirectIfAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const authUser = useAuthStore(s => s.authUser)
  const isAdmin = authUser?.email === 'admin@admin.admin'
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
  }
  return <>{children}</>
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const authUser = useAuthStore(s => s.authUser)
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }
  if (authUser?.email !== 'admin@admin.admin') {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeWatcher />
      <ToastProvider />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<RedirectIfAuth><SignIn /></RedirectIfAuth>} />
          <Route path="/signup" element={<RedirectIfAuth><SignUp /></RedirectIfAuth>} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/editor" element={<RequireAuth><CodeEditorPage /></RequireAuth>} />
          <Route path="/visualize" element={<RequireAuth><VisualizationPage /></RequireAuth>} />
          <Route path="/mentor" element={<RequireAuth><MentorPage /></RequireAuth>} />
          <Route path="/learn" element={<RequireAuth><LearnPage /></RequireAuth>} />
          <Route path="/learn/:courseId" element={<RequireAuth><LearnPage /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="/sandbox" element={<RequireAuth><SandboxPage /></RequireAuth>} />
          <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
