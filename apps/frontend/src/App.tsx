import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { HomePage } from './pages/HomePage'
import { DashboardPage } from './pages/DashboardPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { ReportPage } from './pages/ReportPage'
import { ExtensionPage } from './pages/ExtensionPage'
import { useAuthStore } from './store/authStore'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useAuthStore()
  if (!isConnected) return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ className: 'bg-slate text-white border border-gray-700' }} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/extension" element={<ExtensionPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
