import { useState } from 'react'
import './CyberQuest.css'

const MODULES = [
  {
    id: 'phishing-calls',
    title: 'Phishing Calls',
    summary: 'A beginner mission on fake bank callers asking for OTPs or passwords.',
    points: [
      'Caller claims your account is locked or needs verification',
      'They ask for an OTP, password, or security code',
      'The request is urgent and unexpected'
    ],
    action: [
      'Do not share the OTP or password.',
      'Hang up and call the official bank number from the app.',
      'Remember: real banks never ask you to share secrets over the phone.'
    ],
    example: 'A scammer says your bank account is frozen and asks you to read the OTP. The correct response is to ignore it and verify separately.'
  },
  {
    id: 'fake-upi-requests',
    title: 'Fake UPI Requests',
    summary: 'Learn to spot suspicious payment requests inside UPI apps.',
    points: [
      'Collections from unknown people or odd IDs',
      'Payee name does not match the sender',
      'Messages asking for quick approval or help'
    ],
    action: [
      'Do not approve requests from unknown accounts.',
      'Check the payee name before paying.',
      'Verify with the sender through a trusted channel.'
    ],
    example: 'A request appears claiming to be from a delivery partner. Before approving, confirm with the service’s official app.'
  },
  {
    id: 'otp-scams',
    title: 'OTP Scams',
    summary: 'A quick lesson on why OTPs are private and never to be shared.',
    points: [
      'Unexpected OTPs for actions you did not start',
      'Requests to share OTPs with strangers',
      'Messages saying it is a security check'
    ],
    action: [
      'Treat OTPs like a secret code.',
      'Never share OTPs with callers or chat messages.',
      'If you did not request it, ignore the OTP and close the message.'
    ],
    example: 'Someone asks for your OTP to “fix your account.” The right move is to refuse and log in through the official app instead.'
  },
  {
    id: 'qr-frauds',
    title: 'QR Code Frauds',
    summary: 'A friendly guide to safe QR scanning and avoiding payment traps.',
    points: [
      'QR codes from strangers or unexpected sources',
      'Links asking for login or payment details',
      'Sites promising rewards for scanning a QR code'
    ],
    action: [
      'Only scan QR codes from trusted sources.',
      'Check where the scan leads before approving anything.',
      'Do not enter credentials into unknown pages.'
    ],
    example: 'A QR code promises a reward and asks you to pay a small fee. It’s safer to ignore it and verify the offer separately.'
  }
]

export default function CyberQuest({ onBack }) {
  const [activeModule, setActiveModule] = useState(null)

  function handleMouseMove(event) {
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    target.style.setProperty('--cursor-x', `${x}px`)
    target.style.setProperty('--cursor-y', `${y}px`)
  }

  return (
    <div className="cyber-quest-shell" onMouseMove={handleMouseMove}>
      <div className="smoke-layer" />
      <button className="cyber-quest-back-button" onClick={onBack}>
        ← Back
      </button>

      <div className="cyber-quest-card">
        <div className="cyber-quest-header">
          <div className="cyber-quest-marker">Q</div>
          <h1 className="cyber-quest-title">Cyber Quest</h1>
          <p className="cyber-quest-subtitle">
            Choose one mission below. The in-site mission window will stay clean, beginner-friendly, and easy to read.
          </p>
        </div>

        <div className="cyber-quest-grid">
          <div className="cyber-quest-list">
            {MODULES.map((module) => (
              <button
                key={module.id}
                className={`cyber-quest-mission ${activeModule?.id === module.id ? 'active' : ''}`}
                onClick={() => setActiveModule(module)}
              >
                <h2 className="cyber-quest-mission-title">{module.title}</h2>
                <p className="cyber-quest-mission-text">{module.summary}</p>
              </button>
            ))}
          </div>

          <section className="cyber-quest-window">
            {activeModule ? (
              <>
                <div className="cyber-quest-window-meta">
                  <span className="dot" />
                  <span className="dot orange" />
                  <span className="dot yellow" />
                  <span>Mission console</span>
                </div>
                <h2 className="cyber-quest-window-heading">{activeModule.title}</h2>
                <p className="cyber-quest-window-copy">{activeModule.summary}</p>

                <div className="cyber-quest-block">
                  <h3 className="cyber-quest-block-title">Watch for</h3>
                  <ul className="cyber-quest-block-list">
                    {activeModule.points.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="cyber-quest-block">
                  <h3 className="cyber-quest-block-title">Your response</h3>
                  <ul className="cyber-quest-block-list">
                    {activeModule.action.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="cyber-quest-block">
                  <h3 className="cyber-quest-block-title">Quick example</h3>
                  <p className="cyber-quest-window-copy">{activeModule.example}</p>
                </div>

                <button className="cyber-quest-button" onClick={() => setActiveModule(null)}>
                  Choose a different mission
                </button>
              </>
            ) : (
              <div className="cyber-quest-empty">
                <h2>Mission window</h2>
                <p>
                  Select a mission to open a streamlined beginner briefing with just the key points and examples.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
