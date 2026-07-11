import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#0b0b0b',
          color: '#39FF14',
          fontFamily: 'monospace',
          padding: 24
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, marginBottom: 10 }}>Checking session...</div>
          <div style={{ opacity: 0.8 }}>Please wait while we verify your login.</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}
