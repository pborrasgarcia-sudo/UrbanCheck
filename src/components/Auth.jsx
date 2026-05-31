import { useState } from 'react'
import { supabase } from '../supabase.js'

function AuthScreen({ onBack }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  async function handleSubmit() {
    setError('')
    setSuccess('')
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Email o contraseña incorrectos')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError('Error al crear la cuenta: ' + error.message)
      else setSuccess('¡Cuenta creada! Revisa tu email para confirmarla.')
    }
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px 20px',
    color: 'var(--text)',
    fontSize: '16px',
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    boxSizing: 'border-box'
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <button
        onClick={onBack}
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '10px 16px',
          color: 'var(--text)',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          zIndex: 100
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--green)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        ← Volver
      </button>

      <p style={{ color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
        UrbanCheck
      </p>
      <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>
        {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '16px', textAlign: 'center' }}>
        {mode === 'login' ? 'Bienvenido de nuevo' : 'Únete al ranking global'}
      </p>

      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Google */}
        <button
          onClick={handleGoogle}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '14px',
            color: 'var(--text)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--green)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <span>G</span> Continuar con Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>o</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'var(--green)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'var(--green)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />

        {error && <p style={{ color: '#ff4444', fontSize: '14px', margin: 0 }}>{error}</p>}
        {success && <p style={{ color: 'var(--green)', fontSize: '14px', margin: 0 }}>{success}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          style={{
            background: email && password && !loading ? 'var(--green)' : 'var(--bg-card)',
            color: email && password && !loading ? '#000' : 'var(--text-muted)',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '700',
            fontFamily: 'DM Sans, sans-serif',
            cursor: email && password && !loading ? 'pointer' : 'not-allowed'
          }}
        >
          {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </button>

        <button
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess('') }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  )
}

export default AuthScreen