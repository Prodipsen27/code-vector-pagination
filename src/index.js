import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
// Important: Parse JSON bodies
app.use(express.json());

// API Routes
app.use('/', routes);

// Serve Static React UI
const uiPath = path.join(__dirname, '../ui/dist');
app.use(express.static(uiPath));

// Catch-all route to serve index.html for React Router (if needed)
app.get('*', (req, res) => {
  res.sendFile(path.join(uiPath, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Try accessing: http://localhost:${port}/products`);
  
  // Prevent Render free tier from sleeping
  const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;
  if (RENDER_EXTERNAL_URL) {
    console.log(`Starting self-ping on ${RENDER_EXTERNAL_URL}/ping every 14 minutes.`);
    setInterval(() => {
      fetch(`${RENDER_EXTERNAL_URL}/ping`)
        .then(() => console.log('Self-ping successful'))
        .catch(err => console.error('Self-ping failed:', err));
    }, 14 * 60 * 1000); // 14 minutes
  }
});
