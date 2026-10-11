require('dotenv').config({ path: '.env.local' });

const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();
app.set('trust proxy', process.env.TRUST_PROXY || 'loopback');
const categories = new Set([
  'general',
  'sports',
  'technology',
  'health',
  'science',
  'business',
  'entertainment',
]);
const responseCache = new Map();
const cacheLifetimeMs = 60_000;
const maxCacheEntries = 100;

app.get('/api/news', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
}), async (req, res) => {
  const country = String(req.query.country || 'us');
  const category = String(req.query.category || 'general');
  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query.pageSize || 9);

  if (!/^[a-z]{2}$/i.test(country)
      || !categories.has(category)
      || !Number.isInteger(page) || page < 1
      || !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    return res.status(400).json({ message: 'Invalid news query.' });
  }

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ message: 'News service is not configured on the server.' });
  }

  const query = new URLSearchParams({
    country,
    category,
    page: String(page),
    pageSize: String(pageSize),
  });
  const cacheKey = query.toString();
  const cachedResponse = responseCache.get(cacheKey);

  if (cachedResponse && cachedResponse.expiresAt > Date.now()) {
    return res.json(cachedResponse.data);
  }
  if (cachedResponse) responseCache.delete(cacheKey);

  try {
    const upstreamUrl = new URL('https://newsapi.org/v2/top-headlines');
    upstreamUrl.search = query.toString();
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: { 'X-Api-Key': apiKey },
    });
    const data = await upstreamResponse.json();

    if (upstreamResponse.ok && data.status !== 'error') {
      if (responseCache.size >= maxCacheEntries) {
        responseCache.delete(responseCache.keys().next().value);
      }
      responseCache.set(cacheKey, {
        data,
        expiresAt: Date.now() + cacheLifetimeMs,
      });
    }

    return res.status(upstreamResponse.status).json(data);
  } catch {
    return res.status(502).json({ message: 'News provider is unavailable.' });
  }
});

if (require.main === module) {
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => {
    console.log(`News API proxy listening on port ${port}`);
  });
}

module.exports = app;