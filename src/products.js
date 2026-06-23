import sql from './db.js';

export async function getProducts({ limit = 20, cursor = null, category = null }) {
  let decodedCursor = null;
  if (cursor) {
    try {
      decodedCursor = JSON.parse(Buffer.from(cursor, 'base64').toString());
    } catch (e) {
      throw new Error('Invalid cursor format');
    }
  }

  // Fetch limit + 1 to easily determine if there is a next page
  const fetchLimit = parseInt(limit) + 1;

  let products;

  // With postgres.js, we can write safe dynamic queries. 
  // However, because of the tuple comparison `(created_at, id) < ...`, 
  // it's often cleanest to just branch the query builder logically.
  
  if (category && decodedCursor) {
    products = await sql`
      SELECT id, name, category, price, created_at::text as created_at, updated_at
      FROM products
      WHERE category = ${category}
        AND (created_at, id) < (${decodedCursor.t}, ${decodedCursor.id})
      ORDER BY created_at DESC, id DESC
      LIMIT ${fetchLimit}
    `;
  } else if (category && !decodedCursor) {
    products = await sql`
      SELECT id, name, category, price, created_at::text as created_at, updated_at
      FROM products
      WHERE category = ${category}
      ORDER BY created_at DESC, id DESC
      LIMIT ${fetchLimit}
    `;
  } else if (!category && decodedCursor) {
    products = await sql`
      SELECT id, name, category, price, created_at::text as created_at, updated_at
      FROM products
      WHERE (created_at, id) < (${decodedCursor.t}, ${decodedCursor.id})
      ORDER BY created_at DESC, id DESC
      LIMIT ${fetchLimit}
    `;
  } else {
    // No category, no cursor
    products = await sql`
      SELECT id, name, category, price, created_at::text as created_at, updated_at
      FROM products
      ORDER BY created_at DESC, id DESC
      LIMIT ${fetchLimit}
    `;
  }

  // Check if we got that extra item
  const hasMore = products.length === fetchLimit;
  // If we did, remove it before returning
  const results = hasMore ? products.slice(0, -1) : products;

  let nextCursor = null;
  if (results.length > 0) {
    const lastItem = results[results.length - 1];
    nextCursor = Buffer.from(
      JSON.stringify({ t: lastItem.created_at, id: lastItem.id })
    ).toString('base64');
  }

  return {
    data: results,
    next_cursor: hasMore ? nextCursor : null,
    has_more: hasMore,
    count: results.length
  };
}
