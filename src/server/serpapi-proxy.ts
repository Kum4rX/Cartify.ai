import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import type { Request, Response } from 'express';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = 5175; // You can change this port if needed

app.use(cors());

app.get('/api/serpapi', (req: Request, res: Response): void => {
  const { query, page = 1 } = req.query;
  const apiKey = process.env.VITE_SERPAPI_KEY;
  console.log('Using SerpAPI key:', apiKey);
  if (!apiKey) {
    res.status(500).json({ error: 'SerpAPI key not set in environment variables.' });
    return;
  }
  if (!query) {
    res.status(400).json({ error: 'Missing query parameter "q".' });
    return;
  }
  const url = `https://serpapi.com/search.json?engine=walmart&query=${encodeURIComponent(query as string)}&api_key=${apiKey}&page=${page}`;
  console.log('Requesting URL:', url);
  axios.get(url)
    .then(response => { res.json(response.data); })
    .catch(err => {
      res.status(500).json({ error: 'Failed to fetch from SerpAPI', details: err?.toString() });
    });
});

app.listen(PORT, () => {
  console.log(`SerpAPI proxy running on http://localhost:${PORT}`);
});

// ESM export instead of CommonJS
export default app;