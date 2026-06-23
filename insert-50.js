import sql from './src/db.js';

async function insert50() {
  console.log('Inserting 50 new products...');
  const values = [];
  
  for (let i = 0; i < 50; i++) {
    values.push({
      name: `NEW LIVE ITEM ${i + 1}`,
      category: 'Electronics',
      price: (Math.random() * 1000).toFixed(2)
    });
  }

  try {
    await sql`INSERT INTO products ${sql(values)}`;
    console.log('Successfully inserted 50 new items!');
  } catch (err) {
    console.error('Failed to insert:', err);
  } finally {
    await sql.end();
  }
}

insert50();
