import { useState } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('security');
  const [twoFA, setTwoFA] = useState({ purchaseOver100: true, allPurchases: false, accountChanges: false });
  const [apiKeys] = useState([
    { id: 1, key: 'pk_live_••••••••••••••••', created: 'Mar 1, 2026', lastUsed: 'Today' },
  ]);
  const [showKey, setShowKey] = useState(false);

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.main}>
        <h2 style={styles.pageTitle}>Account Settings</h2>

        <div style={styles.layout}>
          {/* Sidebar */}
          <div style={styles.sidebar}>
            {['Profile', 'Security', 'Notifications', 'API Keys', 'Billing'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                style={{
                  ...styles.sidebarItem,
                  backgroundColor: activeTab === tab.toLowerCase().replace(' ', '-') ? '#eff6ff' : 'transparent',
                  color: activeTab === tab.toLowerCase().replace(' ', '-') ? '#3b82f6' : '#374151',
                  fontWeight: activeTab === tab.toLowerCase().replace(' ', '-') ? '600' : '400',
                }}
              >
                {tab === 'Security' && '🔐 '}
                {tab === 'Profile' && '👤 '}
                {tab === 'Notifications' && '🔔 '}
                {tab === 'API Keys' && '🔑 '}
                {tab === 'Billing' && '💳 '}
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={styles.content}>
            {activeTab === 'security' && (
              <div>
                <h3 style={styles.sectionTitle}>🔐 Two-Factor Authentication (2FA)</h3>
                <div style={styles.card}>
                  <div style={styles.toggleRow}>
                    <div>
                      <div style={styles.toggleLabel}>Enable 2FA for purchases over $100</div>
                      <div style={styles.toggleDesc}>Required for high-value transactions</div>
                    </div>
                    <button
                      onClick={() => setTwoFA(prev => ({ ...prev, purchaseOver100: !prev.purchaseOver100 }))}
                      style={{
                        ...styles.toggleBtn,
                        backgroundColor: twoFA.purchaseOver100 ? '#10b981' : '#d1d5db',
                      }}
                    >
                      <div style={{
                        ...styles.toggleDot,
                        marginLeft: twoFA.purchaseOver100 ? '20px' : '2px',
                      }} />
                    </button>
                  </div>
                  <div style={styles.toggleRow}>
                    <div>
                      <div style={styles.toggleLabel}>Enable 2FA for all purchases</div>
                    </div>
                    <button
                      onClick={() => setTwoFA(prev => ({ ...prev, allPurchases: !prev.allPurchases }))}
                      style={{
                        ...styles.toggleBtn,
                        backgroundColor: twoFA.allPurchases ? '#10b981' : '#d1d5db',
                      }}
                    >
                      <div style={{
                        ...styles.toggleDot,
                        marginLeft: twoFA.allPurchases ? '20px' : '2px',
                      }} />
                    </button>
                  </div>
                  <div style={styles.toggleRow}>
                    <div>
                      <div style={styles.toggleLabel}>Enable 2FA for account changes</div>
                    </div>
                    <button
                      onClick={() => setTwoFA(prev => ({ ...prev, accountChanges: !prev.accountChanges }))}
                      style={{
                        ...styles.toggleBtn,
                        backgroundColor: twoFA.accountChanges ? '#10b981' : '#d1d5db',
                      }}
                    >
                      <div style={{
                        ...styles.toggleDot,
                        marginLeft: twoFA.accountChanges ? '20px' : '2px',
                      }} />
                    </button>
                  </div>
                  <div style={styles.verifyInfo}>
                    Verification method: Email (john@email.com) <button style={styles.linkBtn}>Change Email</button>
                  </div>
                </div>

                <h3 style={{ ...styles.sectionTitle, marginTop: '32px' }}>🔒 Change Password</h3>
                <div style={styles.card}>
                  <input type="password" placeholder="Current Password" style={styles.input} />
                  <input type="password" placeholder="New Password" style={styles.input} />
                  <div style={styles.strengthBar}>
                    <div style={{ ...styles.strengthFill, width: '80%', backgroundColor: '#10b981' }} />
                  </div>
                  <span style={{ fontSize: '12px', color: '#10b981' }}>Strength: Strong</span>
                  <input type="password" placeholder="Confirm New Password" style={styles.input} />
                  <button style={styles.updateBtn}>Update Password</button>
                </div>
              </div>
            )}

            {activeTab === 'api-keys' && (
              <div>
                <h3 style={styles.sectionTitle}>🔑 API Keys</h3>
                <div style={styles.infoBox}>
                  ℹ️ Use API keys to integrate your store with external platforms
                </div>
                <div style={styles.card}>
                  {apiKeys.map(key => (
                    <div key={key.id} style={styles.apiKeyRow}>
                      <div>
                        <div style={styles.apiKeyLabel}>API Key {key.id}</div>
                        <div style={styles.apiKeyValue}>
                          {showKey ? 'pk_live_abc123def456ghi789' : key.key}
                        </div>
                        <div style={styles.apiKeyMeta}>Created: {key.created} • Last used: {key.lastUsed}</div>
                      </div>
                      <div style={styles.apiKeyActions}>
                        <button style={styles.linkBtn} onClick={() => setShowKey(!showKey)}>
                          {showKey ? 'Hide' : 'Copy'}
                        </button>
                        <button style={styles.linkBtn}>Regenerate</button>
                        <button style={{ ...styles.linkBtn, color: '#dc2626' }}>Revoke</button>
                      </div>
                    </div>
                  ))}
                  <button style={styles.generateBtn}>+ Generate New API Key</button>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div style={styles.card}>
                <p style={{ color: '#6b7280' }}>Profile settings placeholder</p>
              </div>
            )}
            {activeTab === 'notifications' && (
              <div style={styles.card}>
                <p style={{ color: '#6b7280' }}>Notification settings placeholder</p>
              </div>
            )}
            {activeTab === 'billing' && (
              <div style={styles.card}>
                <p style={{ color: '#6b7280' }}>Billing settings placeholder</p>
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
  main: { flex: 1, maxWidth: '1000px', margin: '0 auto', padding: '24px', width: '100%' },
  pageTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' },
  layout: { display: 'flex', gap: '24px' },
  sidebar: { width: '220px', display: 'flex', flexDirection: 'column', gap: '4px' },
  sidebarItem: { padding: '12px 16px', border: 'none', borderRadius: '8px', textAlign: 'left', fontSize: '14px', cursor: 'pointer' },
  content: { flex: 1 },
  sectionTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' },
  toggleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' },
  toggleLabel: { fontSize: '14px', fontWeight: '500' },
  toggleDesc: { fontSize: '12px', color: '#6b7280' },
  toggleBtn: { width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px', transition: '0.2s' },
  toggleDot: { width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff', transition: '0.2s' },
  verifyInfo: { fontSize: '13px', color: '#6b7280', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' },
  linkBtn: { background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '13px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', marginBottom: '12px' },
  strengthBar: { height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', marginBottom: '4px' },
  strengthFill: { height: '100%', borderRadius: '2px' },
  updateBtn: { padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  infoBox: { backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#1e40af', marginBottom: '16px' },
  apiKeyRow: { padding: '16px 0', borderBottom: '1px solid #f3f4f6' },
  apiKeyLabel: { fontSize: '14px', fontWeight: '600' },
  apiKeyValue: { fontSize: '14px', fontFamily: 'monospace', color: '#6b7280', margin: '4px 0' },
  apiKeyMeta: { fontSize: '12px', color: '#9ca3af' },
  apiKeyActions: { display: 'flex', gap: '12px', marginTop: '8px' },
  generateBtn: { marginTop: '16px', padding: '10px 16px', border: '2px dashed #d1d5db', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', width: '100%' },
};

export default Settings;