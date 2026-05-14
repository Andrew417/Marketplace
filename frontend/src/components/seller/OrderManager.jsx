/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import socketService from '../../services/socketService';
import { formatCurrency } from '../../utils/formatters';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      const response = await socketService.send('GET_REPORT', { type: 'sales' });
      if (response.status === 'OK') setOrders(response.transactions || []);
    } catch { console.error('Failed to load orders'); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { loadOrders(); }, []);

  const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const filteredOrders = activeTab === 'All' ? orders : orders.filter(o => o.status?.toLowerCase() === activeTab.toLowerCase());

  const updateStatus = async (orderId, newStatus) => {
    console.log('Update order', orderId, 'to', newStatus);
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.main}>
        <div style={styles.header}>
          <h2 style={styles.title}>Orders</h2>
          <button style={styles.exportBtn}>📥 Export CSV</button>
        </div>

        <div style={styles.tabs}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={activeTab === tab ? styles.tabActive : styles.tab}>
              {tab} {tab === 'All' && `(${orders.length})`}
            </button>
          ))}
        </div>

        {isLoading ? <div style={styles.loading}>Loading orders...</div> : (
          <div>
            {activeTab === 'Pending' && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Pending Orders ({filteredOrders.length}) - Action Required</h3>
                {filteredOrders.map(order => (
                  <div key={order.transactionId} style={styles.orderCard}>
                    <div style={styles.orderHeader}>
                      <span style={styles.orderMeta}>#{order.orderNumber} • {order.date} • 2 hours ago</span>
                      <span style={styles.newBadge}>New</span>
                    </div>
                    <div style={styles.orderBody}>
                      <div style={styles.orderItem}>{order.itemName} - {formatCurrency(order.amount)} ×1</div>
                      <div style={styles.orderBuyer}>Buyer: {order.buyerName} • Shipping Address: 123 Main St, Cairo, Egypt</div>
                    </div>
                    <div style={styles.orderActions}>
                      <button onClick={() => updateStatus(order.transactionId, 'Processing')} style={styles.acceptBtn}>Accept Order</button>
                      <button style={styles.declineBtn}>Decline</button>
                      <button style={styles.messageBtn}>Message Buyer</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Processing' && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Processing ({filteredOrders.length})</h3>
                {filteredOrders.map(order => (
                  <div key={order.transactionId} style={styles.orderCard}>
                    <div style={styles.orderHeader}>
                      <span style={styles.orderMeta}>#{order.orderNumber} • {order.date}</span>
                    </div>
                    <div style={styles.orderBody}>
                      <div style={styles.orderItem}>{order.itemName} - {formatCurrency(order.amount)} ×1</div>
                      <div style={styles.orderBuyer}>Buyer: {order.buyerName}</div>
                      <div style={styles.statusRow}>
                        Status: <select style={styles.statusSelect}><option>Processing</option><option>Ready to Ship</option><option>Shipped</option><option>Delivered</option></select> → Ready to Ship
                      </div>
                    </div>
                    <div style={styles.orderActions}>
                      <button style={styles.acceptBtn}>Mark as Shipped</button>
                      <button style={styles.messageBtn}>Add Tracking</button>
                      <button style={styles.messageBtn}>Print Label</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(activeTab === 'Shipped' || activeTab === 'Delivered' || activeTab === 'All') && filteredOrders.map(order => (
              <div key={order.transactionId} style={{ ...styles.orderCard, opacity: 0.7 }}>
                <div style={styles.orderHeader}>
                  <span style={styles.orderMeta}>#{order.orderNumber} • {order.date}</span>
                  <span style={{ ...styles.newBadge, backgroundColor: order.status === 'Delivered' ? '#d1fae5' : '#fef3c7', color: order.status === 'Delivered' ? '#065f46' : '#92400e' }}>{order.status}</span>
                </div>
                <div style={styles.orderItem}>{order.itemName} - {formatCurrency(order.amount)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
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
  tabActive: { padding: '8px 16px', border: 'none', backgroundColor: '#d1fae5', color: '#065f46', fontSize: '14px', fontWeight: '600', cursor: 'pointer', borderRadius: '6px' },
  loading: { textAlign: 'center', padding: '60px', color: '#6b7280' },
  section: { marginBottom: '24px' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' },
  orderCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', marginBottom: '12px' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  orderMeta: { fontSize: '13px', color: '#6b7280' },
  newBadge: { padding: '2px 8px', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '10px', fontSize: '11px', fontWeight: '600' },
  orderBody: { marginBottom: '12px' },
  orderItem: { fontSize: '15px', fontWeight: '600', marginBottom: '4px' },
  orderBuyer: { fontSize: '13px', color: '#6b7280' },
  statusRow: { fontSize: '13px', color: '#6b7280', marginTop: '4px' },
  statusSelect: { padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', marginLeft: '8px' },
  orderActions: { display: 'flex', gap: '8px', borderTop: '1px solid #f3f4f6', paddingTop: '12px' },
  acceptBtn: { padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', fontSize: '13px' },
  declineBtn: { padding: '8px 16px', border: '1px solid #dc2626', borderRadius: '6px', color: '#dc2626', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px' },
  messageBtn: { padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', color: '#374151' },
};

export default OrderManager;