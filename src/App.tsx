import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useUserStore } from '@/store'
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

export default function App() {
  return (
    <BrowserRouter>
      <ThemeWatcher />
      <ToastProvider />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor" element={<CodeEditorPage />} />
          <Route path="/visualize" element={<VisualizationPage />} />
          <Route path="/mentor" element={<MentorPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/learn/:courseId" element={<LearnPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/sandbox" element={<SandboxPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
