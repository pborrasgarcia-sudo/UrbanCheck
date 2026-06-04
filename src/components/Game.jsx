import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase.js'

const artistPhrases = {
  'Feid': [
    'Mor, ¿eres un verdadero fan?',
    '¿Realmente conoces al FERXXO?',
    'Mientras lo haces, ¿Feid o Ferxxo?',
    'Que chimba morrr',
    '¿Eres un verdadero fan del FERXXO?'
  ],
  'Bad Bunny': [
    '¿Eres un fan real del artista más escuchado del mundo?',
    '¿Eres un fan real del conejo malo?',
    '¿Cuánto sabes del artista número 1 del mundo?',
    'Conseguiste entrada para el concierto...???'
  ],
  'Mora': [
    '¿Entendiste paraíso o todavía no?',
    '¿Cuánto sabes de nuestra fruta favorita?',
    '¿Eres un fan real o solo te sabes Memorias?'
  ],
  'Quevedo': [
    '¿Qué tan fan eres del baifo?',
    '¿Cuánto sabes de Quevedo?',
    '¿Te consideras el mayor fan de Quevedo?'
  ],
  'Myke Towers': [
    '¿Qué tan fan eres de la pantera negra?',
    '¿Cuánto sabes de Myke Towers?',
    '¿Eres de los mayores fans de Myke?'
  ]
}

const artistImages = {
  'Feid': '/feid.jpg',
  'Bad Bunny': '/badbunny.jpg',
  'Mora': '/mora.jpg',
  'Quevedo': '/quevedo.jpg',
  'Myke Towers': '/myketowers.jpg'
}

function Game({ artist, mode, nickname, onGameOver, onBack }) {
  const [canciones, setCanciones] = useState([])
  const [cancionActual, setCancionActual] = useState(null)
  const [input, setInput] = useState('')
  const [sugerencias, setSugerencias] = useState([])
  const [racha, setRacha] = useState(0)
  const [tiempoTotal, setTiempoTotal] = useState(mode === 'easy' ? 90 : 60)
  const [feedback, setFeedback] = useState(null)
  const [usadas, setUsadas] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [showPenalty, setShowPenalty] = useState(false)
  const [showBonus, setShowBonus] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const audioRef = useRef(null)
  const timerRef = useRef(null)
  const rachaRef = useRef(0)
  const tiempoRef = useRef(mode === 'easy' ? 90 : 60)
  const usadasRef = useRef([])
  const cancionesRef = useRef([])
  const cancionActualRef = useRef(null)
  const timerStarted = useRef(false)

  const [frase] = useState(() => {
    const frases = artistPhrases[artist.name] || ['¿Eres un verdadero fan?']
    return frases[Math.floor(Math.random() * frases.length)]
  })

  useEffect(() => {
    async function cargarCanciones() {
      const { data, error } = await supabase
        .from('canciones')
        .select('*')
        .or(`"Artista".eq."${artist.name}","Artista".ilike."${artist.name} &%","Artista".ilike."${artist.name},%"`)
      if (error) { console.error('Error:', error); return }
      const conId = data.filter(c => c.Deezer_ID && c.Deezer_ID !== 'null')
      setCanciones(conId)
      cancionesRef.current = conId
    }
    cargarCanciones()
  }, [])

  useEffect(() => {
    if (canciones.length > 0) {
      siguienteCancion(canciones, [])
      setTimeout(() => {
        setGameStarted(true)
        iniciarTimer()
      }, 2000)
    }
  }, [canciones])

  function iniciarTimer() {
    if (timerStarted.current) return
    timerStarted.current = true
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      tiempoRef.current -= 1
      setTiempoTotal(tiempoRef.current)
      if (tiempoRef.current <= 0) {
        clearInterval(timerRef.current)
        onGameOver(rachaRef.current, cancionActualRef.current)
      }
    }, 1000)
  }

  async function siguienteCancion(lista, yaUsadas) {
    const disponibles = lista.filter(c => !yaUsadas.includes(c.id))
    if (disponibles.length === 0) { onGameOver(rachaRef.current, null); return }
    const random = disponibles[Math.floor(Math.random() * disponibles.length)]
    const idEsperado = random.id
    cancionActualRef.current = random
    setCancionActual(random)
    setInput('')
    setSugerencias([])
    setFeedback(null)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    try {
      const res = await fetch(`/api/preview?id=${random.Deezer_ID}`)
      const trackData = await res.json()
      if (trackData.preview && audioRef.current && cancionActualRef.current?.id === idEsperado) {
        audioRef.current.src = trackData.preview
        try {
          await audioRef.current.play()
        } catch (playErr) {
          console.warn('Autoplay bloqueado:', playErr)
        }
      } else if (!trackData.preview) {
        const nuevasUsadas = [...yaUsadas, random.id]
        usadasRef.current = nuevasUsadas
        setUsadas(nuevasUsadas)
        siguienteCancion(lista, nuevasUsadas)
      }
    } catch (err) {
      console.error('Error fetch:', err)
      const nuevasUsadas = [...yaUsadas, random.id]
      usadasRef.current = nuevasUsadas
      setUsadas(nuevasUsadas)
      siguienteCancion(lista, nuevasUsadas)
    }
  }

  function normalizar(texto) {
    return texto.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  function handleInput(valor) {
    setInput(valor)
    if (valor.length >= 1) {
      const filtradas = canciones.filter(c =>
        normalizar(c.Cancion).includes(normalizar(valor))
      )
      setSugerencias(filtradas.slice(0, 6))
    } else {
      setSugerencias([])
    }
  }

  function handleRespuesta(cancion) {
    setInput(cancion.Cancion)
    setSugerencias([])
    if (
      normalizar(cancion.Cancion).trim() === normalizar(cancionActualRef.current.Cancion).trim() ||
      cancion.Deezer_ID === cancionActualRef.current.Deezer_ID
    ) {
      setFeedback('correct')
      const nuevaRacha = rachaRef.current + 1
      rachaRef.current = nuevaRacha
      setRacha(nuevaRacha)
      tiempoRef.current = Math.min(mode === 'easy' ? 90 : 60, tiempoRef.current + 3)
      setTiempoTotal(tiempoRef.current)
      setShowBonus(true)
      setTimeout(() => setShowBonus(false), 1000)
      const nuevasUsadas = [...usadasRef.current, cancionActualRef.current.id]
      usadasRef.current = nuevasUsadas
      setUsadas(nuevasUsadas)
      setTimeout(() => siguienteCancion(cancionesRef.current, nuevasUsadas), 1500)
    } else {
      handleFallo()
    }
  }

  function handleFallo() {
    setFeedback('wrong')
    if (mode === 'hard') {
      tiempoRef.current = Math.max(0, tiempoRef.current - 5)
      setTiempoTotal(tiempoRef.current)
      setShowPenalty(true)
      setTimeout(() => setShowPenalty(false), 1000)
      if (tiempoRef.current <= 0) {
        clearInterval(timerRef.current)
        setTimeout(() => onGameOver(rachaRef.current, cancionActualRef.current), 1000)
        return
      }
    }
    const nuevasUsadas = [...usadasRef.current, cancionActualRef.current.id]
    usadasRef.current = nuevasUsadas
    setUsadas(nuevasUsadas)
    setTimeout(() => siguienteCancion(cancionesRef.current, nuevasUsadas), 1500)
  }

  if (!cancionActual) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)',
      fontSize: '16px',
      gap: '16px'
    }}>
      <p style={{ fontSize: '32px' }}>🎵</p>
      <p style={{ fontWeight: '700', fontSize: '18px', color: 'var(--text)' }}>Preparando el juego...</p>
      <p style={{ fontSize: '14px' }}>Cargando canciones</p>
    </div>
  )

  const tiempoColor = tiempoTotal <= 10 ? '#ff4444' : tiempoTotal <= 20 ? '#ffaa00' : 'var(--text)'

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative'
    }}>
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {!gameStarted && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300
        }}>
          <p style={{
            fontSize: '72px',
            fontWeight: '900',
            color: 'var(--green)',
            lineHeight: '1',
            letterSpacing: '-2px',
            animation: 'popIn 0.4s ease'
          }}>
            ¡Listos!
          </p>
        </div>
      )}

      <button
        onClick={() => setShowConfirm(true)}
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

      {showConfirm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '360px',
            width: '90%',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '32px', marginBottom: '16px' }}>⚠️</p>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>¿Seguro que quieres salir?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px' }}>
              Perderás tu racha de <span style={{ color: 'var(--green)', fontWeight: '700' }}>{racha}</span> canciones
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '14px',
                  color: 'var(--text)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Seguir jugando
              </button>
              <button
                onClick={() => { clearInterval(timerRef.current); onBack() }}
                style={{
                  flex: 1,
                  background: '#ff4444',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px',
                  color: '#fff',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}

      <p style={{
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '20px',
        textAlign: 'center',
        maxWidth: '480px'
      }}>
        {frase}
      </p>

      <div style={{
        width: '200px',
        height: '200px',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '32px',
        border: '2px solid var(--border)'
      }}>
        <img
          src={artistImages[artist.name]}
          alt={artist.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '12px 24px',
          textAlign: 'center',
          width: '120px'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>Racha</p>
          <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--green)' }}>{racha}</p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: `1px solid ${tiempoTotal <= 10 ? '#ff4444' : 'var(--border)'}`,
          borderRadius: '12px',
          padding: '12px 24px',
          textAlign: 'center',
          transition: 'border-color 0.3s',
          width: '120px'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>Tiempo</p>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: '28px', fontWeight: '800', color: tiempoColor, transition: 'color 0.3s' }}>{tiempoTotal}s</p>
            {showPenalty && (
              <span style={{
                position: 'absolute',
                right: '-28px',
                fontSize: '14px',
                fontWeight: '800',
                color: '#ff4444',
                animation: 'fadeUp 1s ease forwards'
              }}>-5</span>
            )}
            {showBonus && (
              <span style={{
                position: 'absolute',
                right: '-28px',
                fontSize: '14px',
                fontWeight: '800',
                color: 'var(--green)',
                animation: 'fadeUp 1s ease forwards'
              }}>+3</span>
            )}
          </div>
        </div>
      </div>

      <audio ref={audioRef} />

      {feedback === 'correct' && (
        <div style={{
          background: 'rgba(29,185,84,0.15)',
          border: '1px solid var(--green)',
          borderRadius: '12px',
          padding: '16px 32px',
          marginBottom: '32px',
          color: 'var(--green)',
          fontWeight: '700',
          fontSize: '18px'
        }}>
          ✓ ¡Correcto!
        </div>
      )}
      {feedback === 'wrong' && (
        <div style={{
          background: 'rgba(255,68,68,0.15)',
          border: '1px solid #ff4444',
          borderRadius: '12px',
          padding: '16px 32px',
          marginBottom: '32px',
          color: '#ff4444',
          fontWeight: '700',
          fontSize: '18px',
          textAlign: 'center'
        }}>
          ✗ Era: {cancionActual.Cancion}
        </div>
      )}

      {!feedback && (
        <div style={{ width: '100%', maxWidth: '480px', position: 'relative' }}>
          <input
            type="text"
            placeholder="¿Qué canción es?"
            value={input}
            onChange={e => handleInput(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              background: 'var(--bg-card)',
              border: '1px solid var(--green)',
              borderRadius: '12px',
              padding: '18px 20px',
              color: 'var(--text)',
              fontSize: '16px',
              fontFamily: 'DM Sans, sans-serif',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {sugerencias.length > 0 && (
            <ul style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              marginTop: '8px',
              listStyle: 'none',
              overflow: 'hidden',
              zIndex: 10
            }}>
              {sugerencias.map(c => (
                <li
                  key={c.id}
                  onClick={() => handleRespuesta(c)}
                  style={{
                    padding: '14px 20px',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontWeight: '600' }}>{c.Cancion}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px', marginLeft: '8px' }}>
                    — {c.Artista}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default Game