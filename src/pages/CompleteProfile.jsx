import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase.js'

export default function CompleteProfile() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState({ type: '', message: '' })
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        navigate('/login', { replace: true })
        return
      }
      
      if (data.user.user_metadata?.full_name) {
        navigate('/', { replace: true })
        return
      }
      
      setUser(data.user)
    }
    checkUser()
  }, [navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    
    if (!fullName.trim()) {
      setToast({ type: 'error', message: 'Please enter your full name.' })
      return
    }

    if (fullName.trim().length < 2) {
      setToast({ type: 'error', message: 'Name must be at least 2 characters.' })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName.trim(),
          onboarding_completed: true
        }
      })

      if (error) {
        setToast({ type: 'error', message: error.message })
        return
      }

      setTimeout(() => {
        navigate('/', { replace: true })
      }, 800)
    } catch (error) {
      setToast({ type: 'error', message: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  if (!user) {
    return (
      <div
        className="ambient-shell"
        style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}
      >
        <div className="smoke-layer" />
        <div style={{ color: '#39FF14', fontFamily: 'monospace' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div
      className="ambient-shell"
      style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}
      onMouseMove={(event) => {
        const shell = event.currentTarget
        const rect = shell.getBoundingClientRect()
        shell.style.setProperty('--cursor-x', `${event.clientX - rect.left}px`)
        shell.style.setProperty('--cursor-y', `${event.clientY - rect.top}px`)
      }}
    >
      <div className="smoke-layer" />
      
      <div
        style={{
          width: 'min(480px, 100%)',
          padding: '40px 36px',
          borderRadius: 28,
          background: 'rgba(8, 8, 10, 0.96)',
          border: '1px solid rgba(57, 255, 20, 0.22)',
          boxShadow: '0 0 45px rgba(57, 255, 20, 0.12)',
          fontFamily: 'monospace',
          color: '#eee',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(57, 255, 20, 0.1)',
            border: '2px solid #39FF14',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 24px'
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 style={{ margin: '0 0 12px', color: '#39FF14', fontSize: 28 }}>
          Welcome!
        </h1>
        
        <p style={{ margin: '0 0 8px', color: '#ccc', fontSize: 15 }}>
          Your account has been verified.
        </p>
        <p style={{ margin: '0 0 32px', color: '#888', fontSize: 14 }}>
          Just one more step to complete your profile.
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: 8, color: '#99ff90', fontSize: 14 }}>
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            style={{
              width: '100%',
              padding: '18px 20px',
              borderRadius: 14,
              border: '1px solid rgba(57,255,20,0.25)',
              background: '#0b0b0b',
              color: '#f1f1f1',
              fontFamily: 'monospace',
              outline: 'none',
              fontSize: 17
            }}
            placeholder="Enter your full name"
            autoFocus
            disabled={isLoading}
          />
          <p style={{ margin: '8px 0 0', color: '#666', fontSize: 12 }}>
            This will be displayed on your profile and leaderboards.
          </p>

          <button
            type="submit"
            disabled={isLoading || !fullName.trim()}
            style={{
              width: '100%',
              padding: '18px 0',
              borderRadius: 14,
              border: 'none',
              background: isLoading || !fullName.trim() ? '#333' : '#39FF14',
              color: '#050505',
              fontWeight: 700,
              fontSize: 16,
              cursor: isLoading || !fullName.trim() ? 'not-allowed' : 'pointer',
              marginTop: 28,
              fontFamily: 'monospace'
            }}
          >
            {isLoading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleSignOut}
          style={{
            marginTop: 20,
            padding: '10px 20px',
            background: 'transparent',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            fontSize: 13,
            fontFamily: 'monospace'
          }}
        >
          Not you? Sign out
        </button>
      </div>

      {toast.message && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 24px',
          borderRadius: 8,
          background: toast.type === 'error' ? '#ef4444' : '#22c55e',
          color: 'white',
          fontFamily: 'monospace',
          zIndex: 9999
        }}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
