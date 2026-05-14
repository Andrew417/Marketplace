import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const ApiDocs = () => {
  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.main}>
        <div style={styles.badge}>Developer Portal</div>
        <h1 style={styles.title}>ParallelMarket API v1.0</h1>
        <div style={styles.baseUrl}>
          Base URL: <code style={styles.code}>https://api.parallelmarket.com/v1</code>
          <button style={styles.copyBtn}>📋 Copy</button>
        </div>

        <div style={styles.authBox}>
          🔐 All API requests require authentication via <strong>Bearer Token</strong> or <strong>API Key</strong>
        </div>

        {/* REST Endpoints */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📚 REST Endpoints</h2>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span style={styles.colMethod}>Method</span>
              <span style={styles.colEndpoint}>Endpoint</span>
              <span style={styles.colDesc}>Description</span>
            </div>
            {[
              ['POST', '/auth/register', 'Create account'],
              ['POST', '/auth/login', 'Get JWT token'],
              ['GET', '/items/search', 'Search items'],
              ['POST', '/items/purchase', 'Purchase item'],
              ['GET', '/user/balance', 'Get balance'],
              ['POST', '/user/deposit', 'Deposit funds'],
              ['GET', '/user/transactions', 'Transaction history'],
            ].map(([method, endpoint, desc]) => (
              <div key={endpoint} style={styles.tableRow}>
                <span style={{ ...styles.method, backgroundColor: method === 'GET' ? '#dbeafe' : '#d1fae5', color: method === 'GET' ? '#1e40af' : '#065f46' }}>{method}</span>
                <span style={styles.endpoint}>{endpoint}</span>
                <span style={styles.desc}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* External Store API */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🏪 External Store Integration</h2>
          <p style={styles.cardDesc}>API for partner stores to list products and place orders on behalf of customers.</p>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span style={styles.colMethod}>Method</span>
              <span style={styles.colEndpoint}>Endpoint</span>
              <span style={styles.colDesc}>Description</span>
            </div>
            {[
              ['GET', '/external/products', 'List marketplace items'],
              ['POST', '/external/orders', 'Place order for customer'],
              ['GET', '/external/orders/:id', 'Get order status'],
            ].map(([method, endpoint, desc]) => (
              <div key={endpoint} style={styles.tableRow}>
                <span style={{ ...styles.method, backgroundColor: method === 'GET' ? '#dbeafe' : '#d1fae5', color: method === 'GET' ? '#1e40af' : '#065f46' }}>{method}</span>
                <span style={styles.endpoint}>{endpoint}</span>
                <span style={styles.desc}>{desc}</span>
              </div>
            ))}
          </div>

          <div style={styles.codeBlock}>
            <div style={styles.codeHeader}>Example Request</div>
            <pre style={styles.codeText}>{`curl -X GET \\
  https://api.parallelmarket.com/v1/external/products \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</pre>
          </div>
        </div>

        {/* SOAP */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔧 SOAP Web Services</h2>
          <p style={styles.cardDesc}>
            WSDL: <code style={styles.code}>https://api.parallelmarket.com/soap?wsdl</code>
          </p>
          <div style={styles.operationList}>
            {['CreateAccount', 'SearchItems', 'PurchaseItem'].map(op => (
              <span key={op} style={styles.operationTag}>{op}</span>
            ))}
          </div>
        </div>

        {/* Rate Limits */}
        <div style={styles.rateCard}>
          <span>Rate Limits: 1000 requests per hour per API key</span>
          <div style={styles.rateBar}>
            <div style={styles.rateFill}></div>
          </div>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>423/1000 used</span>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' },
  main: { flex: 1, maxWidth: '900px', margin: '0 auto', padding: '24px', width: '100%' },
  badge: { display: 'inline-block', padding: '4px 12px', backgroundColor: '#8b5cf6', color: '#fff', borderRadius: '16px', fontSize: '12px', fontWeight: '600', marginBottom: '12px' },
  title: { fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' },
  baseUrl: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '15px', color: '#4b5563' },
  code: { backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px' },
  copyBtn: { padding: '4px 10px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px' },
  authBox: { backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', color: '#1e40af', marginBottom: '24px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '20px' },
  cardTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' },
  cardDesc: { fontSize: '14px', color: '#6b7280', marginBottom: '16px' },
  table: {},
  tableHeader: { display: 'flex', padding: '10px 0', borderBottom: '2px solid #e5e7eb', fontWeight: '600', fontSize: '13px', color: '#6b7280' },
  tableRow: { display: 'flex', padding: '10px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'center', fontSize: '13px' },
  colMethod: { width: '80px' },
  colEndpoint: { flex: 2, fontFamily: 'monospace', fontSize: '13px' },
  colDesc: { flex: 2, color: '#6b7280' },
  method: { padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' },
  endpoint: { flex: 2, fontFamily: 'monospace', fontSize: '13px', color: '#1f2937' },
  desc: { flex: 2, color: '#6b7280' },
  codeBlock: { marginTop: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' },
  codeHeader: { backgroundColor: '#f9fafb', padding: '8px 16px', fontSize: '12px', color: '#6b7280', borderBottom: '1px solid #e5e7eb' },
  codeText: { backgroundColor: '#1f2937', color: '#e5e7eb', padding: '16px', fontSize: '13px', overflow: 'auto', margin: 0, fontFamily: 'monospace', lineHeight: '1.6' },
  operationList: { display: 'flex', gap: '8px', marginTop: '8px' },
  operationTag: { padding: '6px 14px', backgroundColor: '#f3f4f6', borderRadius: '16px', fontSize: '13px', fontFamily: 'monospace' },
  rateCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' },
  rateBar: { height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' },
  rateFill: { width: '42%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' },
};

export default ApiDocs;