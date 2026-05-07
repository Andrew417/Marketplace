/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import socketService from '../../services/socketService';
import { formatCurrency } from '../../utils/formatters';

const ItemDetail = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sellerSales = 156;

  const loadItem = useCallback(async () => {
    try {
      const response = await socketService.send('SEARCH', { query: '' });
      if (response.status === 'OK') {
        const found = response.items.find(i => i.itemId === itemId);
        setItem(found || null);
        setSimilarItems(response.items.filter(i => i.itemId !== itemId).slice(0, 4));
      }
    } catch {
      console.error('Failed to load item');
    } finally {
      setIsLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    loadItem();
  }, []);

  if (isLoading) return <div style={styles.container}><Navbar /><div style={styles.loading}>Loading...</div><Footer /></div>;
  if (!item) return <div style={styles.container}><Navbar /><div style={styles.loading}>Item not found</div><Footer /></div>;

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.main}>
        <Link to="/buyer/search" style={styles.backLink}>← Back to Search</Link>
        <div style={styles.detailLayout}>
          <div style={styles.gallery}>
            <div style={styles.mainImage}><span style={styles.imageIcon}>📦</span></div>
            <div style={styles.thumbnails}>
              {[1, 2, 3, 4].map(i => (<div key={i} style={styles.thumbnail}><span>📷</span></div>))}
            </div>
          </div>
          <div style={styles.info}>
            <h1 style={styles.itemName}>{item.name}</h1>
            <div style={styles.rating}>⭐⭐⭐⭐⭐ (24 reviews)</div>
            <div style={styles.price}>{formatCurrency(item.price)}</div>
            <p style={styles.installment}>or 4 payments of {formatCurrency(item.price / 4)}</p>
            <div style={styles.specsGrid}>
              <div style={styles.specItem}><span style={styles.specLabel}>Condition</span><span style={styles.specValue}>{item.condition || 'N/A'}</span></div>
              <div style={styles.specItem}><span style={styles.specLabel}>Brand</span><span style={styles.specValue}>{item.brand}</span></div>
              <div style={styles.specItem}><span style={styles.specLabel}>Category</span><span style={styles.specValue}>{item.category || 'N/A'}</span></div>
              <div style={styles.specItem}><span style={styles.specLabel}>Quantity Available</span><span style={styles.specValue}>{item.quantity}</span></div>
            </div>
            <div style={styles.sellerCard}>
              <div style={styles.sellerAvatar}>👤</div>
              <div style={styles.sellerInfo}>
                <h4 style={styles.sellerName}>@{item.sellerName}</h4>
                <div style={styles.sellerRating}>⭐ {item.sellerRating || 'N/A'} • {sellerSales} sales</div>
                <p style={styles.sellerJoined}>Joined 2023</p>
              </div>
              <div style={styles.sellerActions}>
                <button style={styles.messageBtn}>Message</button>
                <button style={styles.shopBtn}>View Shop</button>
              </div>
            </div>
            <div style={styles.description}>
              <h3 style={styles.descTitle}>Description</h3>
              <p style={styles.descText}>{item.description || 'No description provided.'}</p>
            </div>
            <div style={styles.actions}>
              <button style={styles.wishlistBtn}>❤️ Add to Wishlist</button>
              <Link to={`/buyer/checkout/${item.itemId}`} style={styles.buyNowBtn}>Buy Now</Link>
              <button style={styles.offerBtn}>Make Offer</button>
            </div>
          </div>
        </div>
        <section style={styles.similarSection}>
          <h2 style={styles.similarTitle}>📍 Similar Items You Might Like</h2>
          <div style={styles.similarGrid}>
            {similarItems.map(sItem => (
              <Link to={`/buyer/item/${sItem.itemId}`} key={sItem.itemId} style={styles.similarCard}>
                <div style={styles.similarImage}><span>📦</span></div>
                <div style={styles.similarInfo}><h4>{sItem.name}</h4><p>{formatCurrency(sItem.price)}</p></div>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' },
  loading: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px', color: '#6b7280' },
  main: { flex: 1, maxWidth: '1100px', margin: '0 auto', padding: '24px', width: '100%' },
  backLink: { color: '#3b82f6', fontSize: '14px', marginBottom: '20px', display: 'inline-block', textDecoration: 'none' },
  detailLayout: { display: 'flex', gap: '32px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '32px' },
  gallery: { width: '400px', flexShrink: 0 },
  mainImage: { height: '320px', backgroundColor: '#f3f4f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' },
  imageIcon: { fontSize: '80px', color: '#9ca3af' },
  thumbnails: { display: 'flex', gap: '8px' },
  thumbnail: { width: '72px', height: '72px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#9ca3af', cursor: 'pointer' },
  info: { flex: 1 },
  itemName: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' },
  rating: { color: '#f59e0b', fontSize: '14px', marginBottom: '12px' },
  price: { fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' },
  installment: { fontSize: '13px', color: '#6b7280', marginBottom: '20px' },
  specsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' },
  specItem: { padding: '10px', backgroundColor: '#f9fafb', borderRadius: '8px' },
  specLabel: { fontSize: '11px', color: '#6b7280', display: 'block' },
  specValue: { fontSize: '14px', fontWeight: '600', color: '#1f2937' },
  sellerCard: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '12px', marginBottom: '20px' },
  sellerAvatar: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: '15px', fontWeight: '600', color: '#1f2937' },
  sellerRating: { fontSize: '12px', color: '#6b7280' },
  sellerJoined: { fontSize: '11px', color: '#9ca3af' },
  sellerActions: { display: 'flex', flexDirection: 'column', gap: '6px' },
  messageBtn: { padding: '6px 14px', border: '1px solid #3b82f6', borderRadius: '6px', backgroundColor: '#fff', color: '#3b82f6', fontSize: '12px', cursor: 'pointer' },
  shopBtn: { padding: '6px 14px', border: 'none', backgroundColor: 'transparent', color: '#3b82f6', fontSize: '12px', cursor: 'pointer' },
  description: { marginBottom: '24px' },
  descTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '8px' },
  descText: { fontSize: '14px', color: '#4b5563', lineHeight: '1.6' },
  actions: { display: 'flex', gap: '12px' },
  wishlistBtn: { padding: '12px 20px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#fff', fontSize: '14px', cursor: 'pointer' },
  buyNowBtn: { flex: 1, padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', textAlign: 'center', textDecoration: 'none' },
  offerBtn: { padding: '12px 20px', border: '2px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', fontSize: '14px', cursor: 'pointer' },
  similarSection: { marginTop: '40px' },
  similarTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' },
  similarGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },
  similarCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', textDecoration: 'none', color: 'inherit' },
  similarImage: { height: '140px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: '#9ca3af' },
  similarInfo: { padding: '12px' },
};

export default ItemDetail;