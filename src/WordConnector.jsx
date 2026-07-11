import { useState, useRef, useEffect } from "react"

// ─── Word connection graph ────────────────────────────────
// Each word maps to words it can validly connect to.
// Connection is bidirectional — if A connects to B, B connects to A.
const WORD_GRAPH = {
  // FIRE → ICE
  FIRE:   ["HEAT", "SMOKE", "FLAME", "HOT", "BURN", "WOOD", "ASH"],
  HEAT:   ["WARM", "HOT", "FIRE", "SUN", "ENERGY", "TEMPERATURE"],
  WARM:   ["COOL", "HOT", "COZY", "HEAT", "COLD"],
  HOT:    ["COLD", "WARM", "HEAT", "FIRE", "SUN"],
  COOL:   ["COLD", "WARM", "ICE", "BREEZE", "CHILL", "FRESH"],
  COLD:   ["ICE", "COOL", "FREEZE", "WINTER", "SNOW", "CHILL"],
  SMOKE:  ["FOG", "FIRE", "CLOUD", "ASH", "MIST", "AIR"],
  FOG:    ["MIST", "SMOKE", "CLOUD", "COLD", "DAMP", "COOL"],
  MIST:   ["FOG", "COOL", "COLD", "DAMP", "ICE", "WATER"],
  FLAME:  ["FIRE", "HOT", "BURN", "HEAT", "LIGHT"],
  BURN:   ["FLAME", "FIRE", "HOT", "ASH"],
  ASH:    ["FIRE", "SMOKE", "DUST", "BURN"],
  ICE:    ["COLD", "WATER", "FREEZE", "SNOW", "COOL", "CHILL"],
  FREEZE: ["ICE", "COLD", "WINTER", "SNOW"],
  SNOW:   ["ICE", "COLD", "WINTER", "WHITE", "FREEZE"],
  WINTER: ["COLD", "SNOW", "ICE", "FREEZE"],
  CHILL:  ["COLD", "COOL", "ICE", "FREEZE"],
  SUN:    ["HEAT", "HOT", "WARM", "LIGHT", "ENERGY"],
  LIGHT:  ["FLAME", "SUN", "ENERGY", "BRIGHT"],

  // OCEAN → DESERT
  OCEAN:  ["WATER", "WAVE", "SALT", "SEA", "FISH", "DEEP"],
  WATER:  ["OCEAN", "WAVE", "DRY", "LIQUID", "RAIN", "RIVER", "ICE", "MIST"],
  WAVE:   ["OCEAN", "WATER", "BEACH", "SURF", "SEA"],
  SALT:   ["OCEAN", "DRY", "MINERAL", "SEA", "SAND"],
  SEA:    ["OCEAN", "WATER", "WAVE", "SALT", "FISH"],
  BEACH:  ["SAND", "WAVE", "OCEAN", "SUN", "SHORE"],
  SAND:   ["DESERT", "BEACH", "DRY", "GRAIN", "DUST"],
  DRY:    ["DESERT", "SAND", "HOT", "ARID", "WATER"],
  DESERT: ["SAND", "DRY", "HOT", "ARID", "HEAT"],
  ARID:   ["DRY", "DESERT", "HOT"],
  SHORE:  ["BEACH", "OCEAN", "SAND", "WAVE"],
  DUST:   ["SAND", "DRY", "DESERT", "ASH"],
  RAIN:   ["CLOUD", "WATER", "COLD", "WET"],
  RIVER:  ["WATER", "OCEAN", "FLOW", "WAVE"],
  FISH:   ["OCEAN", "SEA", "WATER", "RIVER"],

  // MUSIC → MATH
  MUSIC:    ["NOTES", "RHYTHM", "BEAT", "SOUND", "MELODY", "HARMONY"],
  NOTES:    ["MUSIC", "COUNT", "SCALE", "WRITE", "NUMBER"],
  RHYTHM:   ["MUSIC", "BEAT", "PATTERN", "TIME", "TEMPO"],
  BEAT:     ["RHYTHM", "TIME", "MUSIC", "COUNT", "TEMPO"],
  COUNT:    ["NUMBER", "NOTES", "BEAT", "MATH", "TALLY"],
  NUMBER:   ["MATH", "COUNT", "DIGIT", "NOTES", "FIGURE"],
  PATTERN:  ["RHYTHM", "SEQUENCE", "MATH", "DESIGN", "ORDER"],
  SEQUENCE: ["PATTERN", "MATH", "ORDER", "SERIES", "NUMBER"],
  TEMPO:    ["RHYTHM", "BEAT", "TIME", "SPEED", "MUSIC"],
  TIME:     ["RHYTHM", "BEAT", "TEMPO", "MEASURE", "MATH"],
  MEASURE:  ["MATH", "TIME", "MUSIC", "LENGTH", "COUNT"],
  SCALE:    ["NOTES", "MUSIC", "MATH", "MEASURE", "SIZE"],
  TALLY:    ["COUNT", "NUMBER", "MATH", "SCORE"],
  SERIES:   ["SEQUENCE", "NUMBER", "MATH", "PATTERN"],
  MATH:     ["NUMBER", "COUNT", "PATTERN", "SEQUENCE", "MEASURE"],
  MELODY:   ["MUSIC", "NOTES", "SOUND", "HARMONY"],
  HARMONY:  ["MUSIC", "MELODY", "NOTES", "PATTERN"],
  SOUND:    ["MUSIC", "WAVE", "BEAT", "NOISE"],

  // SWORD → PEN
  SWORD:  ["FIGHT", "BLADE", "STEEL", "KNIGHT", "WEAPON", "SHARP"],
  FIGHT:  ["SWORD", "WRITE", "BATTLE", "ARGUE", "WAR"],
  BLADE:  ["SWORD", "SHARP", "STEEL", "KNIFE", "EDGE"],
  STEEL:  ["SWORD", "BLADE", "METAL", "INK", "HARD"],
  SHARP:  ["BLADE", "POINT", "SWORD", "KEEN"],
  POINT:  ["SHARP", "PEN", "TIP", "BLADE", "WRITE"],
  WRITE:  ["PEN", "FIGHT", "NOTES", "LETTER", "WORDS", "SCRIPT"],
  KNIGHT: ["SWORD", "ARMOR", "LETTER", "CHESS"],
  LETTER: ["WRITE", "PEN", "WORD", "KNIGHT", "NOTES"],
  INK:    ["PEN", "WRITE", "STEEL", "MARK"],
  PEN:    ["WRITE", "INK", "POINT", "LETTER", "WORDS"],
  WORDS:  ["WRITE", "PEN", "LETTER", "NOTES"],
  EDGE:   ["BLADE", "SHARP", "SWORD"],
  WEAPON: ["SWORD", "FIGHT", "BLADE"],
  BATTLE: ["FIGHT", "SWORD", "WAR"],

  // CLOUD → CODE
  CLOUD:    ["SERVER", "STORAGE", "NETWORK", "SKY", "DATA", "RAIN", "FOG", "SMOKE"],
  SERVER:   ["CLOUD", "DATA", "NETWORK", "CODE", "PROGRAM", "COMPUTER"],
  STORAGE:  ["CLOUD", "DATA", "FILE", "MEMORY", "SERVER"],
  NETWORK:  ["CLOUD", "SERVER", "DATA", "SYSTEM", "INTERNET"],
  DATA:     ["SERVER", "CLOUD", "STORAGE", "CODE", "PROGRAM", "FILE", "NUMBER"],
  FILE:     ["STORAGE", "DATA", "CODE", "SCRIPT", "PROGRAM"],
  PROGRAM:  ["CODE", "SERVER", "DATA", "SCRIPT", "SOFTWARE", "COMPUTER"],
  SCRIPT:   ["CODE", "FILE", "PROGRAM", "WRITE"],
  SOFTWARE: ["PROGRAM", "CODE", "COMPUTER", "SYSTEM"],
  SYSTEM:   ["NETWORK", "SOFTWARE", "CODE", "COMPUTER", "PROGRAM"],
  COMPUTER: ["CODE", "PROGRAM", "SOFTWARE", "SERVER", "DATA", "SYSTEM"],
  INTERNET: ["NETWORK", "CLOUD", "DATA", "SERVER"],
  CODE:     ["PROGRAM", "SCRIPT", "SOFTWARE", "DATA", "COMPUTER", "WRITE"],
  MEMORY:   ["STORAGE", "DATA", "COMPUTER"],
  SKY:      ["CLOUD", "RAIN", "SUN", "HIGH"],
}

function isValidConnection(from, to) {
  const neighbors = WORD_GRAPH[from.toUpperCase()] || []
  return neighbors.includes(to.toUpperCase())
}

function validateMove(chain, word, endWord) {
  const upper = word.toUpperCase()
  const from = chain[chain.length - 1].toUpperCase()

  if (chain.map(w => w.toUpperCase()).includes(upper)) {
    return { valid: false, reason: `${upper} is already in your chain.` }
  }
  if (!WORD_GRAPH[upper] && upper !== endWord.toUpperCase()) {
    return { valid: false, reason: `${upper} is not in the word graph. Try a more common word.` }
  }
  if (!isValidConnection(from, upper)) {
    return { valid: false, reason: `${upper} has no direct connection to ${from}. Think closer.` }
  }
  if (upper === endWord.toUpperCase()) {
    return { valid: true, reason: `${from} connects to ${upper}. You reached the end!`, isWin: true }
  }
  return { valid: true, reason: `✓ ${from} → ${upper} is a valid connection.`, isWin: false }
}

// ─── Challenges ───────────────────────────────────────────
const CHALLENGES = [
  {
    id: 1,
    start: "FIRE",
    end: "ICE",
    maxSteps: 6,
    xp: 150,
    example: "FIRE → HEAT → WARM → COOL → COLD → ICE"
  },
  {
    id: 2,
    start: "OCEAN",
    end: "DESERT",
    maxSteps: 6,
    xp: 200,
    example: "OCEAN → WAVE → BEACH → SAND → DESERT"
  },
  {
    id: 3,
    start: "MUSIC",
    end: "MATH",
    maxSteps: 5,
    xp: 175,
    example: "MUSIC → BEAT → COUNT → NUMBER → MATH"
  },
  {
    id: 4,
    start: "SWORD",
    end: "PEN",
    maxSteps: 4,
    xp: 250,
    example: "SWORD → SHARP → POINT → PEN"
  },
  {
    id: 5,
    start: "CLOUD",
    end: "CODE",
    maxSteps: 5,
    xp: 300,
    example: "CLOUD → SERVER → DATA → PROGRAM → CODE"
  },
]

export default function WordConnector({ onBack }) {
  const [screen, setScreen] = useState("menu")
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [chain, setChain] = useState([])
  const [input, setInput] = useState("")
  const [log, setLog] = useState([])
  const [won, setWon] = useState(false)
  const [totalXp, setTotalXp] = useState(0)
  const [solvedIds, setSolvedIds] = useState([])
  const [showExample, setShowExample] = useState(true)
  const [earnedXp, setEarnedXp] = useState(0)
  const inputRef = useRef()
  const logBottomRef = useRef()

  useEffect(() => {
    logBottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [log])

  function startChallenge(challenge) {
    setSelectedChallenge(challenge)
    setChain([challenge.start])
    setInput("")
    setLog([])
    setWon(false)
    setShowExample(true)
    setEarnedXp(0)
    setScreen("game")
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  function handleSubmit() {
    const word = input.trim().toUpperCase()
    if (!word) return

    setInput("")
    setShowExample(false)

    const result = validateMove(chain, word, selectedChallenge.end)

    if (!result.valid) {
      setLog(prev => [...prev, { word, reason: result.reason, valid: false }])
      return
    }

    const newChain = [...chain, word]
    setChain(newChain)
    setLog(prev => [...prev, { word, reason: result.reason, valid: true }])

    if (result.isWin) {
      const alreadySolved = solvedIds.includes(selectedChallenge.id)
      let xp = 0
      if (!alreadySolved) {
        const stepsUsed = newChain.length - 1
        const bonus = Math.max(0, selectedChallenge.maxSteps - stepsUsed) * 20
        xp = selectedChallenge.xp + bonus
        setTotalXp(prev => prev + xp)
        setSolvedIds(prev => [...prev, selectedChallenge.id])
      }
      setEarnedXp(xp)
      setWon(true)
      setScreen("result")
      return
    }

    if (newChain.length - 1 >= selectedChallenge.maxSteps) {
      setScreen("result")
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") handleSubmit()
  }

  const stepsLeft = selectedChallenge
    ? selectedChallenge.maxSteps - (chain.length - 1)
    : 0

  const difficultyColor = (xp) =>
    xp <= 150 ? "#39FF14" : xp <= 200 ? "hotpink" : "#ff8c00"

  // ─── MENU ─────────────────────────────────────────────
  if (screen === "menu") {
    return (
      <div className="ambient-shell ambient-word" style={s.root}>
        <div className="smoke-layer" />
        <div className="page-inner">
          <button onClick={onBack} style={s.backBtn}>← Back to Arena</button>

        <div style={{ marginBottom: 24 }}>
          <div style={s.logo}>⚡ WORD CONNECTOR</div>
          <div style={s.subtitle}>Side Quest · Query Arena</div>
          <div style={s.xpBadge}>🏅 {totalXp} XP</div>
        </div>

        <div style={s.rulesBox}>
          <div style={s.rulesLabel}>HOW TO PLAY</div>
          <div style={s.rulesText}>
            Connect the <b style={{ color: "#39FF14" }}>START</b> word to the{" "}
            <b style={{ color: "hotpink" }}>END</b> word, one step at a time.
            Each word must be directly related to the previous one.
            Type the END word as your final move to win.
            Fewer steps = more bonus XP.
          </div>
          <div style={s.exampleRow}>
            <span style={s.exLabel}>EXAMPLE: </span>
            {"FIRE → HEAT → WARM → COOL → COLD → ICE".split(" → ").map((w, i, arr) => (
              <span key={i}>
                <span style={{ color: i === 0 ? "#39FF14" : i === arr.length - 1 ? "hotpink" : "#ccc", fontWeight: "bold" }}>{w}</span>
                {i < arr.length - 1 && <span style={{ color: "#444", margin: "0 4px" }}>→</span>}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {CHALLENGES.map(c => {
            const solved = solvedIds.includes(c.id)
            return (
              <div key={c.id} style={{ ...s.card, borderColor: solved ? "#39FF14" : "#2a2a2a" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: "#39FF14", fontWeight: "bold", fontSize: 16 }}>{c.start}</span>
                    <span style={{ color: "#444" }}>→→→</span>
                    <span style={{ color: "hotpink", fontWeight: "bold", fontSize: 16 }}>{c.end}</span>
                  </div>
                  <span style={{ color: difficultyColor(c.xp), fontSize: 13, fontWeight: "bold" }}>{c.xp} XP</span>
                </div>
                <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>
                  Max {c.maxSteps} steps
                  {solved && <span style={{ color: "#39FF14", marginLeft: 8 }}>✓ SOLVED</span>}
                </div>
                <button
                  onClick={() => startChallenge(c)}
                  style={{ ...s.btn, marginTop: 12, background: solved ? "#111" : "hotpink", border: solved ? "1px solid #39FF14" : "none" }}
                >
                  {solved ? "▶ Play Again" : "▶ Start Challenge"}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

  // ─── RESULT ───────────────────────────────────────────
  if (screen === "result") {
    const stepsUsed = chain.length - 1
    const bonus = won && !solvedIds.includes(selectedChallenge.id - 1)
      ? Math.max(0, selectedChallenge.maxSteps - stepsUsed) * 20
      : 0

    return (
      <div className="ambient-shell ambient-word" style={s.root}>
        <div className="smoke-layer" />
        <div className="page-inner">
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 52 }}>{won ? "🏆" : "💀"}</div>
            <div style={s.logo}>{won ? "CHAIN COMPLETE!" : "OUT OF STEPS"}</div>
            {won && earnedXp > 0 && (
              <div style={{ color: "#39FF14", fontSize: 18, marginTop: 8 }}>
                +{earnedXp} XP
              </div>
            )}
            {won && earnedXp === 0 && (
              <div style={{ color: "#555", fontSize: 14, marginTop: 8 }}>Already solved — no XP awarded</div>
            )}
            {!won && (
              <div style={{ color: "#555", marginTop: 8, fontSize: 13 }}>
                You ran out of steps. Try a different path.
              </div>
            )}
          </div>

          <div style={s.chainDisplay}>
            <div style={{ color: "#555", fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>YOUR CHAIN</div>
            <div style={{ lineHeight: 2.2, fontSize: 14, wordBreak: "break-word" }}>
              {chain.map((word, i) => (
                <span key={i}>
                  <span style={{
                    color: i === 0 ? "#39FF14" : i === chain.length - 1 && won ? "hotpink" : "white",
                    fontWeight: "bold"
                  }}>
                    {word}
                  </span>
                  {i < chain.length - 1 && <span style={{ color: "#444", margin: "0 8px" }}>→</span>}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
            <button onClick={() => startChallenge(selectedChallenge)} style={s.btn}>Try Again</button>
            <button
              onClick={() => setScreen("menu")}
              style={{ ...s.btn, background: "#111", border: "1px solid #39FF14", color: "#39FF14" }}
            >
              ← Menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── GAME ─────────────────────────────────────────────
  const prevWord = chain[chain.length - 1]

  return (
    <div className="ambient-shell ambient-word" style={s.root}>
      <div className="smoke-layer" />
      <div className="page-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <button onClick={() => setScreen("menu")} style={s.backBtn}>← Menu</button>
          <div style={{ color: stepsLeft <= 1 ? "hotpink" : "#aaa", fontSize: 13, fontWeight: "bold" }}>
            {stepsLeft} step{stepsLeft !== 1 ? "s" : ""} left
          </div>
        </div>

      {/* START → END */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, marginBottom: 16 }}>
        <div style={{ textAlign: "center" }}>
          <div style={s.wordLabel}>START</div>
          <div style={{ color: "#39FF14", fontSize: 26, fontWeight: "bold", letterSpacing: 2 }}>
            {selectedChallenge.start}
          </div>
        </div>
        <div style={{ color: "#333", fontSize: 22 }}>- - -</div>
        <div style={{ textAlign: "center" }}>
          <div style={s.wordLabel}>END</div>
          <div style={{ color: "hotpink", fontSize: 26, fontWeight: "bold", letterSpacing: 2 }}>
            {selectedChallenge.end}
          </div>
        </div>
      </div>

      {/* Example hint */}
      {showExample && (
        <div style={s.hintBox}>
          <span style={{ color: "#555", fontSize: 11, letterSpacing: 1 }}>EXAMPLE PATH: </span>
          {selectedChallenge.example.split(" → ").map((w, i, arr) => (
            <span key={i}>
              <span style={{ color: i === 0 ? "#39FF14" : i === arr.length - 1 ? "hotpink" : "#888", fontSize: 12 }}>{w}</span>
              {i < arr.length - 1 && <span style={{ color: "#444", fontSize: 12 }}> → </span>}
            </span>
          ))}
          <div style={{ color: "#444", fontSize: 11, marginTop: 6 }}>
            Type intermediate words one at a time. Type{" "}
            <span style={{ color: "hotpink" }}>{selectedChallenge.end}</span> as your final move to win.
          </div>
        </div>
      )}

      {/* Chain so far */}
      <div style={s.chainBar}>
        {chain.map((word, i) => (
          <span key={i}>
            <span style={{
              color: i === 0 ? "#39FF14" : "#fff",
              fontWeight: i === chain.length - 1 ? "bold" : "normal",
              fontSize: i === chain.length - 1 ? 15 : 13
            }}>
              {word}
            </span>
            <span style={{ color: "#333", margin: "0 6px" }}>→</span>
          </span>
        ))}
        <span style={{ color: "#555", fontStyle: "italic", fontSize: 13 }}>
          your word → ... → <span style={{ color: "hotpink" }}>{selectedChallenge.end}</span>
        </span>
      </div>

      {/* Input */}
      <div style={{ marginBottom: 6, color: "#555", fontSize: 12 }}>
        Connect from <span style={{ color: "#fff", fontWeight: "bold" }}>{prevWord}</span> to...
      </div>
      <div style={s.inputRow}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value.toUpperCase())}
          onKeyDown={handleKey}
          placeholder={`Word connected to ${prevWord}...`}
          style={s.input}
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          style={{ ...s.submitBtn, opacity: !input.trim() ? 0.4 : 1 }}
        >
          →
        </button>
      </div>

      {/* Log — newest on top */}
      <div style={s.logContainer}>
        {log.slice().reverse().map((entry, i) => (
          <div key={i} style={{ ...s.logEntry, borderLeftColor: entry.valid ? "#39FF14" : "hotpink" }}>
            <span style={{ color: entry.valid ? "#39FF14" : "hotpink", fontWeight: "bold", minWidth: 80 }}>
              {entry.valid ? "✓" : "✗"} {entry.word}
            </span>
            <span style={{ color: "#666", fontSize: 12 }}>{entry.reason}</span>
          </div>
        ))}
        <div ref={logBottomRef} />
      </div>
    </div>
  </div>
  )
}

const s = {
  root: {
    minHeight: "100vh",
    color: "white",
    padding: "24px 20px",
    fontFamily: "monospace",
    maxWidth: 580,
    margin: "0 auto",
    boxSizing: "border-box"
  },
  logo: { color: "#39FF14", fontSize: 26, fontWeight: "bold", letterSpacing: 3, marginBottom: 4 },
  subtitle: { color: "#444", fontSize: 12, marginTop: 4 },
  xpBadge: {
    display: "inline-block", marginTop: 10,
    background: "#111", border: "1px solid #39FF14",
    color: "#39FF14", padding: "4px 16px", borderRadius: 20, fontSize: 13
  },
  rulesBox: {
    background: "#0f0f0f", border: "1px solid #222",
    borderRadius: 10, padding: "16px 18px", marginBottom: 24
  },
  rulesLabel: { color: "#444", fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  rulesText: { color: "#999", fontSize: 13, lineHeight: 1.7, marginBottom: 12 },
  exampleRow: { background: "#161616", borderRadius: 6, padding: "8px 12px", fontSize: 13 },
  exLabel: { color: "#444", fontSize: 11, marginRight: 8 },
  card: { background: "#111", border: "2px solid", borderRadius: 12, padding: "16px 18px" },
  btn: {
    padding: "10px 22px", background: "hotpink",
    color: "white", border: "none", borderRadius: 8,
    cursor: "pointer", fontFamily: "monospace",
    fontWeight: "bold", fontSize: 13
  },
  backBtn: {
    background: "transparent", color: "#555",
    border: "none", cursor: "pointer",
    fontFamily: "monospace", fontSize: 13,
    marginBottom: 20, display: "block"
  },
  wordLabel: { color: "#444", fontSize: 10, letterSpacing: 2, marginBottom: 4 },
  hintBox: {
    background: "#0a1a0a", border: "1px solid #1a2e1a",
    borderRadius: 8, padding: "10px 14px", marginBottom: 14, lineHeight: "22px"
  },
  chainBar: {
    background: "#111", border: "1px solid #1e1e1e",
    borderRadius: 8, padding: "12px 14px",
    marginBottom: 14, fontSize: 13, lineHeight: "20px",
    minHeight: 44, wordBreak: "break-word"
  },
  inputRow: { display: "flex", gap: 10, marginBottom: 16 },
  input: {
    flex: 1, background: "#000", color: "#39FF14",
    border: "1px solid #39FF14", borderRadius: 8,
    padding: "12px 14px", fontFamily: "monospace",
    fontSize: 15, letterSpacing: 2, outline: "none"
  },
  submitBtn: {
    background: "#39FF14", border: "none", borderRadius: 8,
    padding: "12px 18px", fontSize: 18,
    cursor: "pointer", fontWeight: "bold"
  },
  logContainer: {
    display: "flex", flexDirection: "column",
    gap: 8, maxHeight: 240, overflowY: "auto"
  },
  logEntry: {
    background: "#111", borderLeft: "3px solid",
    borderRadius: "0 6px 6px 0", padding: "8px 12px",
    display: "flex", alignItems: "flex-start",
    gap: 10, flexWrap: "wrap"
  },
  chainDisplay: {
    background: "#111", borderRadius: 10,
    padding: "16px 20px", textAlign: "center", marginBottom: 16
  }
}
