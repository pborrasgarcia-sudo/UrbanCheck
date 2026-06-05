module.exports = async function handler(req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'ID requerido' })
  }

  try {
    const response = await fetch(`https://api.deezer.com/track/${id}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    const data = await response.json()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}