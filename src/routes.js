import { Router } from 'express';
import { getProducts } from './products.js';

const router = Router();

router.get('/products', async (req, res) => {
  try {
    const { limit, cursor, category } = req.query;
    
    // Parse limit, default to 20, max 100
    const parsedLimit = limit ? parseInt(limit) : 20;
    const finalLimit = Math.min(Math.max(parsedLimit, 1), 100);

    const result = await getProducts({
      limit: finalLimit,
      cursor,
      category
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    if (error.message === 'Invalid cursor format') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
