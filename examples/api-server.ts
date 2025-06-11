// Example API server using the chimi library
// This demonstrates how to create REST API endpoints following the guide.md requirements

import express from 'express';
import { GAMES } from '../src';

const app = express();
const port = 3000;

// Initialize the itch.io scraper
const itch = new GAMES.ItchIO();

// Middleware
app.use(express.json());

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// API Routes following the /api/ pattern from guide.md

// GET /api/games/new-and-popular
app.get('/api/games/new-and-popular', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const games = await itch.fetchNewAndPopular(page);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/games/top-sellers
app.get('/api/games/top-sellers', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const games = await itch.fetchTopSellers(page);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/games/top-rated
app.get('/api/games/top-rated', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const games = await itch.fetchTopRated(page);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/games/newest
app.get('/api/games/newest', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const games = await itch.fetchNewest(page);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/games/search
app.get('/api/games/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    
    const games = await itch.search(query, page);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/games/info/:id
app.get('/api/games/info/:id', async (req, res) => {
  try {
    const gameUrl = req.params.id;
    
    // If the ID is not a full URL, construct it
    const fullUrl = gameUrl.startsWith('http') 
      ? gameUrl 
      : `https://itch.io/games/${gameUrl}`;
    
    const gameInfo = await itch.fetchGameInfo(fullUrl);
    res.json(gameInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'chimi-api',
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Chimi API running at http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  GET /api/games/new-and-popular?page=1');
  console.log('  GET /api/games/top-sellers?page=1');
  console.log('  GET /api/games/top-rated?page=1');
  console.log('  GET /api/games/newest?page=1');
  console.log('  GET /api/games/search?q=horror&page=1');
  console.log('  GET /api/games/info/<game-url-or-id>');
  console.log('  GET /api/health');
});

export default app;