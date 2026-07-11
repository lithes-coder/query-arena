import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase.js'
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('email') // 'email', 'otp-verify'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [toast, setToast] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        navigate('/', { replace: true })
      }
    }
    checkSession()
  }, [navigate])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  async function sendOTP() {
    if (!email.trim()) {
      setToast({ type: 'error', message: 'Email is required.' })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { shouldCreateUser: true }
      })
      
      if (error) {
        setToast({ type: 'error', message: error.message })
        return
      }
      
      setMode('otp-verify')
      setResendCooldown(30)
      setToast({ type: 'success', message: `OTP sent to ${email}. Check your email!` })
    } catch (error) {
      setToast({ type: 'error', message: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  async function verifyOTP() {
    if (!otp.trim() || otp.length !== 6) {
      setToast({ type: 'error', message: 'Please enter the 6-digit OTP code.' })
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: 'email'
      })

      if (error) {
        setToast({ type: 'error', message: 'Invalid OTP. Please try again.' })
        return
      }

      const isNewUser = !data.user?.user_metadata?.full_name
      
      if (isNewUser) {
        navigate('/complete-profile', { replace: true })
      } else {
        setToast({ type: 'success', message: 'Welcome back!' })
        setTimeout(() => navigate('/', { replace: true }), 500)
      }
    } catch (error) {
      setToast({ type: 'error', message: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  async function resendOTP() {
    if (resendCooldown > 0) return
    
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { shouldCreateUser: true }
      })
      
      if (error) {
        setToast({ type: 'error', message: error.message })
      } else {
        setResendCooldown(30)
        setToast({ type: 'success', message: 'OTP resent! Check your email.' })
      }
    } catch (error) {
      setToast({ type: 'error', message: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleOAuth(provider) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) setToast({ type: 'error', message: error.message })
  }

  return (
    <div
      className="ambient-shell"
      style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}
      onMouseMove={(event) => {
        const shell = event.currentTarget
        const rect = shell.getBoundingClientRect()
        shell.style.setProperty('--cursor-x', `${event.clientX - rect.left}px`)
        shell.style.setProperty('--cursor-y', `${event.clientY - rect.top}px`)
      }}
    >
      <div className="smoke-layer" />
      <div style={{
        width: 'min(480px, 100%)',
        padding: '36px 32px',
        borderRadius: 28,
        background: 'rgba(8, 8, 10, 0.96)',
        border: '1px solid rgba(57, 255, 20, 0.22)',
        boxShadow: '0 0 45px rgba(57, 255, 20, 0.12)',
        fontFamily: 'monospace',
        color: '#eee'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ color: '#39FF14', fontSize: 44, letterSpacing: '0.24em', marginBottom: 10 }}>QUERY ARENA</div>
          <div style={{ color: '#ccc', fontSize: 14 }}>Master SQL Through Interactive Challenges</div>
        </div>

        {mode === 'email' && (
          <>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, color: '#99ff90' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="you@example.com"
                onKeyDown={(e) => e.key === 'Enter' && sendOTP()}
              />
            </div>

            <button
              type="button"
              onClick={sendOTP}
              disabled={isLoading || !email.trim()}
              style={{
                width: '100%',
                padding: '16px 0',
                borderRadius: 14,
                border: 'none',
                background: isLoading || !email.trim() ? '#333' : '#39FF14',
                color: '#050505',
                fontWeight: 700,
                fontSize: 16,
                cursor: isLoading || !email.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Sending...' : 'Send OTP Code'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ color: '#666', fontSize: 13 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <button type="button" onClick={() => handleOAuth("google")} style={{...oauthButtonStyle, display: "flex", alignItems: "center", justifyContent: "center", gap: "12px"}}>
                <FcGoogle size={22} /> Continue with Google
              </button>
              <button type="button" onClick={() => handleOAuth("github")} style={{...oauthButtonStyle, display: "flex", alignItems: "center", justifyContent: "center", gap: "12px"}}>
                <FaGithub size={22} /> Continue with GitHub
              </button>
            </div>
          </>
        )}

        {mode === 'otp-verify' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ color: '#ccc', marginBottom: 8 }}>Enter the 6-digit code sent to</div>
              <div style={{ color: '#39FF14', fontWeight: 700, fontSize: 16 }}>{email}</div>
            </div>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              style={{...inputStyle, textAlign: 'center', fontSize: 28, letterSpacing: '0.3em', padding: '20px 16px'}}
              placeholder="000000"
              maxLength={6}
              inputMode="numeric"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && verifyOTP()}
            />

            <button
              type="button"
              onClick={verifyOTP}
              disabled={isLoading || otp.length !== 6}
              style={{
                width: '100%',
                padding: '16px 0',
                borderRadius: 14,
                border: 'none',
                background: isLoading || otp.length !== 6 ? '#333' : '#39FF14',
                color: '#050505',
                fontWeight: 700,
                fontSize: 16,
                cursor: isLoading || otp.length !== 6 ? 'not-allowed' : 'pointer',
                marginTop: 20,
                marginBottom: 12
              }}
            >
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={resendOTP}
                disabled={isLoading || resendCooldown > 0}
                style={{
                  flex: 1,
                  padding: '14px 0',
                  borderRadius: 14,
                  border: '1px solid rgba(57,255,20,0.24)',
                  background: 'transparent',
                  color: resendCooldown > 0 ? '#555' : '#39FF14',
                  cursor: resendCooldown > 0 || isLoading ? 'not-allowed' : 'pointer',
                  fontSize: 14
                }}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
              </button>

              <button
                type="button"
                onClick={() => { setMode('email'); setOtp(''); }}
                style={{
                  flex: 1,
                  padding: '14px 0',
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: '#111',
                  color: '#aaa',
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                Change Email
              </button>
            </div>
          </>
        )}
      </div>

      {/* REMOVED: <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} /> */}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '16px 18px',
  borderRadius: 14,
  border: '1px solid rgba(57,255,20,0.18)',
  background: '#0b0b0b',
  color: '#f1f1f1',
  fontFamily: 'monospace',
  outline: 'none',
  fontSize: 16
}

const oauthButtonStyle = {
  width: '100%',
  padding: '14px 0',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.08)',
  background: '#111',
  color: '#fff',
  cursor: 'pointer'
}
