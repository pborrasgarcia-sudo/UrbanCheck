import { useState } from 'react'

function NicknameInput({ onSubmit }) {
  const [name, setName] = useState('')

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
        Ranking global
      </p>
      <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '8px' }}>
        ¿Cómo te llamas?
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '48px', fontSize: '16px' }}>
        Tu nombre aparecerá en el ranking global
      </p>

      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input
          type="text"
          placeholder="Tu apodo..."
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={20}
          onKeyDown={e => e.key === 'Enter' && name.trim() && onSubmit(name.trim())}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '16px 20px',
            color: 'var(--text)',
            fontSize: '16px',
            fontFamily: 'DM Sans, sans-serif',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={e => e.target.style.borderColor = 'var(--green)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
          autoFocus
        />
        <button
          onClick={() => name.trim() && onSubmit(name.trim())}
          disabled={!name.trim()}
          style={{
            background: name.trim() ? 'var(--green)' : 'var(--bg-card)',
            color: name.trim() ? '#000' : 'var(--text-muted)',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '700',
            fontFamily: 'DM Sans, sans-serif',
            cursor: name.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s'
          }}
        >
          Jugar →
        </button>
      </div>
    </div>
  )
}

export default NicknameInput