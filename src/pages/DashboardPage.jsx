import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase.js'
import { AuthContext } from '../context/AuthContext.jsx'
import ProfileDropdown from '../components/ProfileDropdown.jsx'

export default function DashboardPage() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [challenges, setChallenges] = useState([])
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [xp, setXp] = useState(0)

  useEffect(() => {
    async function fetchChallenges() {
      const { data, error } = await supabase.from('challenges').select('*').order('id', { ascending: true })
      if (!error) setChallenges(data)
    }
    fetchChallenges()
  }, [])

  const rank = xp < 100 ? 'Rookie' : xp < 300 ? 'Challenger' : xp < 600 ? 'Expert' : 'SQL Master'

  return (
    <div
      className="ambient-shell ambient-dashboard"
      style={{ minHeight: '100vh' }}
      onMouseMove={(event) => {
        const shell = event.currentTarget
        const rect = shell.getBoundingClientRect()
        shell.style.setProperty('--cursor-x', `${event.clientX - rect.left}px`)
        shell.style.setProperty('--cursor-y', `${event.clientY - rect.top}px`)
      }}
    >
      <div className="smoke-layer" />
      <div className="page-inner">
        <ProfileDropdown />
        <div style={{ display: 'grid', gap: 24, paddingTop: 14 }}>
          
          {/* PROFILE CARD - Fixed border and alignment */}
          <div
            style={{
              border: '1px solid rgba(57, 255, 20, 0.3)',
              borderRadius: 24,
              padding: 28,
              background: 'rgba(5, 5, 5, 0.95)',
              boxShadow: '0 0 25px rgba(57, 255, 20, 0.12)'
            }}
          >
            <h1 style={{ margin: 0, color: '#39FF14', letterSpacing: '0.12em' }}>QUERY ARENA</h1>
            <div style={{ marginTop: 16, color: '#aaa', fontSize: 14 }}>Player Profile</div>
            
            <div style={{ 
              display: 'flex', 
              gap: '50px', 
              marginTop: 24,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#555', fontSize: '11px', letterSpacing: '0.15em' }}>LEVEL</div>
                <div style={{ color: '#39FF14', fontSize: '32px', fontWeight: 'bold' }}>{Math.floor(xp / 100) + 1}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#555', fontSize: '11px', letterSpacing: '0.15em' }}>XP</div>
                <div style={{ color: '#39FF14', fontSize: '32px', fontWeight: 'bold' }}>
                  {xp} <span style={{fontSize: '14px', color: '#444'}}>/ 100</span>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#555', fontSize: '11px', letterSpacing: '0.15em' }}>RANK</div>
                <div style={{ color: '#39FF14', fontSize: '32px', fontWeight: 'bold' }}>{rank}</div>
              </div>
            </div>
          </div>

          {/* NAV BUTTONS */}
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <button onClick={() => navigate('/profile')} style={navButtonStyle('#39FF14')}>
              🧑‍💻 Profile
            </button>
            <button onClick={() => navigate('/settings')} style={navButtonStyle('hotpink')}>
              ⚙️ Settings
            </button>
            <button onClick={() => navigate('/cyber-quest')} style={navButtonStyle('#00BFFF')}>
              🛡 Cyber Quest
            </button>
            <button onClick={() => navigate('/debug-arena')} style={navButtonStyle('#FF8C00')}>
              🐛 Debug Arena
            </button>
            <button onClick={() => navigate('/word-connector')} style={navButtonStyle('#9370DB')}>
              ⚡ Word Connector
            </button>
          </div>

          {/* CHALLENGES CARD - Fixed border */}
          <div
            style={{
              border: '1px solid rgba(57, 255, 20, 0.25)',
              borderRadius: 24,
              padding: 24,
              background: 'rgba(5, 5, 5, 0.95)',
              boxShadow: '0 0 20px rgba(57, 255, 20, 0.08)'
            }}
          >
            <h2 style={{ marginTop: 0, color: '#39FF14' }}>SQL Challenges</h2>
            <div style={{ color: '#888', marginBottom: 20, fontSize: 14 }}>Challenges Loaded: {challenges.length}</div>
            <div style={{ display: 'grid', gap: 18 }}>
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  style={{
                    background: 'rgba(10, 10, 10, 0.9)',
                    border: '1px solid rgba(57, 255, 20, 0.2)',
                    borderRadius: 20,
                    padding: 22,
                    boxShadow: '0 0 15px rgba(57,255,20,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                      <h3 style={{ margin: 0, color: '#fff' }}>{challenge.title}</h3>
                      <p style={{ margin: '8px 0 0', color: '#999' }}>{challenge.description}</p>
                    </div>
                    <div style={{ color: '#39FF14', fontWeight: 700, minWidth: 90, textAlign: 'right' }}>
                      {challenge.xp_reward} XP
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/challenge/${challenge.id}`)}
                    style={{
                      marginTop: 18,
                      padding: '12px 18px',
                      borderRadius: 14,
                      border: 'none',
                      background: '#39FF14',
                      color: '#050505',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Start Challenge
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const navButtonStyle = (color) => ({
  width: '100%',
  minHeight: 58,
  borderRadius: 18,
  border: `1px solid ${color}`,
  background: '#050505',
  color,
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: 15
})
