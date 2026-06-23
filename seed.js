import sql from './src/db.js';

const BATCH_SIZE = 1000;
const TOTAL_ROWS = 200000;

const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Toys', 'Sports'];

async function seed() {
  try {
    // 1. Create table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log('Table checked/created.');

    // Check if we already have data
    const res = await sql`SELECT COUNT(*) FROM products`;
    if (parseInt(res[0].count) >= TOTAL_ROWS) {
      console.log('Database already seeded.');
      process.exit(0);
    }

    console.log(`Seeding ${TOTAL_ROWS} products in batches of ${BATCH_SIZE}...`);

    for (let i = 0; i < TOTAL_ROWS; i += BATCH_SIZE) {
      const values = [];
      
      for (let j = 0; j < BATCH_SIZE; j++) {
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const price = (Math.random() * 1000 + 1).toFixed(2);
        const name = `${cat} Item ${i + j}`;
        
        values.push({ name, category: cat, price });
      }

      await sql`
        INSERT INTO products ${sql(values)}
      `;
      
      if ((i + BATCH_SIZE) % 10000 === 0) {
        console.log(`Inserted ${i + BATCH_SIZE} rows...`);
      }
    }

    console.log('Data insertion complete.');

    // Create Indexes
    console.log('Creating indexes for pagination...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_products_created_id 
      ON products (created_at DESC, id DESC);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_products_category_created_id 
      ON products (category, created_at DESC, id DESC);
    `;
    console.log('Indexes created successfully!');

  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    // Close the connection
    await sql.end();
  }
}

seed();
