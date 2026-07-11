import { useEffect, useState } from 'react'
import { supabase } from './supabase.js'

function App() {
  const [challenges, setChallenges] = useState([])
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sqlQuery, setSqlQuery] = useState('')
  const [result, setResult] = useState('')
  const [queryOutput, setQueryOutput] = useState('')
  const [xp, setXp] = useState(0)
  const [challengeSolved, setChallengeSolved] = useState(false)

  const [progress, setProgress] = useState({
  tableCreated: false,
  dataInserted: false,
  finalQueryCorrect: false
})

  useEffect(() => {
    fetchChallenges()
  }, [])

  // fetch challenges on mount
  // and monitor progress to mark challenge as solved
  useEffect(() => {
    // already fetched on mount above, but keep in case of re-fetch needs
    fetchChallenges()
  }, [])

  useEffect(() => {
    if (
      progress.tableCreated &&
      progress.dataInserted &&
      progress.finalQueryCorrect
    ) {
      setChallengeSolved(true)
      console.log('Challenge Solved')
    }
  }, [progress])

  async function fetchChallenges() {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')

    if (!error) {
      setChallenges(data)
    }
    console.log('DATA:', data)
    console.log('ERROR:', error)

    console.log(data)
    console.log(error)
  }

async function runQuery() {
  try {

    setResult('Running query...')

    const response = await fetch(
      'https://uvhubtriitrjtjzitrgh.functions.supabase.co/execute-sql',
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          query:sqlQuery
        })
      }
    )


    const data = await response.json()


    if (
      data.result &&
      data.result.success === false
    ) {

      setResult(
        '❌ Error: ' + data.result.error
      )

      setQueryOutput('')

      return
    }


    setResult(
      '✅ Query Executed Successfully'
    )
    validateChallenge(sqlQuery)
    const q = sqlQuery
  .trim()
  .replace(/\s+/g, ' ')
  .toLowerCase()

if (
  progress.tableCreated &&
  progress.dataInserted &&
  progress.finalQueryCorrect
) {

  setResult(
    '🎯 Challenge Requirements Completed'
  )

}
else {

  setResult(
    '⚠ SQL Executed Successfully but challenge requirements are not completed'
  )

}


    setQueryOutput(
      JSON.stringify(
        data.result,
        null,
        2
      )
    )


  }
  catch(error){

    setResult(
      '❌ ' + error.message
    )

  }
}

  function completeChallenge() {
    if (!selectedChallenge) return

    setXp((currentXp) => currentXp + selectedChallenge.xp_reward)

    setResult(
      `Challenge completed! +${selectedChallenge.xp_reward} XP`
    )
  }

  if (currentPage === 'challenge') {
    return (
      <div
        style={{
          backgroundColor: '#0b0b0b',
          minHeight: '100vh',
          color: 'white',
          padding: '20px'
        }}
      >
        <button
          onClick={() => setCurrentPage('dashboard')}
          style={{
            padding: '10px',
            marginBottom: '20px'
          }}
        >
          ← Back
        </button>

        <h1 style={{ color: '#39FF14' }}>
          {selectedChallenge.title}
        </h1>

        <p>{selectedChallenge.description}</p>

        <p>
          Reward: {selectedChallenge.xp_reward} XP
        </p>

        <h3>Write Your SQL Query</h3>

        <textarea
          rows="10"
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          placeholder="Type SQL here..."
          style={{
            width: '100%',
            background: '#000',
            color: '#39FF14',
            border: '1px solid #39FF14',
            borderRadius: '10px',
            padding: '10px'
          }}
        />

        <br />
        <br />

        <button
          onClick={runQuery}
          style={{
            padding: '10px 20px',
            background: 'hotpink',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Run Query
        </button>

        <button
  disabled={!challengeSolved}
  onClick={completeChallenge}
  style={{
    marginLeft: '10px',
    padding: '10px 20px',
    background:
      challengeSolved
        ? '#39FF14'
        : '#555',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }} >
          Complete Challenge
        </button>

        <p
          style={{
            marginTop: '20px',
            color: '#39FF14'
          }}
        >
          {result}
        </p>
        <pre>
        {JSON.stringify(progress, null, 2)}
        </pre>

        <h3>Current Query</h3>

        <pre
          style={{
            background: '#111',
            padding: '10px',
            borderRadius: '10px',
            color: '#39FF14'
          }}
        >
          {sqlQuery}
        </pre>
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: '#0b0b0b',
        minHeight: '100vh',
        color: 'white',
        padding: '20px'
      }}
    >
      <h1 style={{ color: '#39FF14' }}>
        QUERY ARENA
      </h1>

      <div
        style={{
          border: '2px solid hotpink',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px',
          background: '#111'
        }}
      >
        <h2>Player Profile</h2>

        <p>Level: {Math.floor(xp / 100) + 1}</p>

        <p>XP: {xp} / 100</p>

        <p>
        Rank:{
        xp < 100
        ? ' Rookie'
        : xp < 300
        ? ' Challenger'
        : xp < 600
        ? ' Expert'
        : ' SQL Master'
        }
      </p>
      </div>
      {console.log('Reached challenges section')}
      <h2>SQL Challenges</h2>
      <p>Challenges Loaded: {challenges.length}</p>

      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          style={{
            background: '#111',
            border: '2px solid #39FF14',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '15px',
            boxShadow: '0 0 10px #39FF14'
          }}
        >
          <h3>{challenge.title}</h3>

          <p>{challenge.description}</p>

          <p>
            Reward: {challenge.xp_reward} XP
          </p>

          <button
            onClick={() => {
              setSelectedChallenge(challenge)
              setSqlQuery('')
              setResult('')
              setCurrentPage('challenge')
            }}
            style={{
              padding: '10px',
              background: '#39FF14',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Start Challenge
          </button>
        </div>
      ))}
    </div>
  )
}

export default App