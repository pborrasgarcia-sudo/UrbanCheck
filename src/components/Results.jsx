import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase.js'

function Results({ score, nickname, mode, onRestart, user, onLogin, ultimaCancion, artist }) {
    const [ranking, setRanking] = useState([])
  const guardado = useRef(false)

  useEffect(() => {
    if (!guardado.current) {
      guardado.current = true
      guardarYCargarRanking()
    }
  }, [])

  async function guardarYCargarRanking() {
    if (user) {
      await supabase.from('ranking').insert({
  nickname,
  score,
  mode,
  artista: artist,
  fecha: new Date().toISOString(),
  user_id: user.id
})
    }

    const { data } = await supabase
  .from('ranking')
  .select('*')
  .eq('mode', mode)
  .eq('artista', artist)
  .order('score', { ascending: false })
  .limit(15)

    if (data) setRanking(data)
  }

  const modeLabel = mode === 'easy' ? 'Fácil' : 'Difícil'

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
        Juego terminado
      </p>
      <h1 style={{ fontSize: '52px', fontWeight: '800', marginBottom: '4px' }}>
        {score}
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '16px' }}>
        Canciones Acertadas — Modo {modeLabel}
      </p>

      {ultimaCancion && (
        <div style={{
          background: 'rgba(255,68,68,0.1)',
          border: '1px solid #ff4444',
          borderRadius: '12px',
          padding: '12px 24px',
          marginBottom: '24px',
          color: '#ff4444',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          La última canción era: <span style={{ fontWeight: '700' }}>{ultimaCancion.Cancion}</span>
        </div>
      )}

      {!user && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '14px 24px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
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

      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '32px'
      }}>
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>🏆</span>
          <span style={{ fontWeight: '700', fontSize: '15px' }}>Top 15 · {artist} · {modeLabel}</span>
        </div>

        {ranking.map((entry, index) => {
          const isMe = entry.nickname === nickname && entry.score === score
          return (
            <div
              key={index}
              style={{
                padding: '14px 24px',
                borderBottom: index < ranking.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: isMe ? 'rgba(29,185,84,0.08)' : 'transparent'
              }}
            >
              <span style={{
                width: '24px',
                fontWeight: '800',
                fontSize: '14px',
                color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--text-muted)'
              }}>
                {index + 1}
              </span>
              <span style={{ flex: 1, fontWeight: isMe ? '700' : '400' }}>
                {entry.nickname} {isMe ? '← tú' : ''}
              </span>
              <span style={{ fontWeight: '700', color: isMe ? 'var(--green)' : 'var(--text)' }}>
                {entry.score}
              </span>
            </div>
          )
        })}
      </div>

      <button
        onClick={onRestart}
        style={{
          background: 'var(--green)',
          color: '#000',
          border: 'none',
          borderRadius: '12px',
          padding: '16px 48px',
          fontSize: '16px',
          fontWeight: '700',
          fontFamily: 'DM Sans, sans-serif',
          cursor: 'pointer'
        }}
      >
        Volver a jugar
      </button>
    </div>
  )
}

export default Results