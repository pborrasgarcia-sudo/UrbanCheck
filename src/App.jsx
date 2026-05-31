import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import Home from './components/Home'
import AuthScreen from './components/Auth'
import UsernameSetup from './components/UsernameSetup'
import ArtistSelector from './components/ArtistSelector'
import ModeSelector from './components/ModeSelector'
import NicknameInput from './components/NicknameInput'
import Game from './components/Game'
import Results from './components/Results'

function App() {
  const [screen, setScreen] = useState('home')
  const [artist, setArtist] = useState(null)
  const [mode, setMode] = useState(null)
  const [finalScore, setFinalScore] = useState(0)
  const [ultimaCancion, setUltimaCancion] = useState(null)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Comprobar sesión al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) cargarUsername(session.user.id)
      else setLoading(false)
    })

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) cargarUsername(session.user.id)
      else { setUsername(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function cargarUsername(userId) {
    const { data } = await supabase
      .from('perfiles')
      .select('username')
      .eq('id', userId)
      .single()
    setUsername(data?.username ?? null)
    setLoading(false)
  }

  const handleArtistSelect = (selectedArtist) => {
    setArtist(selectedArtist)
    setScreen('mode')
  }

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode)
    // Si no está logueado, ir a nickname temporal
    // Si está logueado, ir directo al juego
    if (user && username) {
      setScreen('game')
    } else if (!user) {
      setScreen('nickname')
    } else {
      setScreen('username-setup')
    }
  }

  const handleGameOver = (score, ultimaCancion) => {
  setFinalScore(score)
  setUltimaCancion(ultimaCancion)
  setScreen('results')
}

  const handleRestart = () => {
    setScreen('home')
    setArtist(null)
    setMode(null)
    setFinalScore(0)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setScreen('home')
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)'
    }}>
      Cargando...
    </div>
  )

  // Si está logueado pero no tiene username, ir a setup
  if (user && !username && screen !== 'username-setup') {
    return <UsernameSetup onComplete={(name) => setUsername(name)} />
  }

  return (
    <div>
      {screen === 'home' && (
        <Home
          onPlay={() => setScreen('artist')}
          user={user}
          username={username}
          onLogin={() => setScreen('auth')}
          onLogout={handleLogout}
        />
      )}
      {screen === 'auth' && <AuthScreen onBack={() => setScreen('home')} />}
      {screen === 'username-setup' && (
        <UsernameSetup onComplete={(name) => { setUsername(name); setScreen('home') }} />
      )}
      {screen === 'artist' && (
        <ArtistSelector onSelect={handleArtistSelect} onBack={() => setScreen('home')} />
      )}
      {screen === 'mode' && (
  <ModeSelector
    onSelect={handleModeSelect}
    onBack={() => setScreen('artist')}
    artist={artist}
    user={user}
    onLogin={() => setScreen('auth')}
  />
)}
      {screen === 'nickname' && (
        <NicknameInput onSubmit={() => setScreen('game')} onBack={() => setScreen('mode')} />
      )}
      {screen === 'game' && (
        <Game
          artist={artist}
          mode={mode}
          nickname={username || 'Anónimo'}
          onGameOver={handleGameOver}
          onBack={() => setScreen('mode')}
        />
      )}
      {screen === 'results' && (
  <Results
    score={finalScore}
    nickname={username || 'Anónimo'}
    mode={mode}
    artist={artist?.name}
    onRestart={handleRestart}
    user={user}
    onLogin={() => setScreen('auth')}
    ultimaCancion={ultimaCancion}
  />
)}
    </div>
  )
}

export default App