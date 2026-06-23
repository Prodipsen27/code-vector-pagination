import { useState, useEffect } from 'react';
import './index.css';

const API_URL = 'https://code-vector-pagination-api.onrender.com';
const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Toys', 'Sports'];

function App() {
  const [products, setProducts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (currentCursor = null, currentCategory = 'All') => {
    try {
      setLoading(true);
      const url = new URL(`${API_URL}/products`);
      url.searchParams.append('limit', '20');
      
      if (currentCursor) {
        url.searchParams.append('cursor', currentCursor);
      }
      if (currentCategory !== 'All') {
        url.searchParams.append('category', currentCategory);
      }

      const res = await fetch(url);
      const data = await res.json();

      if (currentCursor) {
        setProducts(prev => [...prev, ...data.data]);
      } else {
        setProducts(data.data);
      }
      
      setCursor(data.next_cursor);
      setHasMore(data.has_more);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(null, category);
  }, [category]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(cursor, category);
    }
  };

  return (
    <div className="container">
      <header>
        <div>
          <h1>Inventory.</h1>
          <div className="subtitle">Real-time Product Browser // 200K Records</div>
        </div>
        <div className="stats">
          <span className="category-badge">SYS.ONLINE</span>
        </div>
      </header>

      <div className="controls">
        <select value={category} onChange={handleCategoryChange}>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>[{cat.toUpperCase()}]</option>
          ))}
        </select>
      </div>

      <div className="grid">
        {products.map(product => (
          <div className="card" key={product.id}>
            <div className="card-header">
              <span className="category-badge">{product.category}</span>
              <span className="price">${product.price}</span>
            </div>
            <div className="product-name">{product.name}</div>
            <div className="meta">
              ID: {product.id.split('-')[0]}... <br/>
              LOG: {new Date(product.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {hasMore ? (
        <button 
          className="load-more" 
          onClick={loadMore} 
          disabled={loading}
        >
          {loading ? 'FETCHING_DATA...' : '>>> LOAD_MORE_RECORDS'}
        </button>
      ) : (
        <div className="end-message">END_OF_DATABASE</div>
      )}
    </div>
  );
}

export default App;
