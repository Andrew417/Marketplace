/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import socketService from '../services/socketService';
import { formatCurrency } from '../utils/formatters';

const SellerHome = () => {
  const [inventory, setInventory] = useState({ items: [], total: 0, active: 0, outOfStock: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const invRes = await socketService.send('GET_INVENTORY', {});
      if (invRes.status === 'OK') setInventory(invRes);

      const reportRes = await socketService.send('GET_REPORT', { type: 'sales' });
      if (reportRes.status === 'OK') {
        const transactions = reportRes.transactions || [];
        setRecentOrders(transactions.slice(0, 5));
        
        const itemCounts = {};
        transactions.forEach(t => {
          itemCounts[t.itemName] = (itemCounts[t.itemName] || 0) + 1;
        });
        const sorted = Object.entries(itemCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([name, count]) => ({ name, sold: count, revenue: count * 100 }));
        setTopItems(sorted);
      }
    } catch {
      console.error('Failed to load seller data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, []);

  if (isLoading) {
    return <div style={styles.container}><Navbar /><div style={styles.loading}>Loading dashboard...</div><Footer /></div>;
  }

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.main}>
        {/* Stats Cards */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>💰</div>
            <div>
              <div style={styles.statValue}>$4,892</div>
              <div style={styles.statLabel}>Total Revenue</div>
              <div style={styles.statChange}>↑12% from last month</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📦</div>
            <div>
              <div style={styles.statValue}>{inventory.total}</div>
              <div style={styles.statLabel}>Active Listings</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🛒</div>
            <div>
              <div style={styles.statValue}>18</div>
              <div style={styles.statLabel}>Orders This Month</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⭐</div>
            <div>
              <div style={styles.statValue}>4.8</div>
              <div style={styles.statLabel}>Average Rating</div>
              <div style={styles.statSub}>(56 reviews)</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <Link to="/seller/inventory" style={styles.actionBtn}>
            ➕ Add New Item
          </Link>
          <Link to="/seller/inventory" style={styles.actionBtnOutline}>
            📤 Bulk Upload CSV
          </Link>
          <Link to="/seller/analytics" style={styles.actionBtnOutline}>
            📊 View Reports
          </Link>
        </div>

        {/* Sales Chart Placeholder */}
        <div style={styles.chartCard}>
          <h3 style={styles.sectionTitle}>📈 Sales Overview (Last 7 Days)</h3>
          <div style={styles.chartPlaceholder}>
            <span style={styles.chartIcon}>📊</span>
            <p>Chart Placeholder</p>
          </div>
          <div style={styles.chartStats}>
            <span>Total Sales: $1,847</span>
            <span>Orders: 6</span>
            <span>Avg: $307</span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={styles.twoCol}>
          <div style={styles.col}>
            <h3 style={styles.sectionTitle}>📦 Recent Orders</h3>
            {recentOrders.length === 0 ? (
              <p style={styles.emptyText}>No orders yet</p>
            ) : (
              recentOrders.map(order => (
                <div key={order.transactionId} style={styles.orderItem}>
                  <span style={styles.orderId}>#{order.orderNumber || order.transactionId}</span>
                  <span style={styles.orderName}>{order.itemName}</span>
                  <span style={styles.orderAmount}>{formatCurrency(order.amount)}</span>
                  <span style={styles.orderStatus}>{order.status}</span>
                </div>
              ))
            )}
            <Link to="/seller/orders" style={styles.viewLink}>View All Orders →</Link>
          </div>
          <div style={styles.col}>
            <h3 style={styles.sectionTitle}>🏷️ Top Selling Items</h3>
            {topItems.length === 0 ? (
              <p style={styles.emptyText}>No sales yet</p>
            ) : (
              topItems.map((item, i) => (
                <div key={i} style={styles.topItem}>
                  <span style={styles.topRank}>{i + 1}.</span>
                  <span style={styles.topName}>{item.name}</span>
                  <span style={styles.topSold}>{item.sold} sold</span>
                </div>
              ))
            )}
            <Link to="/seller/analytics" style={styles.viewLink}>View Full Analytics →</Link>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div style={styles.alerts}>
          {inventory.outOfStock > 0 && (
            <div style={styles.alert}>⚠️ {inventory.outOfStock} items out of stock</div>
          )}
          <div style={styles.alertGood}>✓ {inventory.active} items active</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' },
  loading: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px', color: '#6b7280' },
  main: { flex: 1, maxWidth: '1100px', margin: '0 auto', padding: '24px', width: '100%' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' },
  statIcon: { fontSize: '32px' },
  statValue: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937' },
  statLabel: { fontSize: '13px', color: '#6b7280' },
  statChange: { fontSize: '12px', color: '#10b981', marginTop: '4px' },
  statSub: { fontSize: '11px', color: '#9ca3af' },
  quickActions: { display: 'flex', gap: '12px', marginBottom: '24px' },
  actionBtn: { padding: '14px 24px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', textDecoration: 'none' },
  actionBtnOutline: { padding: '14px 24px', backgroundColor: '#fff', color: '#374151', border: '2px dashed #d1d5db', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', textDecoration: 'none' },
  chartCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '24px' },
  sectionTitle: { fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' },
  chartPlaceholder: { height: '200px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', marginBottom: '12px' },
  chartIcon: { fontSize: '48px' },
  chartStats: { display: 'flex', gap: '24px', fontSize: '14px', color: '#6b7280' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' },
  col: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' },
  emptyText: { color: '#9ca3af', fontSize: '14px', padding: '20px 0' },
  orderItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6', fontSize: '13px' },
  orderId: { color: '#6b7280', fontWeight: '500' },
  orderName: { flex: 1, marginLeft: '12px' },
  orderAmount: { fontWeight: '600' },
  orderStatus: { padding: '2px 8px', borderRadius: '10px', fontSize: '11px', backgroundColor: '#e5e7eb', textTransform: 'capitalize' },
  topItem: { display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '13px' },
  topRank: { fontWeight: 'bold', width: '24px', color: '#10b981' },
  topName: { flex: 1 },
  topSold: { color: '#6b7280' },
  viewLink: { display: 'inline-block', marginTop: '12px', color: '#10b981', fontSize: '13px', fontWeight: '500', textDecoration: 'none' },
  alerts: { display: 'flex', gap: '12px' },
  alert: { backgroundColor: '#fef3c7', color: '#92400e', padding: '12px 16px', borderRadius: '8px', fontSize: '13px' },
  alertGood: { backgroundColor: '#d1fae5', color: '#065f46', padding: '12px 16px', borderRadius: '8px', fontSize: '13px' },
};

export default SellerHome;