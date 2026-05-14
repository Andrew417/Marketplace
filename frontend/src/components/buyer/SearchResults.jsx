/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import socketService from '../../services/socketService';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORIES, ITEM_CONDITIONS } from '../../utils/constants';

const SearchResults = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [query] = useState('');
  const [filters, setFilters] = useState({
    category: 'All', condition: 'Any', minPrice: '', maxPrice: '', sellerRating: false
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [aiSearch, setAiSearch] = useState(false);

  const searchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await socketService.send('SEARCH', { query: query || '' });
      if (response.status === 'OK') {
        let results = response.items || [];
        if (filters.category !== 'All') results = results.filter(item => item.category === filters.category);
        if (filters.condition !== 'Any') results = results.filter(item => item.condition === filters.condition);
        if (filters.minPrice) results = results.filter(item => item.price >= parseFloat(filters.minPrice));
        if (filters.maxPrice) results = results.filter(item => item.price <= parseFloat(filters.maxPrice));
        setItems(results);
        setTotal(results.length);
      }
    } catch {
      console.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  }, [query, filters]);

  useEffect(() => {
    searchItems();
  }, []);

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.main}>
        <div style={styles.layout}>
          <aside style={styles.sidebar}>
            <h3 style={styles.filterTitle}>Filters</h3>
            <div style={styles.filterSection}>
              <h4 style={styles.filterLabel}>Category</h4>
              {CATEGORIES.map(cat => (
                <label key={cat} style={styles.filterOption}>
                  <input type="radio" name="category" checked={filters.category === cat} onChange={() => setFilters(f => ({ ...f, category: cat }))} />
                  {cat}
                </label>
              ))}
            </div>
            <div style={styles.filterSection}>
              <h4 style={styles.filterLabel}>Price Range</h4>
              <div style={styles.priceInputs}>
                <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))} style={styles.priceInput} />
                <span style={styles.priceDash}>-</span>
                <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))} style={styles.priceInput} />
              </div>
              <button onClick={searchItems} style={styles.applyBtn}>Apply</button>
            </div>
            <div style={styles.filterSection}>
              <h4 style={styles.filterLabel}>Condition</h4>
              {ITEM_CONDITIONS.map(cond => (
                <label key={cond} style={styles.filterOption}>
                  <input type="radio" name="condition" checked={filters.condition === cond} onChange={() => setFilters(f => ({ ...f, condition: cond }))} />
                  {cond}
                </label>
              ))}
            </div>
            <div style={styles.filterSection}>
              <h4 style={styles.filterLabel}>Seller Rating</h4>
              <label style={styles.filterOption}>
                <input type="checkbox" checked={filters.sellerRating} onChange={(e) => setFilters(f => ({ ...f, sellerRating: e.target.checked }))} />
                ⭐⭐⭐⭐ & up
              </label>
            </div>
            <button onClick={() => setFilters({ category: 'All', condition: 'Any', minPrice: '', maxPrice: '', sellerRating: false })} style={styles.clearBtn}>Clear All Filters</button>
          </aside>
          <div style={styles.results}>
            <div style={styles.resultsHeader}>
              <h2 style={styles.resultsTitle}>
                Results for "<span style={{ color: '#3b82f6' }}>{query || 'all items'}</span>"
                <span style={styles.resultsCount}>({total} items found)</span>
              </h2>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.sortSelect}>
                <option value="relevance">Sort by: Relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            <div style={styles.aiBanner}>
              <span>🤖 AI Search</span>
              <label style={styles.toggle}><input type="checkbox" checked={aiSearch} onChange={(e) => setAiSearch(e.target.checked)} /><span style={styles.toggleSlider}></span></label>
            </div>
            {isLoading ? (
              <div style={styles.loadingState}>Searching...</div>
            ) : total === 0 ? (
              <div style={styles.emptyState}>
                <p style={{ fontSize: '18px', marginBottom: '8px' }}>No items found for "{query}"</p>
                <p style={{ color: '#6b7280' }}>Try checking your spelling or use more general keywords</p>
              </div>
            ) : (
              <div style={styles.itemGrid}>
                {items.map(item => (
                  <Link to={`/buyer/item/${item.itemId}`} key={item.itemId} style={styles.itemCard}>
                    <div style={styles.itemImage}><span style={styles.itemIcon}>📦</span></div>
                    <div style={styles.itemInfo}>
                      <h4 style={styles.itemName}>{item.name}</h4>
                      <p style={styles.itemSeller}>@{item.sellerName}</p>
                      <p style={styles.itemPrice}>{formatCurrency(item.price)}</p>
                    </div>
                    <button style={styles.buyBtn}>Buy</button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' },
  main: { flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '24px', width: '100%' },
  layout: { display: 'flex', gap: '24px' },
  sidebar: { width: '260px', flexShrink: 0, backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', height: 'fit-content', position: 'sticky', top: '80px' },
  filterTitle: { fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' },
  filterSection: { marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' },
  filterLabel: { fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' },
  filterOption: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4b5563', padding: '4px 0', cursor: 'pointer' },
  priceInputs: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  priceInput: { width: '80px', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' },
  priceDash: { color: '#9ca3af' },
  applyBtn: { width: '100%', padding: '8px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
  clearBtn: { width: '100%', padding: '8px', backgroundColor: '#fff', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
  results: { flex: 1 },
  resultsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  resultsTitle: { fontSize: '20px', fontWeight: 'bold', color: '#1f2937' },
  resultsCount: { fontSize: '14px', color: '#6b7280', fontWeight: 'normal', marginLeft: '8px' },
  sortSelect: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', backgroundColor: '#fff' },
  aiBanner: { backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '8px', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '14px', color: '#7c3aed' },
  toggle: { position: 'relative', display: 'inline-block', width: '44px', height: '24px' },
  toggleSlider: { position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#d1d5db', borderRadius: '24px', transition: '0.3s' },
  itemGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
  itemCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', textDecoration: 'none', color: 'inherit' },
  itemImage: { height: '140px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  itemIcon: { fontSize: '40px', color: '#9ca3af' },
  itemInfo: { padding: '12px' },
  itemName: { fontSize: '14px', fontWeight: '600', marginBottom: '2px' },
  itemSeller: { fontSize: '12px', color: '#6b7280', marginBottom: '6px' },
  itemPrice: { fontSize: '16px', fontWeight: 'bold', color: '#1f2937' },
  buyBtn: { margin: '0 12px 12px', padding: '8px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', width: 'calc(100% - 24px)' },
  loadingState: { textAlign: 'center', padding: '60px', color: '#6b7280', fontSize: '16px' },
  emptyState: { textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' },
};

export default SearchResults;