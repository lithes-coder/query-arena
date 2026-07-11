import { useState, useEffect, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import LogoutDialog from './LogoutDialog.jsx'

export default function ProfileDropdown() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    function handleKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('mousedown', handleClick)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('mousedown', handleClick)
      window.removeEventListener('keydown', handleKey)
    }
  }, [])

  return (
    <div ref={ref} style={{ position: 'fixed', right: 24, top: 22, zIndex: 1200, fontFamily: 'monospace' }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          border: '1px solid rgba(57,255,20,0.35)',
          background: '#111',
          color: '#39FF14',
          fontWeight: 700,
          cursor: 'pointer'
        }}
      >
        {user?.email ? user.email.charAt(0).toUpperCase() : 'Q'}
      </button>

      {open && (
        <div
          style={{
            marginTop: 12,
            width: 190,
            borderRadius: 18,
            background: '#0b0b0b',
            border: '1px solid rgba(57,255,20,0.18)',
            boxShadow: '0 14px 35px rgba(0,0,0,0.35)',
            animation: 'dropdown-fade 180ms ease'
          }}
        >
          <button
            onClick={() => {
              setOpen(false)
              navigate('/profile')
            }}
            style={dropdownButtonStyle}
          >
            👤 My Profile
          </button>
          <button
            onClick={() => {
              setOpen(false)
              navigate('/settings')
            }}
            style={dropdownButtonStyle}
          >
            ⚙️ Settings
          </button>
          <button
            onClick={() => {
              setOpen(false)
              setLogoutOpen(true)
            }}
            style={{ ...dropdownButtonStyle, color: 'hotpink' }}
          >
            🚪 Logout
          </button>
        </div>
      )}

      {logoutOpen && <LogoutDialog onCancel={() => setLogoutOpen(false)} />}
      <style>{`@keyframes dropdown-fade { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}

const dropdownButtonStyle = {
  width: '100%',
  textAlign: 'left',
  padding: '12px 16px',
  border: 'none',
  background: 'transparent',
  color: '#ddd',
  cursor: 'pointer',
  fontFamily: 'monospace'
}
