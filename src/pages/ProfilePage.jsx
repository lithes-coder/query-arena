import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import { supabase } from '../supabase.js'

const RANKS = ['Rookie', 'Challenger', 'Expert', 'SQL Master']

export default function ProfilePage() {
  const { user } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [fullName, setFullName] = useState('')
  const [completedCount, setCompletedCount] = useState(0)
  const [toast, setToast] = useState({ type: '', message: '' })

  useEffect(() => {
    async function loadProfile() {
      if (!user) return
      setLoading(true)
      const [{ data: profileData }, { data: completedData }] = await Promise.all([
        supabase.from('profiles').select('full_name, avatar_url, created_at').eq('id', user.id).single(),
        supabase.from('completed_challenges').select('id', { count: 'exact' }).eq('user_id', user.id)
      ])
      setProfile(profileData ?? null)
      setFullName(profileData?.full_name ?? user?.user_metadata?.full_name ?? user.email)
      setCompletedCount(completedData?.count ?? 0)
      setLoading(false)
    }
    loadProfile()
  }, [user])

  async function saveName() {
    const trimmed = fullName.trim()
    if (!trimmed) {
      setToast({ type: 'error', message: 'Name cannot be empty.' })
      return
    }
    
    // Save to Supabase Auth user metadata
    const { error } = await supabase.auth.updateUser({
      data: { full_name: trimmed }
    })
    
    if (error) {
      setToast({ type: 'error', message: error.message })
      return
    }
    
    setProfile((prev) => ({ ...prev, full_name: trimmed }))
    setEditMode(false)
    setToast({ type: 'success', message: 'Profile updated.' })
  }

  const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'
  const currentXp = 0
  const currentRank = RANKS[Math.min(Math.floor(currentXp / 200), RANKS.length - 1)]

  if (loading) {
    return <div style={loaderStyle}>Loading profile...</div>
  }

  return (
    <div
      className="ambient-shell"
      style={{ minHeight: '100vh', paddingTop: 24 }}
      onMouseMove={(event) => {
        const shell = event.currentTarget
        const rect = shell.getBoundingClientRect()
        shell.style.setProperty('--cursor-x', `${event.clientX - rect.left}px`)
        shell.style.setProperty('--cursor-y', `${event.clientY - rect.top}px`)
      }}
    >
      <div className="smoke-layer" />
      <div className="page-inner" style={{ maxWidth: 860 }}>
        <div style={profileCardStyle}>
          <div style={avatarStyle}>{(user.email || 'Q').charAt(0).toUpperCase()}</div>
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ color: '#39FF14', fontSize: 24, fontWeight: 700 }}>{user?.user_metadata?.full_name || profile?.full_name || user.email}</div>
            <div style={{ color: '#ccc' }}>{user.email}</div>
          </div>
        </div>

        <div style={infoGrid}>
          <div style={infoCard}>
            <div style={infoLabel}>Member Since</div>
            <div style={infoValue}>{memberSince}</div>
          </div>
          <div style={infoCard}>
            <div style={infoLabel}>Challenges Completed</div>
            <div style={infoValue}>{completedCount}</div>
          </div>
          <div style={infoCard}>
            <div style={infoLabel}>Current XP</div>
            <div style={infoValue}>{currentXp}</div>
          </div>
          <div style={infoCard}>
            <div style={infoLabel}>Current Rank</div>
            <div style={infoValue}>{currentRank}</div>
          </div>
        </div>

        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={panelTitle}>Edit Name</div>
              <div style={panelSubtitle}>Update the display name saved to your profile.</div>
            </div>
            <button
              type="button"
              onClick={() => setEditMode((prev) => !prev)}
              style={secondaryButtonStyle}
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editMode ? (
            <div style={{ display: 'grid', gap: 14, marginTop: 20 }}>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                style={{ ...inputStyle, width: '100%' }}
              />
              <button onClick={saveName} style={primaryButtonStyle}>
                Save Name
              </button>
            </div>
          ) : (
            <div style={{ marginTop: 20, color: '#ccc' }}>
              Use the Edit button to change the display name shown on your profile. This is saved to Supabase profiles data.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const loaderStyle = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  color: '#39FF14',
  background: '#0b0b0b',
  fontFamily: 'monospace'
}

const profileCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 22,
  padding: 24,
  borderRadius: 28,
  border: '1px solid rgba(57,255,20,0.16)',
  background: 'rgba(8,8,10,0.95)',
  marginBottom: 24
}

const avatarStyle = {
  width: 90,
  height: 90,
  borderRadius: '50%',
  background: '#39FF14',
  color: '#050505',
  display: 'grid',
  placeItems: 'center',
  fontSize: 36,
  fontWeight: 900
}

const infoGrid = {
  display: 'grid',
  gap: 18,
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  marginBottom: 26
}

const infoCard = {
  padding: 20,
  borderRadius: 22,
  background: '#0b0b0b',
  border: '1px solid rgba(57,255,20,0.12)'
}

const infoLabel = { color: '#999', marginBottom: 8, textTransform: 'uppercase', fontSize: 12 }
const infoValue = { color: '#fff', fontSize: 20, fontWeight: 700 }
const panelStyle = {
  padding: 24,
  borderRadius: 24,
  background: 'rgba(7,7,10,0.94)',
  border: '1px solid rgba(57,255,20,0.16)'
}
const panelTitle = { color: '#39FF14', fontSize: 18, marginBottom: 6 }
const panelSubtitle = { color: '#ccc', fontSize: 13 }
const inputStyle = {
  padding: '14px 16px',
  background: '#050505',
  border: '1px solid rgba(57,255,20,0.14)',
  borderRadius: 16,
  color: '#fff',
  fontFamily: 'monospace'
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
  padding: '12px 18px',
  borderRadius: 16,
  border: '1px solid rgba(57,255,20,0.24)',
  background: '#111',
  color: '#39FF14',
  cursor: 'pointer'
}
