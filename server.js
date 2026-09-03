
// server.js
const express = require('express')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/movie/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'details.html'))
})

app.get('/tv/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'details.html'))
})

app.get('/watch/:type/:id{/:season}{/:episode}', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'watch.html'))
})

app.get('/api/trending/:type', async (req, res) => {
    try {
        const type = req.params.type || 'movie'
        const response = await fetch(`${TMDB_BASE_URL}/trending/${type}/week?api_key=${TMDB_API_KEY}`)
        const data = await response.json()
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch trending data' })
    }
})

app.get('/api/details/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params
        const response = await fetch(
            `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=recommendations`
        )
        const data = await response.json()
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch details' })
    }
})

app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q
        if (!query) return res.json({ results: [] })
        const response = await fetch(
            `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
        )
        const data = await response.json()
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: 'Search failed' })
    }
})

app.get('/api/tv/:id/season/:season_number', async (req, res) => {
  try {
    const { id, season_number } = req.params
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${id}/season/${season_number}?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch season details' })
  }
})

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(), // Server uptime in seconds
    timestamp: new Date().toISOString()
  })
})

app.listen(PORT, () => {
     console.log(`Swift Stream running at http://localhost:${PORT}`)
})