/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import socketService from '../services/socketService';
import { formatCurrency } from '../utils/formatters';

const BuyerHome = () => {
  const [account, setAccount] = useState(null);
  const [trendingItems, setTrendingItems] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const accountRes = await socketService.send('GET_ACCOUNT', {});
      if (accountRes.status === 'OK') {
        setAccount(accountRes);
        setPurchases(accountRes.purchases || []);
      }

      const searchRes = await socketService.send('SEARCH', { query: '' });
      if (searchRes.status === 'OK') {
        setTrendingItems(searchRes.items.slice(0, 6) || []);
      }
    } catch {
      console.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount < 1) return;

    try {
      const response = await socketService.send('DEPOSIT', { amount });
      if (response.status === 'OK') {
        setAccount(prev => ({ ...prev, balance: response.newBalance }));
        setDepositAmount('');
        setShowDeposit(false);
      }
    } catch {
      console.error('Deposit failed');
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <Navbar />
        <div style={styles.loading}>Loading dashboard...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar />

      <div style={styles.main}>
        <div style={styles.welcomeBanner}>
          <div style={styles.welcomeContent}>
            <h1 style={styles.welcomeTitle}>👋 Welcome back, {account?.username || 'User'}!</h1>
            <div style={styles.balanceDisplay}>
              <span style={styles.balanceLabel}>Available Balance</span>
              <span style={styles.balanceAmount}>{formatCurrency(account?.balance || 0)}</span>
            </div>
            <div style={styles.welcomeActions}>
              <button onClick={() => setShowDeposit(true)} style={styles.depositBtn}>
                💰 Deposit Funds
              </button>
              <Link to="/buyer/purchases" style={styles.historyBtn}>
                📋 Transaction History
              </Link>
            </div>
          </div>
        </div>

        {showDeposit && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3 style={styles.modalTitle}>Quick Deposit</h3>
              <p style={styles.modalSubtitle}>Min: $1.00 • Updates instantly across all nodes</p>
              
              <div style={styles.amountInput}>
                <span style={styles.dollarSign}>$</span>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  style={styles.depositInput}
                />
              </div>

              <div style={styles.quickAmounts}>
                {[25, 50, 100, 500].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setDepositAmount(amount.toString())}
                    style={depositAmount === amount.toString() ? styles.quickAmountActive : styles.quickAmount}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div style={styles.modalActions}>
                <button onClick={() => setShowDeposit(false)} style={styles.cancelBtn}>Cancel</button>
                <button onClick={handleDeposit} style={styles.confirmBtn}>Confirm Deposit</button>
              </div>
            </div>
          </div>
        )}

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>🔥 Recommended For You</h2>
            <Link to="/buyer/search" style={styles.viewAll}>View All →</Link>
          </div>
          <div style={styles.itemGrid}>
            {trendingItems.map(item => (
              <Link to={`/buyer/item/${item.itemId}`} key={item.itemId} style={styles.itemCard}>
                <div style={styles.itemImage}>
                  <span style={styles.itemIcon}>📦</span>
                </div>
                <div style={styles.itemInfo}>
                  <h4 style={styles.itemName}>{item.name}</h4>
                  <p style={styles.itemSeller}>@{item.sellerName}</p>
                  <p style={styles.itemPrice}>{formatCurrency(item.price)}</p>
                </div>
                <button style={styles.buyBtn}>Buy</button>
              </Link>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>📦 Recent Purchases</h2>
            <Link to="/buyer/purchases" style={styles.viewAll}>View All →</Link>
          </div>
          <div style={styles.purchasesList}>
            {purchases.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No purchases yet. Start shopping!</p>
                <Link to="/buyer/search" style={styles.shopLink}>Browse Items</Link>
              </div>
            ) : (
              purchases.slice(0, 3).map(purchase => (
                <div key={purchase.transactionId} style={styles.purchaseCard}>
                  <div style={styles.purchaseIcon}>📦</div>
                  <div style={styles.purchaseInfo}>
                    <h4 style={styles.purchaseName}>{purchase.itemName}</h4>
                    <p style={styles.purchaseMeta}>
                      Purchased from @{purchase.sellerName} • {purchase.date}
                    </p>
                  </div>
                  <div style={styles.purchaseRight}>
                    <span style={styles.purchaseAmount}>{formatCurrency(purchase.amount)}</span>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: purchase.status === 'delivered' ? '#d1fae5' : '#fef3c7',
                      color: purchase.status === 'delivered' ? '#065f46' : '#92400e'
                    }}>
                      {purchase.status}
                    </span>
                  </div>
                </div>
              ))
            )}
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
  welcomeBanner: { background: 'linear-gradient(135deg, #2563eb, #3b82f6)', borderRadius: '16px', padding: '32px', marginBottom: '32px', color: '#fff' },
  welcomeContent: { maxWidth: '600px' },
  welcomeTitle: { fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' },
  balanceDisplay: { display: 'flex', flexDirection: 'column', marginBottom: '20px' },
  balanceLabel: { fontSize: '14px', opacity: 0.8 },
  balanceAmount: { fontSize: '36px', fontWeight: 'bold' },
  welcomeActions: { display: 'flex', gap: '12px' },
  depositBtn: { padding: '10px 24px', backgroundColor: '#fff', color: '#3b82f6', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' },
  historyBtn: { padding: '10px 24px', backgroundColor: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '8px', fontWeight: '500', fontSize: '14px', textDecoration: 'none' },
  section: { marginBottom: '32px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { fontSize: '20px', fontWeight: 'bold', color: '#1f2937' },
  viewAll: { color: '#3b82f6', fontSize: '14px', fontWeight: '500', textDecoration: 'none' },
  itemGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' },
  itemCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', textDecoration: 'none', color: 'inherit', transition: 'box-shadow 0.2s' },
  itemImage: { height: '160px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  itemIcon: { fontSize: '48px', color: '#9ca3af' },
  itemInfo: { padding: '12px' },
  itemName: { fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '2px' },
  itemSeller: { fontSize: '12px', color: '#6b7280', marginBottom: '6px' },
  itemPrice: { fontSize: '18px', fontWeight: 'bold', color: '#1f2937' },
  buyBtn: { margin: '0 12px 12px', padding: '8px 16px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', width: 'calc(100% - 24px)' },
  purchasesList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  purchaseCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' },
  purchaseIcon: { fontSize: '32px', width: '48px', height: '48px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  purchaseInfo: { flex: 1 },
  purchaseName: { fontSize: '15px', fontWeight: '600', color: '#1f2937' },
  purchaseMeta: { fontSize: '12px', color: '#6b7280', marginTop: '2px' },
  purchaseRight: { textAlign: 'right' },
  purchaseAmount: { fontSize: '16px', fontWeight: 'bold', color: '#1f2937', display: 'block' },
  statusBadge: { display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '500', marginTop: '4px', textTransform: 'capitalize' },
  emptyState: { textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', color: '#6b7280' },
  shopLink: { display: 'inline-block', marginTop: '12px', color: '#3b82f6', fontWeight: '500', textDecoration: 'none' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200 },
  modal: { backgroundColor: '#fff', borderRadius: '16px', padding: '32px', width: '400px', maxWidth: '90%' },
  modalTitle: { fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' },
  modalSubtitle: { fontSize: '13px', color: '#6b7280', marginBottom: '20px' },
  amountInput: { display: 'flex', alignItems: 'center', border: '2px solid #3b82f6', borderRadius: '8px', padding: '8px 16px', marginBottom: '16px' },
  dollarSign: { fontSize: '20px', fontWeight: 'bold', color: '#3b82f6', marginRight: '8px' },
  depositInput: { border: 'none', outline: 'none', fontSize: '20px', width: '100%', fontWeight: 'bold', color: '#1f2937' },
  quickAmounts: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  quickAmount: { padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '20px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '14px', color: '#374151' },
  quickAmountActive: { padding: '8px 16px', border: '2px solid #3b82f6', borderRadius: '20px', backgroundColor: '#eff6ff', cursor: 'pointer', fontSize: '14px', color: '#3b82f6', fontWeight: '600' },
  modalActions: { display: 'flex', gap: '12px' },
  cancelBtn: { flex: 1, padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '14px' },
  confirmBtn: { flex: 1, padding: '12px', border: 'none', borderRadius: '8px', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
};

export default BuyerHome;