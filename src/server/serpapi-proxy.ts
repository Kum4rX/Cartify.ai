import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import type { Request, Response } from 'express';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5175;

// Configure CORS to allow requests from your frontend domain
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000', 
    'https://your-frontend-domain.netlify.app', // We'll update this after frontend deployment
    /\.netlify\.app$/
  ],
  credentials: true
}));

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'SerpAPI Proxy Server is running', timestamp: new Date().toISOString() });
});

app.get('/api/serpapi', (req: Request, res: Response): void => {
  const { query, page = 1 } = req.query;
  const apiKey = process.env.VITE_SERPAPI_KEY;
  
  console.log('Using SerpAPI key:', apiKey ? 'Present' : 'Missing');
  
  if (!apiKey) {
    res.status(500).json({ error: 'SerpAPI key not set in environment variables.' });
    return;
  }
  
  if (!query) {
    res.status(400).json({ error: 'Missing query parameter.' });
    return;
  }
  
  const url = `https://serpapi.com/search.json?engine=walmart&query=${encodeURIComponent(query as string)}&api_key=${apiKey}&page=${page}`;
  
  console.log('Requesting SerpAPI for query:', query);
  
  axios.get(url)
    .then(response => { 
      res.json(response.data); 
    })
    .catch(err => {
      console.error('SerpAPI Error:', err.message);
      res.status(500).json({ 
        error: 'Failed to fetch from SerpAPI', 
        details: err?.response?.data || err?.message 
      });
    });
});

app.listen(PORT, () => {
  console.log(`SerpAPI proxy running on port ${PORT}`);
});

// ESM export instead of CommonJS
export default app;