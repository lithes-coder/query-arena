import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase.js'

export default function ChallengePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState(null)
  const [sqlQuery, setSqlQuery] = useState('')
  const [result, setResult] = useState('')
  const [queryOutput, setQueryOutput] = useState('')
  const [progress, setProgress] = useState({ tableCreated: false, dataInserted: false, finalQueryCorrect: false })

  useEffect(() => {
    async function loadChallenge() {
      const { data, error } = await supabase.from('challenges').select('*').eq('id', id).single()
      if (!error) setChallenge(data)
    }
    loadChallenge()
  }, [id])

  function validateChallenge(query) {
    const q = query.trim().replace(/\s+/g, ' ').toLowerCase()
    if (q.startsWith('create table')) {
      setProgress((prev) => ({ ...prev, tableCreated: true }))
    }
    if (q.startsWith('insert into')) {
      setProgress((prev) => ({ ...prev, dataInserted: true }))
    }
    if (q.startsWith('select') && q.includes('from')) {
      setProgress((prev) => ({ ...prev, finalQueryCorrect: true }))
    }
  }

  async function runQuery() {
    try {
      setResult('Running query...')
      const response = await fetch('https://uvhubtriitrjtjzitrgh.functions.supabase.co/execute-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQuery })
      })
      const data = await response.json()
      if (data.result && data.result.success === false) {
        setResult('❌ Error: ' + data.result.error)
        setQueryOutput('')
        return
      }
      validateChallenge(sqlQuery)
      setResult('✅ SQL Executed Successfully')
      if (data.result?.data?.length > 0) {
        const headers = Object.keys(data.result.data[0])
        const table = headers.join(' | ') + '\n' + headers.map(() => '---').join(' | ') + '\n' + data.result.data.map((row) => headers.map((h) => row[h]).join(' | ')).join('\n')
        setQueryOutput(table)
      } else {
        setQueryOutput(data.result?.message ?? 'No rows returned')
      }
    } catch (error) {
      setResult('❌ ' + error.message)
    }
  }

  const challengeSolved = progress.tableCreated && progress.dataInserted && progress.finalQueryCorrect

  return (
    <div
      className="ambient-shell ambient-challenge"
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
        <button onClick={() => navigate('/')} style={backButtonStyle}>← Back</button>
        <div style={{ display: 'grid', gap: 22, maxWidth: 980, margin: '0 auto' }}>
          <div style={{ border: '1px solid rgba(57,255,20,0.16)', borderRadius: 24, padding: 24, background: '#0b0b0b' }}>
            <h1 style={{ margin: 0, color: '#39FF14' }}>{challenge?.title ?? 'Loading...'}</h1>
            <p style={{ color: '#ccc', marginTop: 12 }}>{challenge?.description}</p>
            <div style={{ marginTop: 10, color: '#99ff90' }}>Reward: {challenge?.xp_reward ?? '--'} XP</div>
          </div>

          <textarea
            rows={10}
            value={sqlQuery}
            onChange={(event) => setSqlQuery(event.target.value)}
            placeholder="Type SQL here..."
            style={{
              width: '100%',
              background: '#000',
              color: '#39FF14',
              border: '1px solid #39FF14',
              borderRadius: 16,
              padding: 18,
              fontFamily: 'monospace',
              resize: 'vertical'
            }}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <button onClick={runQuery} style={actionButtonStyle('hotpink')}>
              Run Query
            </button>
            <button
              disabled={!challengeSolved}
              onClick={() => setResult('Challenge completed!')}
              style={actionButtonStyle(challengeSolved ? '#39FF14' : '#444')}
            >
              Complete Challenge
            </button>
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ color: '#39FF14', fontWeight: 700 }}>{result}</div>
            <pre style={{ background: '#111', color: '#fff', padding: 18, borderRadius: 16, overflowX: 'auto' }}>
              {queryOutput}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

const backButtonStyle = {
  padding: '12px 18px',
  borderRadius: 16,
  border: '1px solid rgba(57,255,20,0.22)',
  background: '#111',
  color: '#39FF14',
  cursor: 'pointer'
}

const actionButtonStyle = (bg) => ({
  padding: '14px 22px',
  borderRadius: 16,
  border: 'none',
  background: bg,
  color: '#050505',
  cursor: 'pointer'
})
