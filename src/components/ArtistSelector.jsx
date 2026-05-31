import { useState } from 'react'

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

function GameSelector({ onSelect, onBack }) {
  const games = [
    { id: 'fan', name: '¿Qué tan fan eres?', description: 'Adivina canciones y haz la mejor racha', emoji: '🎵', available: true },
    { id: 'coming1', name: 'Próximamente', description: 'Nuevo reto en camino...', emoji: '🔒', available: false },
    { id: 'coming2', name: 'Próximamente', description: 'Nuevo reto en camino...', emoji: '🔒', available: false },
  ]

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

      <p style={{ color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
        UrbanCheck
      </p>
      <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '48px' }}>
        Elige tu reto
      </h1>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {games.map(game => (
          <div
            key={game.id}
            onClick={() => game.available && onSelect(game.id)}
            style={{
              cursor: game.available ? 'pointer' : 'not-allowed',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '32px',
              width: '300px',
              opacity: game.available ? 1 : 0.5,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              if (game.available) {
                e.currentTarget.style.borderColor = 'var(--green)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(29,185,84,0.2)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>{game.emoji}</p>
            <p style={{ fontWeight: '800', fontSize: '18px', marginBottom: '8px' }}>{game.name}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ArtistSelector({ onSelect, onBack }) {
  const [screen, setScreen] = useState('games')

  const artists = [
    { id: 1166311, name: 'Bad Bunny', platform: 'deezer', image: '/badbunny.jpg' },
    { id: 10583405, name: 'Feid', platform: 'deezer', image: '/feid.jpg' },
    { id: 3922661, name: 'Mora', platform: 'deezer', image: '/mora.jpg' },
    { id: 6705223, name: 'Quevedo', platform: 'deezer', image: '/quevedo.jpg'},
    { id: 12029862, name: 'Myke Towers', platform: 'deezer', image: '/myketowers.jpg'}
]

  if (screen === 'games') {
    return <GameSelector onSelect={() => setScreen('artists')} onBack={onBack} />
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
      <BackButton onClick={() => setScreen('games')} />

      <p style={{ color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
        ¿Qué tan fan eres?
      </p>
      <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '8px' }}>
        Elige un artista
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '60px', fontSize: '16px' }}>
        Demuestra que eres un fan de verdad
      </p>

     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 200px)', gap: '24px', justifyContent: 'center' }}>
        {artists.map(artist => (
          <div
            key={artist.id}
            onClick={() => onSelect(artist)}
            style={{
              cursor: 'pointer',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              overflow: 'hidden',
              width: '200px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)'
              e.currentTarget.style.borderColor = 'var(--green)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(29,185,84,0.2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <img
              src={artist.image}
              alt={artist.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ padding: '16px' }}>
              <p style={{ fontWeight: '700', fontSize: '18px' }}>{artist.name}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Urban / Reggaeton</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ArtistSelector