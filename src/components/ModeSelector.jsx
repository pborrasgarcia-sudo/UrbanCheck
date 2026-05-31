function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
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
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s',
        zIndex: 100
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--green)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      ← Volver
    </button>
  )
}

function ModeSelector({ onSelect, onBack, artist, user, onLogin }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <BackButton onClick={onBack} />

      {!user && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          zIndex: 100,
          whiteSpace: 'nowrap'
        }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            🏆 Inicia sesión para aparecer en el ranking
          </span>
          <button
            onClick={onLogin}
            style={{
              background: 'var(--green)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#000',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Entrar
          </button>
        </div>
      )}

      <p style={{ color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
        {artist?.name || 'Artista'}
      </p>
      <h1 style={{ fontSize: '38px', fontWeight: '800', marginBottom: '8px', textAlign: 'center' }}>
        ¿Eres un verdadero fan de {artist?.name}?
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '60px', fontSize: '16px' }}>
        Elige cómo quieres demostrarlo
      </p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div
          onClick={() => onSelect('easy')}
          style={{
            cursor: 'pointer',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '32px',
            width: '300px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--green)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(29,185,84,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>✅</p>
          <p style={{ fontWeight: '800', fontSize: '22px', marginBottom: '12px' }}>Fácil</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '2' }}>
            · 90 segundos<br/>
            · Cada acierto <span style={{ color: 'var(--green)', fontWeight: '700' }}>+3s</span>
          </p>
        </div>

        <div
          onClick={() => onSelect('hard')}
          style={{
            cursor: 'pointer',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '32px',
            width: '300px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--green)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(29,185,84,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔥</p>
          <p style={{ fontWeight: '800', fontSize: '22px', marginBottom: '12px' }}>Difícil</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '2' }}>
            · 60 segundos<br/>
            · Cada acierto <span style={{ color: 'var(--green)', fontWeight: '700' }}>+3s</span><br/>
            · Cada fallo <span style={{ color: '#ff4444', fontWeight: '700' }}>-5s</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ModeSelector