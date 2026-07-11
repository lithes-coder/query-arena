import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './GlobalTheme.css'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import OAuthCallbackPage from './pages/OAuthCallbackPage.jsx'
import ChallengePage from './pages/ChallengePage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import DebugArena from './DebugArena.jsx'
import WordConnector from './WordConnector.jsx'
import CyberQuest from './CyberQuest.jsx'
import CompleteProfile from './pages/CompleteProfile.jsx'

function DebugArenaPage() {
  const navigate = useNavigate()
  return <DebugArena onBack={() => navigate('/')} />
}

function WordConnectorPage() {
  const navigate = useNavigate()
  return <WordConnector onBack={() => navigate('/')} />
}

function CyberQuestPage() {
  const navigate = useNavigate()
  return <CyberQuest onBack={() => navigate('/')} />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/challenge/:id" element={<ProtectedRoute><ChallengePage /></ProtectedRoute>} />
          <Route path="/debug-arena" element={<ProtectedRoute><DebugArenaPage /></ProtectedRoute>} />
          <Route path="/word-connector" element={<ProtectedRoute><WordConnectorPage /></ProtectedRoute>} />
          <Route path="/cyber-quest" element={<ProtectedRoute><CyberQuestPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
