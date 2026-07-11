import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase.js'

export default function LogoutDialog({ onCancel }) {
  const navigate = useNavigate()

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onCancel])

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    window.localStorage.removeItem('query-arena-xp')
    window.localStorage.removeItem('qa-theme-color')
    window.localStorage.removeItem('qa-sound-effects')
    window.localStorage.removeItem('qa-animations')

    if (!error) {
      navigate('/login', { replace: true })
      window.history.replaceState({}, '', '/login')
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 2000,
        fontFamily: 'monospace'
      }}
      onClick={onCancel}
    >
      <div
        style={{
          width: 'min(440px, 92vw)',
          padding: 28,
          borderRadius: 24,
          background: '#0b0b0b',
          border: '1px solid rgba(57, 255, 20, 0.28)',
          boxShadow: '0 0 40px rgba(57, 255, 20, 0.16)'
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 style={{ margin: 0, color: '#39FF14', fontSize: 26 }}>Logout?</h2>
        <p style={{ marginTop: 14, lineHeight: 1.7, color: '#ddd' }}>
          Are you sure you want to logout from Query Arena?
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <button
            onClick={onCancel}
            style={{
              padding: '12px 18px',
              background: '#111',
              color: '#39FF14',
              border: '1px solid rgba(57, 255, 20, 0.24)',
              borderRadius: 12,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '12px 18px',
              background: 'hotpink',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
