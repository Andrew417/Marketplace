/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import socketService from '../../services/socketService';
import { formatCurrency } from '../../utils/formatters';

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const loadPurchases = useCallback(async () => {
    try {
      const response = await socketService.send('GET_ACCOUNT', {});
      if (response.status === 'OK') setPurchases(response.purchases || []);
    } catch { console.error('Failed to load purchases'); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    loadPurchases();
  }, []);

  const tabs = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];
  const filteredPurchases = activeTab === 'All' ? purchases : purchases.filter(p => p.status.toLowerCase() === activeTab.toLowerCase());
  const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={styles.container}><Navbar /><div style={styles.main}>
      <div style={styles.header}><h1 style={styles.title}>My Purchases</h1><button style={styles.exportBtn}>📥 Export CSV</button></div>
      <div style={styles.tabs}>{tabs.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} style={activeTab === tab ? styles.tabActive : styles.tab}>{tab} {tab === 'All' && `(${purchases.length})`}</button>))}</div>
      {isLoading ? <div style={styles.loading}>Loading purchases...</div> : filteredPurchases.length === 0 ? <div style={styles.emptyState}><p style={{ fontSize: '18px', marginBottom: '8px' }}>No purchases found</p><p style={{ color: '#6b7280' }}>Start shopping to see your purchases here</p></div> : <div style={styles.purchasesList}>{filteredPurchases.map(purchase => (
        <div key={purchase.transactionId} style={styles.purchaseCard}>
          <div style={styles.purchaseIcon}>📦</div><div style={styles.purchaseInfo}><h4 style={styles.purchaseName}>{purchase.itemName}</h4><p style={styles.purchaseMeta}>Seller: @{purchase.sellerName} • Order #: {purchase.orderNumber}</p><p style={styles.purchaseDate}>Purchased on {purchase.date}</p></div><div style={styles.purchaseRight}><span style={styles.purchaseAmount}>{formatCurrency(purchase.amount)}</span><span style={{ ...styles.statusBadge, backgroundColor: purchase.status === 'delivered' ? '#d1fae5' : purchase.status === 'shipped' ? '#fef3c7' : '#e5e7eb', color: purchase.status === 'delivered' ? '#065f46' : purchase.status === 'shipped' ? '#92400e' : '#374151' }}>{purchase.status}</span></div>
          <div style={styles.purchaseActions}><button style={styles.actionBtn}>View Details</button>{purchase.status === 'shipped' && <button style={styles.actionBtn}>Track</button>}{purchase.status === 'delivered' && <button style={styles.actionBtn}>Leave Review</button>}<button style={styles.actionBtn}>Buy Again</button><button style={styles.actionBtn}>Contact Seller</button></div>
        </div>
      ))}</div>}
      <div style={styles.summary}><div style={styles.summaryItem}><span style={styles.summaryLabel}>Total Orders</span><span style={styles.summaryValue}>{purchases.length}</span></div><div style={styles.summaryItem}><span style={styles.summaryLabel}>Total Spent</span><span style={styles.summaryValue}>{formatCurrency(totalSpent)}</span></div></div>
    </div><Footer /></div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' },
  main: { flex: 1, maxWidth: '1000px', margin: '0 auto', padding: '24px', width: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937' },
  exportBtn: { padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', fontSize: '13px', cursor: 'pointer' },
  tabs: { display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' },
  tab: { padding: '8px 16px', border: 'none', backgroundColor: 'transparent', color: '#6b7280', fontSize: '14px', cursor: 'pointer', borderRadius: '6px' },
  tabActive: { padding: '8px 16px', border: 'none', backgroundColor: '#eff6ff', color: '#3b82f6', fontSize: '14px', fontWeight: '600', cursor: 'pointer', borderRadius: '6px' },
  loading: { textAlign: 'center', padding: '60px', color: '#6b7280' },
  emptyState: { textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' },
  purchasesList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  purchaseCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' },
  purchaseIcon: { fontSize: '40px', width: '56px', height: '56px', backgroundColor: '#f3f4f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', float: 'left', marginRight: '16px' },
  purchaseInfo: { marginBottom: '12px' },
  purchaseName: { fontSize: '16px', fontWeight: '600', marginBottom: '4px' },
  purchaseMeta: { fontSize: '13px', color: '#6b7280', marginBottom: '2px' },
  purchaseDate: { fontSize: '12px', color: '#9ca3af' },
  purchaseRight: { float: 'right', textAlign: 'right' },
  purchaseAmount: { fontSize: '18px', fontWeight: 'bold', display: 'block' },
  statusBadge: { display: 'inline-block', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', marginTop: '4px', textTransform: 'capitalize' },
  purchaseActions: { display: 'flex', gap: '8px', flexWrap: 'wrap', clear: 'both', paddingTop: '12px', borderTop: '1px solid #f3f4f6', marginTop: '12px' },
  actionBtn: { padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#fff', fontSize: '12px', color: '#374151', cursor: 'pointer' },
  summary: { display: 'flex', gap: '24px', marginTop: '24px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' },
  summaryItem: { display: 'flex', flexDirection: 'column' },
  summaryLabel: { fontSize: '12px', color: '#6b7280' },
  summaryValue: { fontSize: '20px', fontWeight: 'bold', color: '#1f2937' },
};

export default PurchaseHistory;