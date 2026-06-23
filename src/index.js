import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
// Important: Parse JSON bodies
app.use(express.json());

// Use the routes
app.use('/', routes);

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
