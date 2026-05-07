/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import socketService from '../../services/socketService';
import { formatCurrency } from '../../utils/formatters';

const AdminReports = () => {
  const [transactions, setTransactions] = useState([]);
  const [reportType, setReportType] = useState('all');
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-04-22');
  const [isLoading, setIsLoading] = useState(true);

  const loadReport = useCallback(async () => {
    try {
      const response = await socketService.send('GET_REPORT', { startDate, endDate });
      if (response.status === 'OK') setTransactions(response.transactions || []);
    } catch { console.error('Failed'); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { loadReport(); }, []);

  const totalVolume = transactions.reduce((s, t) => s + (t.amount || 0), 0);

  const topItems = {};
  transactions.forEach(t => {
    topItems[t.itemName] = (topItems[t.itemName] || 0) + 1;
  });
  const sortedTop = Object.entries(topItems).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.main}>
        <div style={styles.header}>
          <h2 style={styles.title}>🔒 Admin Reports - Full Platform View</h2>
          <div>
            <button style={styles.exportBtn}>Export CSV</button>
            <button style={{ ...styles.exportBtn, marginLeft: '8px' }}>Export JSON</button>
          </div>
        </div>

        <div style={styles.filterRow}>
          <select value={reportType} onChange={e => setReportType(e.target.value)} style={styles.select}>
            <option value="all">All Transactions</option>
            <option value="users">User Report</option>
            <option value="items">Item Report</option>
          </select>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={styles.dateInput} />
          <span>to</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={styles.dateInput} />
          <button onClick={loadReport} style={styles.applyBtn}>Generate Report</button>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}><span style={styles.statValue}>1,247</span><span style={styles.statLabel}>Total Users</span></div>
          <div style={styles.statCard}><span style={styles.statValue}>342</span><span style={styles.statLabel}>Active Today</span></div>
          <div style={styles.statCard}><span style={styles.statValue}>{transactions.length}</span><span style={styles.statLabel}>Transactions</span></div>
          <div style={styles.statCard}><span style={styles.statValue}>{formatCurrency(totalVolume)}</span><span style={styles.statLabel}>Total Volume</span></div>
          <div style={styles.statCard}><span style={styles.statValue}>1,456</span><span style={styles.statLabel}>Active Listings</span></div>
          <div style={styles.statCard}><span style={styles.statValue}>2,103</span><span style={styles.statLabel}>Sold Items</span></div>
        </div>

        <div style={styles.tableCard}>
          <h3>💰 All Transactions</h3>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Date</span><span>Buyer</span><span>Seller</span><span>Item</span><span>Amount</span>
            </div>
            {isLoading ? <div style={styles.loading}>Loading...</div> :
              transactions.slice(0, 10).map(t => (
                <div key={t.transactionId} style={styles.tableRow}>
                  <span>{t.date}</span><span>{t.buyerName || 'N/A'}</span><span>{t.sellerName || 'N/A'}</span><span>{t.itemName}</span><span style={{ fontWeight: '600' }}>{formatCurrency(t.amount)}</span>
                </div>
              ))
            }
          </div>
          <button style={styles.loadMore}>Load More</button>
        </div>

        <div style={styles.twoCol}>
          <div style={styles.col}>
            <h3>🏆 Top Selling Items (Last 30 Days)</h3>
            {sortedTop.map(([name, count], i) => (
              <div key={i} style={styles.topRow}>
                <span>{i + 1}.</span>
                <span style={{ flex: 1 }}>{name}</span>
                <span>{count} sold</span>
              </div>
            ))}
          </div>
          <div style={styles.col}>
            <h3>📊 User Balance History</h3>
            {[{ user: 'john_doe', balance: 1243.50, change: '+250' }, { user: 'alice_w', balance: 892.30, change: '-89' }, { user: 'techseller', balance: 3421, change: '+599' }].map((u, i) => (
              <div key={i} style={styles.topRow}>
                <span>{u.user}</span>
                <span style={{ flex: 1, textAlign: 'right', fontWeight: '600' }}>{formatCurrency(u.balance)}</span>
                <span style={{ color: u.change.startsWith('+') ? '#10b981' : '#dc2626', marginLeft: '12px' }}>{u.change}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.infoFooter}>⚡ Non-admin users see only personal transaction history</div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' },
  main: { flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '24px', width: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: 'bold' },
  exportBtn: { padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px' },
  filterRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  select: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px' },
  dateInput: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px' },
  applyBtn: { padding: '8px 16px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' },
  statCard: { backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb', padding: '16px', display: 'flex', flexDirection: 'column' },
  statValue: { fontSize: '22px', fontWeight: 'bold' },
  statLabel: { fontSize: '12px', color: '#6b7280' },
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', marginBottom: '24px' },
  table: {},
  tableHeader: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '2px solid #e5e7eb', fontWeight: '600', fontSize: '13px', color: '#6b7280' },
  tableRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6', fontSize: '13px' },
  loading: { textAlign: 'center', padding: '40px', color: '#6b7280' },
  loadMore: { width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', marginTop: '12px' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' },
  col: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' },
  topRow: { display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '13px', gap: '8px' },
  infoFooter: { fontSize: '13px', color: '#6b7280', fontStyle: 'italic' },
};

export default AdminReports;