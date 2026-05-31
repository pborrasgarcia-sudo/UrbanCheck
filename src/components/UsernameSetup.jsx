import { useState } from 'react'
import { supabase } from '../supabase.js'

function UsernameSetup({ onComplete }) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!username.trim()) return
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('perfiles')
      .insert({ id: user.id, username: username.trim() })

    if (error) {
      if (error.code === '23505') {
        setError('Ese nombre ya está en uso, elige otro')
      } else {
        setError('Error al guardar el nombre')
      }
      setLoading(false)
      return
    }

    onComplete(username.trim())
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
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
        Un último paso
      </p>
      <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>
        Elige tu nombre
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '48px', fontSize: '16px', textAlign: 'center' }}>
        Este nombre aparecerá en el ranking global para siempre
      </p>

      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input
          type="text"
          placeholder="Tu nombre de usuario..."
          value={username}
          onChange={e => setUsername(e.target.value)}
          maxLength={20}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{
            background: 'var(--bg-card)',
            border: `1px solid ${error ? '#ff4444' : 'var(--border)'}`,
            borderRadius: '12px',
            padding: '16px 20px',
            color: 'var(--text)',
            fontSize: '16px',
            fontFamily: 'DM Sans, sans-serif',
            outline: 'none'
          }}
          onFocus={e => e.target.style.borderColor = 'var(--green)'}
          onBlur={e => e.target.style.borderColor = error ? '#ff4444' : 'var(--border)'}
          autoFocus
        />
        {error && <p style={{ color: '#ff4444', fontSize: '14px', margin: '0' }}>{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={!username.trim() || loading}
          style={{
            background: username.trim() && !loading ? 'var(--green)' : 'var(--bg-card)',
            color: username.trim() && !loading ? '#000' : 'var(--text-muted)',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '700',
            fontFamily: 'DM Sans, sans-serif',
            cursor: username.trim() && !loading ? 'pointer' : 'not-allowed'
          }}
        >
          {loading ? 'Guardando...' : 'Listo →'}
        </button>
      </div>
    </div>
  )
}

export default UsernameSetup