import { useState } from "react"

const CHALLENGES = [
  {
    id: 1,
    difficulty: "EASY",
    xp: 100,
    title: "Typo Attack",
    description: "This query should return all records from sandbox_users. Find and fix the typo.",
    brokenQuery: "SELCT * FROM sandbox_users",
    hint: "Look at the very first keyword — one letter is missing.",
    validate(q) {
      const clean = q.trim().toLowerCase().replace(/\s+/g, " ")
      if (!clean.startsWith("select")) {
        return { correct: false, reason: "The first keyword is still wrong. Look carefully at SELCT." }
      }
      if (!clean.includes("from sandbox_users")) {
        return { correct: false, reason: "Keep FROM sandbox_users — only fix the first keyword." }
      }
      return { correct: true, reason: "SELECT is now spelled correctly. Query is valid." }
    }
  },
  {
    id: 2,
    difficulty: "EASY",
    xp: 125,
    title: "Incomplete Condition",
    description: "This query should return only users older than 18. The WHERE clause is incomplete.",
    brokenQuery: "SELECT * FROM sandbox_users WHERE age",
    hint: "A WHERE clause needs a comparison operator and a value after the column name.",
    validate(q) {
      const clean = q.trim().toLowerCase().replace(/\s+/g, " ")
      if (!clean.includes("where")) {
        return { correct: false, reason: "Don't remove WHERE — you still need a condition." }
      }
      if (!clean.includes("age")) {
        return { correct: false, reason: "Keep 'age' as the column — WHERE age > 18." }
      }
      if (
        clean.includes("> 18") || clean.includes(">18") ||
        clean.includes(">= 19") || clean.includes(">=19")
      ) {
        return { correct: true, reason: "WHERE age > 18 is correct. Condition is now complete." }
      }
      return { correct: false, reason: "WHERE age needs a comparison — try WHERE age > 18." }
    }
  },
  {
    id: 3,
    difficulty: "EASY",
    xp: 125,
    title: "Missing Quotes",
    description: "This query should find the user named John. Fix the string comparison.",
    brokenQuery: "SELECT * FROM sandbox_users WHERE name = John",
    hint: "String values in SQL must be wrapped in single quotes.",
    validate(q) {
      const clean = q.trim().toLowerCase().replace(/\s+/g, " ")
      if (clean.includes("'john'") || clean.includes('"john"')) {
        return { correct: true, reason: "John is now correctly quoted as a string value." }
      }
      if (clean.includes("= john") || clean.includes("=john")) {
        return { correct: false, reason: "John needs single quotes around it — WHERE name = 'John'" }
      }
      return { correct: false, reason: "The WHERE condition is missing or incorrect." }
    }
  },
  {
    id: 4,
    difficulty: "MEDIUM",
    xp: 200,
    title: "GROUP BY Gone",
    description: "This query should count how many users exist per age. Fix the aggregation error.",
    brokenQuery: "SELECT age, COUNT(*) FROM sandbox_users",
    hint: "When using COUNT(*), non-aggregated columns must appear in a GROUP BY clause.",
    validate(q) {
      const clean = q.trim().toLowerCase().replace(/\s+/g, " ")
      if (!clean.includes("count(*)")) {
        return { correct: false, reason: "Don't remove COUNT(*) — the goal is to count users per age." }
      }
      if (!clean.includes("group by")) {
        return { correct: false, reason: "Still missing GROUP BY — add GROUP BY age at the end." }
      }
      if (!clean.includes("group by age")) {
        return { correct: false, reason: "GROUP BY must group by age specifically — GROUP BY age." }
      }
      return { correct: true, reason: "GROUP BY age is now present. Aggregation is valid." }
    }
  },
  {
    id: 5,
    difficulty: "MEDIUM",
    xp: 200,
    title: "ORDER Chaos",
    description: "This query should return all users sorted by age from oldest to youngest.",
    brokenQuery: "SELECT * FROM sandbox_users ORDER age DESC",
    hint: "The ORDER clause is missing a keyword between ORDER and the column name.",
    validate(q) {
      const clean = q.trim().toLowerCase().replace(/\s+/g, " ")
      if (!clean.includes("order by")) {
        return { correct: false, reason: "ORDER needs BY after it — write ORDER BY age DESC." }
      }
      if (!clean.includes("desc")) {
        return { correct: false, reason: "Don't forget DESC — oldest to youngest means descending order." }
      }
      if (!clean.includes("order by age desc")) {
        return { correct: false, reason: "Full syntax is ORDER BY age DESC — check your spacing." }
      }
      return { correct: true, reason: "ORDER BY age DESC is correct. Query is valid." }
    }
  }
]

export default function DebugArena({ onBack }) {
  const [screen, setScreen] = useState("menu")
  const [selected, setSelected] = useState(null)
  const [fixedQuery, setFixedQuery] = useState("")
  const [feedback, setFeedback] = useState(null)
  const [hintUsed, setHintUsed] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [solvedIds, setSolvedIds] = useState([])
  const [totalXp, setTotalXp] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [earnedXp, setEarnedXp] = useState(0)

  function startChallenge(challenge) {
    setSelected(challenge)
    setFixedQuery(challenge.brokenQuery)
    setFeedback(null)
    setHintUsed(false)
    setShowHint(false)
    setAttempts(0)
    setEarnedXp(0)
    setScreen("game")
  }

  function handleSubmit() {
    if (!fixedQuery.trim()) return

    if (fixedQuery.trim() === selected.brokenQuery.trim()) {
      setFeedback({ correct: false, reason: "You haven't changed anything yet — the query is still broken." })
      return
    }

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    const result = selected.validate(fixedQuery)
    setFeedback(result)

    if (result.correct) {
      const alreadySolved = solvedIds.includes(selected.id)
      if (!alreadySolved) {
        const hintPenalty = hintUsed ? 25 : 0
        const attemptPenalty = Math.min((newAttempts - 1) * 10, 50)
        const xpEarned = Math.max(selected.xp - hintPenalty - attemptPenalty, 50)
        setEarnedXp(xpEarned)
        setTotalXp(prev => prev + xpEarned)
        setSolvedIds(prev => [...prev, selected.id])
      } else {
        setEarnedXp(0)
      }
      setScreen("result")
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && e.ctrlKey) handleSubmit()
  }

  const diffLines = () => {
    if (!fixedQuery || !selected) return []
    const original = selected.brokenQuery.split(" ")
    const fixed = fixedQuery.trim().split(" ")
    const maxLen = Math.max(original.length, fixed.length)
    return Array.from({ length: maxLen }, (_, i) => ({
      word: fixed[i] || "",
      changed: fixed[i] !== original[i]
    })).filter(t => t.word !== "")
  }

  const diffExists = fixedQuery.trim() !== selected?.brokenQuery.trim()
  const difficultyColor = { EASY: "#39FF14", MEDIUM: "hotpink", HARD: "#ff4444" }

  // ── MENU ─────────────────────────────────────────────────
  if (screen === "menu") {
    return (
      <div className="ambient-shell ambient-debug" style={s.root}>
        <div className="smoke-layer" />
        <div className="page-inner">
          <button onClick={onBack} style={s.backBtn}>← Back to Arena</button>

        <div style={{ marginBottom: 24 }}>
          <div style={s.logo}>🐛 DEBUG ARENA</div>
          <div style={s.subtitle}>Side Quest · Fix the broken SQL</div>
          <div style={s.xpBadge}>🏅 {totalXp} XP</div>
        </div>

        <div style={s.rulesBox}>
          <div style={s.rulesLabel}>HOW TO PLAY</div>
          <div style={s.rulesText}>
            Each challenge shows you a{" "}
            <span style={{ color: "hotpink" }}>broken SQL query</span>.
            Edit it in the text box to fix the bug and click Submit Fix.
            Fewer attempts + no hint = more XP.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {CHALLENGES.map(c => {
            const solved = solvedIds.includes(c.id)
            return (
              <div key={c.id} style={{ ...s.card, borderColor: solved ? "#39FF14" : "#2a2a2a" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ color: difficultyColor[c.difficulty], fontSize: 10, letterSpacing: 2 }}>
                      {c.difficulty}
                    </span>
                    <div style={{ fontWeight: "bold", fontSize: 15, marginTop: 4 }}>{c.title}</div>
                    <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>{c.description}</div>
                  </div>
                  <span style={{ color: "#39FF14", fontSize: 13, fontWeight: "bold", whiteSpace: "nowrap", marginLeft: 12 }}>
                    {c.xp} XP
                  </span>
                </div>
                <div style={s.brokenPreview}>
                  <span style={{ color: "#555", fontSize: 10, letterSpacing: 1 }}>BROKEN: </span>
                  <span style={{ color: "hotpink", fontSize: 12 }}>{c.brokenQuery}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  {solved && <span style={{ color: "#39FF14", fontSize: 12 }}>✓ SOLVED</span>}
                  <button onClick={() => startChallenge(c)} style={{ ...s.btn, marginLeft: "auto" }}>
                    {solved ? "▶ Retry" : "▶ Fix It"}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
  }

  // ── RESULT ───────────────────────────────────────────────
  if (screen === "result") {
    const hintPenalty = hintUsed ? 25 : 0
    const attemptPenalty = Math.min((attempts - 1) * 10, 50)
    return (
      <div className="ambient-shell ambient-debug" style={s.root}>
        <div className="smoke-layer" />
        <div className="page-inner">
          <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 52 }}>✅</div>
          <div style={s.logo}>BUG SQUASHED!</div>
          {earnedXp > 0
            ? <div style={{ color: "#39FF14", fontSize: 20, marginTop: 8 }}>+{earnedXp} XP</div>
            : <div style={{ color: "#555", fontSize: 14, marginTop: 8 }}>Already solved — no XP awarded</div>
          }
          {hintPenalty > 0 && <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>−{hintPenalty} XP hint penalty</div>}
          {attemptPenalty > 0 && <div style={{ color: "#555", fontSize: 12 }}>−{attemptPenalty} XP attempt penalty</div>}
        </div>

        <div style={s.resultBlock}>
          <div style={s.rulesLabel}>BROKEN</div>
          <code style={{ color: "hotpink", fontSize: 13 }}>{selected.brokenQuery}</code>
        </div>

        <div style={{ textAlign: "center", color: "#39FF14", fontSize: 20, margin: "12px 0" }}>↓</div>

        <div style={{ ...s.resultBlock, borderColor: "#39FF14" }}>
          <div style={s.rulesLabel}>YOUR FIX</div>
          <code style={{ color: "#39FF14", fontSize: 13 }}>{fixedQuery}</code>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
          <button onClick={() => startChallenge(selected)} style={s.btn}>Try Again</button>
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

  // ── GAME ─────────────────────────────────────────────────
  return (
    <div className="ambient-shell ambient-debug" style={s.root}>
      <div className="smoke-layer" />
      <div className="page-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button onClick={() => setScreen("menu")} style={s.backBtn}>← Menu</button>
        <span style={{ color: difficultyColor[selected.difficulty], fontSize: 11, letterSpacing: 2 }}>
          {selected.difficulty} · {selected.xp} XP
        </span>
      </div>

      <div style={s.logo}>{selected.title}</div>
      <div style={{ color: "#aaa", fontSize: 14, margin: "8px 0 20px" }}>{selected.description}</div>

      <div style={s.section}>
        <div style={s.rulesLabel}>BROKEN QUERY</div>
        <div style={s.brokenBox}>{selected.brokenQuery}</div>
      </div>

      <div style={s.section}>
        <div style={s.rulesLabel}>YOUR FIX</div>
        <textarea
          rows={4}
          value={fixedQuery}
          onChange={e => setFixedQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={s.textarea}
          spellCheck={false}
        />
        <div style={{ color: "#333", fontSize: 11, marginTop: 4 }}>Ctrl + Enter to submit</div>
      </div>

      {diffExists && (
        <div style={s.diffBox}>
          <div style={s.rulesLabel}>CHANGES DETECTED</div>
          <div style={{ fontSize: 13, lineHeight: "26px", wordBreak: "break-word" }}>
            {diffLines().map((token, i) => (
              <span key={i} style={{
                color: token.changed ? "#39FF14" : "#555",
                background: token.changed ? "#0a1f0a" : "transparent",
                borderRadius: 3,
                padding: token.changed ? "1px 5px" : "0",
                marginRight: 5,
                fontWeight: token.changed ? "bold" : "normal"
              }}>
                {token.word}
              </span>
            ))}
          </div>
        </div>
      )}

      {feedback && !feedback.correct && (
        <div style={{ ...s.feedbackBox, borderColor: "hotpink", color: "hotpink" }}>
          ❌ {feedback.reason}
        </div>
      )}

      {showHint && (
        <div style={s.hintBox}>
          💡 {selected.hint}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button
          onClick={handleSubmit}
          disabled={!diffExists}
          style={{
            ...s.btn,
            flex: 1,
            opacity: !diffExists ? 0.4 : 1,
            cursor: !diffExists ? "not-allowed" : "pointer"
          }}
        >
          ▶ Submit Fix
        </button>

        {!showHint && (
          <button
            onClick={() => { setShowHint(true); setHintUsed(true) }}
            style={{ ...s.btn, background: "#1a1a1a", border: "1px solid #444", color: "#666", fontSize: 12 }}
          >
            💡 Hint (−25 XP)
          </button>
        )}
      </div>

      {attempts > 0 && (
        <div style={{ color: "#333", fontSize: 11, marginTop: 10, textAlign: "center" }}>
          Attempt {attempts} · Each wrong attempt costs 10 XP
        </div>
      )}
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
  logo: { color: "#39FF14", fontSize: 24, fontWeight: "bold", letterSpacing: 2, marginBottom: 4 },
  subtitle: { color: "#444", fontSize: 12, marginTop: 4 },
  xpBadge: {
    display: "inline-block", marginTop: 10,
    background: "#111", border: "1px solid #39FF14",
    color: "#39FF14", padding: "4px 14px", borderRadius: 20, fontSize: 13
  },
  rulesBox: {
    background: "#0f0f0f", border: "1px solid #1e1e1e",
    borderRadius: 10, padding: "14px 16px", marginBottom: 20
  },
  rulesLabel: { color: "#444", fontSize: 10, letterSpacing: 2, marginBottom: 6 },
  rulesText: { color: "#888", fontSize: 13, lineHeight: 1.7 },
  card: { background: "#111", border: "2px solid", borderRadius: 12, padding: "16px 18px" },
  brokenPreview: { background: "#0d0d0d", borderRadius: 6, padding: "8px 10px", marginTop: 10 },
  btn: {
    padding: "10px 20px", background: "hotpink",
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
  section: { marginBottom: 16 },
  brokenBox: {
    background: "#1a0000", border: "1px solid #3a0000",
    borderRadius: 8, padding: "12px 14px",
    color: "hotpink", fontSize: 14
  },
  textarea: {
    width: "100%", background: "#000",
    color: "#39FF14", border: "1px solid #39FF14",
    borderRadius: 8, padding: "12px 14px",
    fontFamily: "monospace", fontSize: 14,
    outline: "none", resize: "vertical",
    boxSizing: "border-box"
  },
  diffBox: {
    background: "#0a0a0a", border: "1px solid #1e1e1e",
    borderRadius: 8, padding: "12px 14px", marginBottom: 14
  },
  feedbackBox: {
    border: "1px solid", borderRadius: 8,
    padding: "12px 14px", fontSize: 13,
    marginBottom: 14, lineHeight: 1.5
  },
  hintBox: {
    background: "#111", border: "1px solid #333",
    borderRadius: 8, padding: "12px 14px",
    color: "#aaa", fontSize: 13, marginBottom: 14
  },
  resultBlock: {
    background: "#111", border: "1px solid #222",
    borderRadius: 8, padding: "14px 16px", marginBottom: 8
  }
}
