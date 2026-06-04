module.exports = async function handler(req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'ID requerido' })
  }

  try {
    const response = await fetch(`https://api.deezer.com/track/${id}`)
    const data = await response.json()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: 'Error fetching track' })
  }
}