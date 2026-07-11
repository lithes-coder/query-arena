import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase.js'

export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Wait for Supabase to process the OAuth callback
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError(sessionError.message)
          setTimeout(() => navigate('/login'), 2000)
          return
        }

        if (session) {
          // Check if new user
          const isNewUser = !session.user?.user_metadata?.full_name
          
          if (isNewUser) {
            navigate('/complete-profile', { replace: true })
          } else {
            navigate('/', { replace: true })
          }
        } else {
          // No session, redirect to login
          navigate('/login', { replace: true })
        }
      } catch (err) {
        console.error('Callback error:', err)
        setError('Authentication failed')
        setTimeout(() => navigate('/login'), 2000)
      }
    }

    // Small delay to ensure Supabase has processed the callback
    const timer = setTimeout(handleCallback, 500)
    return () => clearTimeout(timer)
  }, [navigate])

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b0b0b',
        color: '#ef4444',
        fontFamily: 'monospace'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, marginBottom: 10 }}>⚠️ Error</div>
          <div>{error}</div>
          <div style={{ marginTop: 20, color: '#666', fontSize: 14 }}>Redirecting to login...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0b0b0b',
      color: '#39FF14',
      fontFamily: 'monospace'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>QUERY ARENA</div>
        <div style={{ color: '#ccc' }}>Completing sign in...</div>
        <div style={{ 
          marginTop: 20, 
          width: 40, 
          height: 40, 
          border: '3px solid rgba(57,255,20,0.3)',
          borderTop: '3px solid #39FF14',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '20px auto'
        }} />
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
