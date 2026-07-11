import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import { supabase } from '../supabase.js'


const themeOptions = [
  { label: 'Cyber Green', value: '#39FF14' },
  { label: 'Blue', value: '#00bfff' },
  { label: 'Purple', value: '#9b59b6' }
]

export default function SettingsPage() {
  const { user } = useContext(AuthContext)
  const [toast, setToast] = useState({ type: '', message: '' })
  const [theme, setTheme] = useState(localStorage.getItem('qa-theme-color') || '#39FF14')
  const [animations, setAnimations] = useState(localStorage.getItem('qa-animations') !== 'false')
  const [sessionInfo, setSessionInfo] = useState(null)
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [isEditingName, setIsEditingName] = useState(false)

  useEffect(() => {
    setSessionInfo(JSON.parse(localStorage.getItem('supabase.auth.token')) || null)
  }, [])

  function saveTheme(value) {
    setTheme(value)
    localStorage.setItem('qa-theme-color', value)
    setToast({ type: 'success', message: 'Theme color saved.' })
  }

  function saveAnimations(value) {
    setAnimations(value)
    localStorage.setItem('qa-animations', value.toString())
  }

  async function updateProfile() {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    })
    if (error) {
      setToast({ type: 'error', message: error.message })
    } else {
      setToast({ type: 'success', message: 'Profile updated.' })
      setIsEditingName(false)
    }
  }

  function cancelEdit() {
    setFullName(user?.user_metadata?.full_name || '')
    setIsEditingName(false)
  }

  async function signOutAll() {
    const { error } = await supabase.auth.signOut({ scope: 'global' })
    if (error) {
      setToast({ type: 'error', message: error.message })
      return
    }
    setToast({ type: 'success', message: 'Signed out from all devices.' })
  }

  return (
    <div
      className="ambient-shell ambient-settings"
      style={{ minHeight: '100vh', paddingTop: 24 }}
      onMouseMove={(event) => {
        const shell = event.currentTarget
        const rect = shell.getBoundingClientRect()
        shell.style.setProperty('--cursor-x', `${event.clientX - rect.left}px`)
        shell.style.setProperty('--cursor-y', `${event.clientY - rect.top}px`)
      }}
    >
      <div className="smoke-layer" />
      <div className="page-inner" style={{ maxWidth: 980 }}>
        <div style={panelStyle}>
          <h1 style={{ margin: 0, color: '#39FF14' }}>Settings</h1>
          <div style={{ color: '#ccc', marginTop: 10 }}>Account and app preferences for Query Arena.</div>
        </div>

        <div style={panelStyle}>
          <div style={sectionLabel}>ACCOUNT</div>
          <div style={fieldRow}>
            <div style={fieldLabel}>Email</div>
            <div style={fieldValue}>{user.email}</div>
          </div>
          <div style={fieldRow}>
            <div style={fieldLabel}>Full Name</div>
            <div style={{ flex: 1 }}>
              {!isEditingName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={fieldValue}>{fullName || 'Not set'}</div>
                  <button onClick={() => setIsEditingName(true)} style={editButtonStyle}>
                    Edit
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Your name"
                    style={{ ...inputStyle, flex: 1 }}
                    autoFocus
                  />
                  <button onClick={updateProfile} style={primaryButtonStyle}>
                    Save
                  </button>
                  <button onClick={cancelEdit} style={secondaryButtonStyle}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={panelStyle}>
          <div style={sectionLabel}>APPEARANCE</div>
          <div style={fieldRow}>
            <div style={fieldLabel}>Dark Mode</div>
            <div style={{ color: '#777' }}>Always enabled</div>
          </div>
          <div style={fieldRow}>
            <div style={fieldLabel}>Theme Color</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => saveTheme(option.value)}
                  style={{
                    ...themeOptionStyle,
                    borderColor: theme === option.value ? '#39FF14' : 'rgba(255,255,255,0.08)'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div style={fieldRow}>
            <div style={fieldLabel}>Challenge Animations</div>
            <label style={toggleLabel}>
              <input 
                type="checkbox" 
                checked={animations} 
                onChange={(event) => saveAnimations(event.target.checked)} 
              />
              <span>Enabled</span>
            </label>
          </div>
        </div>

        <div style={panelStyle}>
          <div style={sectionLabel}>SECURITY</div>
          <div style={fieldRow}>
            <div style={fieldLabel}>Last Login</div>
            <div>{sessionInfo?.currentSession?.expires_at ? new Date(sessionInfo.currentSession.expires_at * 1000).toLocaleString() : 'Unknown'}</div>
          </div>
          <button onClick={signOutAll} style={secondaryButtonStyle}>
            Sign out from all devices
          </button>
        </div>

        <div style={{ ...panelStyle, borderColor: 'rgba(255, 0, 100, 0.3)' }}>
          <div style={sectionLabel}>DANGER ZONE</div>
          <div style={{ color: '#ccc', marginBottom: 16 }}>
            Account deletion requires support. This app cannot delete your user directly from the client.
          </div>
          <div style={dangerBox}>
            Contact support to delete your account.
          </div>
        </div>
      </div>

    </div>
  )
}

const panelStyle = {
  padding: 24,
  borderRadius: 28,
  background: 'rgba(8, 8, 10, 0.95)',
  border: '1px solid rgba(57,255,20,0.16)',
  marginBottom: 24
}
const sectionLabel = {
  color: '#39FF14',
  letterSpacing: '0.15em',
  fontSize: 12,
  marginBottom: 14
}
const fieldRow = {
  display: 'grid',
  gap: 12,
  marginBottom: 18
}
const fieldLabel = { color: '#aaa', fontSize: 13 }
const fieldValue = { color: '#fff', fontWeight: 700 }
const inputStyle = {
  padding: '14px 16px',
  borderRadius: 16,
  background: '#050505',
  border: '1px solid rgba(57,255,20,0.14)',
  color: '#fff',
  fontFamily: 'monospace',
  minWidth: 200
}
const editButtonStyle = {
  padding: '8px 16px',
  borderRadius: 12,
  border: '1px solid rgba(57,255,20,0.3)',
  background: 'transparent',
  color: '#39FF14',
  cursor: 'pointer',
  fontSize: 13
}
const primaryButtonStyle = {
  padding: '14px 18px',
  borderRadius: 16,
  border: 'none',
  background: '#39FF14',
  color: '#050505',
  cursor: 'pointer'
}
const secondaryButtonStyle = {
  padding: '14px 18px',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.1)',
  background: '#111',
  color: '#39FF14',
  cursor: 'pointer'
}
const themeOptionStyle = {
  padding: '12px 16px',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.08)',
  background: '#0b0b0b',
  color: '#fff',
  cursor: 'pointer'
}
const toggleLabel = {
  display: 'inline-flex',
  gap: 10,
  alignItems: 'center',
  color: '#ccc'
}
const dangerBox = {
  padding: 18,
  borderRadius: 18,
  border: '1px dashed hotpink',
  color: '#ffa6d2',
  background: 'rgba(255,20,147,0.05)'
}
