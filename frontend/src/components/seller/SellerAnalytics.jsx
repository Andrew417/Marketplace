/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import socketService from '../../services/socketService';
import { formatCurrency } from '../../utils/formatters';

const SellerAnalytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-04-22');
  const [, setIsLoading] = useState(true);

  const loadReport = useCallback(async () => {
    try {
      const response = await socketService.send('GET_REPORT', { startDate, endDate });
      if (response.status === 'OK') setTransactions(response.transactions || []);
    } catch { console.error('Failed to load report'); }
    finally { setIsLoading(false); }
  }, [startDate, endDate]);

  useEffect(() => { loadReport(); }, []);

  const totalRevenue = transactions.reduce((s, t) => s + t.amount, 0);
  const totalOrders = transactions.length;
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const itemCounts = {};
  transactions.forEach(t => {
    itemCounts[t.itemName] = (itemCounts[t.itemName] || 0) + 1;
  });
  const topItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({ name, sold: count, revenue: count * 50 }));

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.main}>
        <div style={styles.header}>
          <h2 style={styles.title}>Analytics Dashboard</h2>
          <div style={styles.exportBtns}>
            <button style={styles.exportBtn}>Export CSV</button>
            <button style={styles.exportBtn}>Export JSON</button>
          </div>
        </div>

        <div style={styles.dateRow}>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={styles.dateInput} />
          <span>to</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={styles.dateInput} />
          <button onClick={loadReport} style={styles.applyBtn}>Apply</button>
          <div style={styles.presets}>
            {['Last 7 Days', 'Last 30 Days', 'This Month'].map(p => <button key={p} style={styles.presetBtn}>{p}</button>)}
          </div>
        </div>

        <div style={styles.revenueCard}>
          <h3>📊 Revenue Overview</h3>
          <div style={styles.revenueStats}>
            <div style={styles.revenueStat}><span style={styles.revenueValue}>{formatCurrency(totalRevenue)}</span><span style={styles.revenueLabel}>Total Revenue</span></div>
            <div style={styles.revenueStat}><span style={styles.revenueValue}>{totalOrders}</span><span style={styles.revenueLabel}>Total Orders</span></div>
            <div style={styles.revenueStat}><span style={styles.revenueValue}>{formatCurrency(avgOrder)}</span><span style={styles.revenueLabel}>Avg Order Value</span></div>
          </div>
          <div style={styles.chartPlaceholder}>📈 Revenue Chart Placeholder</div>
        </div>

        <div style={styles.twoCol}>
          <div style={styles.col}>
            <h3>🏆 Top Selling Items</h3>
            {topItems.map((item, i) => (
              <div key={i} style={styles.topRow}>
                <span>{i + 1}. {item.name}</span>
                <span>{item.sold} sold • {formatCurrency(item.revenue)}</span>
                <div style={{ ...styles.bar, width: `${100 - i * 25}%` }} />
              </div>
            ))}
          </div>
          <div style={styles.col}>
            <h3>📈 Sales by Category</h3>
            {[{ name: 'Electronics', pct: 65 }, { name: 'Fashion', pct: 15 }, { name: 'Books', pct: 10 }, { name: 'Home', pct: 8 }].map(c => (
              <div key={c.name} style={styles.catRow}>
                <span>{c.name}</span>
                <span>{c.pct}%</span>
                <div style={{ ...styles.bar, width: `${c.pct}%` }} />
              </div>
            ))}
          </div>
        </div>

        <div style={styles.tableCard}>
          <h3>📋 Transaction History</h3>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Date</span><span>Item</span><span>Buyer</span><span>Amount</span><span>Status</span>
            </div>
            {transactions.slice(0, 5).map(t => (
              <div key={t.transactionId} style={styles.tableRow}>
                <span>{t.date}</span><span>{t.itemName}</span><span>{t.buyerName}</span><span>{formatCurrency(t.amount)}</span><span style={{ textTransform: 'capitalize' }}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' },
  main: { flex: 1, maxWidth: '1100px', margin: '0 auto', padding: '24px', width: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '24px', fontWeight: 'bold' },
  exportBtns: { display: 'flex', gap: '8px' },
  exportBtn: { padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px' },
  dateRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  dateInput: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px' },
  applyBtn: { padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  presets: { display: 'flex', gap: '8px', marginLeft: '16px' },
  presetBtn: { padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '16px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px' },
  revenueCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '24px' },
  revenueStats: { display: 'flex', gap: '40px', marginBottom: '16px' },
  revenueStat: { display: 'flex', flexDirection: 'column' },
  revenueValue: { fontSize: '24px', fontWeight: 'bold' },
  revenueLabel: { fontSize: '12px', color: '#6b7280' },
  chartPlaceholder: { height: '200px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' },
  col: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' },
  topRow: { padding: '8px 0', borderBottom: '1px solid #f3f4f6' },
  catRow: { padding: '8px 0', borderBottom: '1px solid #f3f4f6' },
  bar: { height: '4px', backgroundColor: '#10b981', borderRadius: '2px', marginTop: '4px' },
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' },
  table: {},
  tableHeader: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '2px solid #e5e7eb', fontWeight: '600', fontSize: '13px', color: '#6b7280' },
  tableRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6', fontSize: '13px' },
};

export default SellerAnalytics;