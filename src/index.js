import express from 'express';
import dotenv from 'dotenv';
import routes from './routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Important: Parse JSON bodies
app.use(express.json());

// Use the routes
app.use('/', routes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Try accessing: http://localhost:${port}/products`);
});
