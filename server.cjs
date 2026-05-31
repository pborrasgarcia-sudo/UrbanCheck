const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

app.get('/preview/:id', async (req, res) => {
  try {
    const response = await fetch(`https://api.deezer.com/track/${req.params.id}`)
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Error fetching track' })
  }
})

app.listen(3001, () => {
  console.log('Proxy server running on port 3001')
})