function Home({ onPlay, user, username, onLogin, onLogout }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(29,185,84,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Si está logueado, mostrar nombre arriba a la derecha */}
      {user && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 100, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Hola, <span style={{ color: 'var(--text)', fontWeight: '700' }}>{username}</span>
          </span>
          <button
            onClick={onLogout}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '10px 16px',
              color: 'var(--text)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#ff4444'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            Cerrar sesión
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <p style={{
          color: 'var(--green)',
          fontSize: '12px',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          Retos del género urbano
        </p>

        <h1 style={{
          fontSize: 'clamp(52px, 10vw, 96px)',
          fontWeight: '800',
          lineHeight: '1',
          marginBottom: '8px',
          letterSpacing: '-2px'
        }}>
          Urban
        </h1>
        <h1 style={{
          fontSize: 'clamp(52px, 10vw, 96px)',
          fontWeight: '800',
          lineHeight: '1',
          marginBottom: '32px',
          letterSpacing: '-2px',
          color: 'var(--green)'
        }}>
          Check
        </h1>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '18px',
          marginBottom: '40px',
          maxWidth: '400px',
          lineHeight: '1.6'
        }}>
          ¿Cuánto sabes de música urbana? Demuéstralo.
        </p>

        <button
          onClick={onPlay}
          style={{
            background: 'var(--green)',
            color: '#000',
            border: 'none',
            borderRadius: '50px',
            padding: '18px 56px',
            fontSize: '17px',
            fontWeight: '700',
            fontFamily: 'DM Sans, sans-serif',
            cursor: 'pointer',
            letterSpacing: '0.5px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(29,185,84,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Jugar ahora
        </button>

        {/* Botón login solo si no está logueado */}
        {!user && (
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={onLogin}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '50px',
                padding: '12px 32px',
                color: 'var(--text-muted)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--green)'
                e.currentTarget.style.color = 'var(--text)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              Inicia sesión para el ranking
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home