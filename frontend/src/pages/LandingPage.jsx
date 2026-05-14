import { Link } from 'react-router-dom';

const LandingPage = () => {
  const styles = {
    container: {
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 40px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #e5e7eb',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: 'bold',
      fontSize: '20px',
      color: '#1f2937',
    },
    logoIcon: {
      color: '#3b82f6',
      fontSize: '24px',
    },
    searchBar: {
      flex: 1,
      maxWidth: '500px',
      margin: '0 24px',
      padding: '10px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
    },
    navButtons: {
      display: 'flex',
      gap: '12px',
    },
    outlineBtn: {
      padding: '8px 20px',
      border: '2px solid #3b82f6',
      borderRadius: '8px',
      color: '#3b82f6',
      backgroundColor: 'transparent',
      fontWeight: '500',
      cursor: 'pointer',
    },
    primaryBtn: {
      padding: '8px 20px',
      border: 'none',
      borderRadius: '8px',
      color: '#fff',
      backgroundColor: '#3b82f6',
      fontWeight: '500',
      cursor: 'pointer',
    },
    hero: {
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      padding: '80px 40px',
      textAlign: 'center',
      color: '#fff',
    },
    heroTitle: {
      fontSize: '48px',
      fontWeight: 'bold',
      marginBottom: '16px',
    },
    heroSubtitle: {
      fontSize: '18px',
      opacity: 0.9,
      marginBottom: '32px',
    },
    heroButtons: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
    },
    heroPrimary: {
      padding: '14px 32px',
      backgroundColor: '#fff',
      color: '#3b82f6',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '16px',
      cursor: 'pointer',
    },
    heroSecondary: {
      padding: '14px 32px',
      backgroundColor: 'transparent',
      color: '#fff',
      border: '2px solid #fff',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '16px',
      cursor: 'pointer',
    },
    section: {
      padding: '60px 40px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    sectionTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '24px',
      color: '#1f2937',
    },
    categoryPills: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      padding: '0 40px',
      maxWidth: '1200px',
      margin: '0 auto 40px',
    },
    pill: {
      padding: '8px 20px',
      borderRadius: '20px',
      border: '1px solid #d1d5db',
      backgroundColor: '#fff',
      cursor: 'pointer',
      fontSize: '14px',
    },
    pillActive: {
      padding: '8px 20px',
      borderRadius: '20px',
      border: 'none',
      backgroundColor: '#3b82f6',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '14px',
    },
    howItWorks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '60px',
      alignItems: 'center',
    },
    step: {
      textAlign: 'center',
    },
    stepIcon: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      backgroundColor: '#eff6ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 12px',
      fontSize: '24px',
      color: '#3b82f6',
    },
    arrow: {
      fontSize: '24px',
      color: '#9ca3af',
    },
    footer: {
      backgroundColor: '#1f2937',
      color: '#9ca3af',
      padding: '24px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
    },
    footerLinks: {
      display: 'flex',
      gap: '24px',
    },
    statusDot: {
      display: 'inline-block',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#10b981',
      marginRight: '6px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>📦</span>
          ParallelMarket
        </div>
        <input
          type="text"
          placeholder="Search for anything..."
          style={styles.searchBar}
        />
        <div style={styles.navButtons}>
          <Link to="/login">
            <button style={styles.outlineBtn}>Login</button>
          </Link>
          <Link to="/register">
            <button style={styles.primaryBtn}>Sign Up</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Buy & Sell Instantly</h1>
        <p style={styles.heroSubtitle}>
          Join 10,000+ active users on the most reliable distributed marketplace
        </p>
        <div style={styles.heroButtons}>
          <Link to="/register">
            <button style={styles.heroPrimary}>Get Started</button>
          </Link>
          <Link to="/buyer/search">
            <button style={styles.heroSecondary}>Browse Items</button>
          </Link>
        </div>
        <div style={{ marginTop: '20px', opacity: 0.8, fontSize: '14px' }}>
          📱 iPhone 13 Pro just sold for $599 • 2 minutes ago
        </div>
      </section>

      {/* Trending Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🔥 Trending Near You</h2>
        <div style={{ display: 'flex', gap: '16px', overflow: 'auto', padding: '8px 0' }}>
          {['iPhone 14 Pro - $749', 'MacBook Air M1 - $689', 'Sony WH-1000XM4 - $199', 'Mechanical Keyboard - $89', 'Book Set - $34'].map((item, i) => (
            <div key={i} style={{
              minWidth: '200px',
              padding: '16px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ height: '120px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', color: '#9ca3af' }}>
                📷
              </div>
              <div style={{ fontWeight: '600' }}>{item.split(' - ')[0]}</div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>@{item.toLowerCase().split(' ')[0]}seller</div>
              <div style={{ fontWeight: 'bold', marginTop: '4px' }}>{item.split(' - ')[1]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <div style={styles.categoryPills}>
        {['All', 'Electronics', 'Fashion', 'Home', 'Books', 'Sports', 'Toys'].map((cat, i) => (
          <button key={i} style={i === 0 ? styles.pillActive : styles.pill}>{cat}</button>
        ))}
      </div>

      {/* How It Works */}
      <section style={styles.section}>
        <h2 style={{ ...styles.sectionTitle, textAlign: 'center' }}>How It Works</h2>
        <div style={styles.howItWorks}>
          <div style={styles.step}>
            <div style={styles.stepIcon}>👤</div>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>1. Sign Up Free</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Create your account<br/>in seconds</div>
          </div>
          <div style={styles.arrow}>→</div>
          <div style={styles.step}>
            <div style={styles.stepIcon}>🔍</div>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>2. Browse or List</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Find items or<br/>list your own</div>
          </div>
          <div style={styles.arrow}>→</div>
          <div style={styles.step}>
            <div style={styles.stepIcon}>🛡️</div>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>3. Secure Transaction</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Atomic transfer<br/>of money & items</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerLinks}>
          <span>About</span>
          <span>Help</span>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
        <div>
          <span style={styles.statusDot}></span> DB Node 1 (US-East)
          <span style={{ ...styles.statusDot, marginLeft: '16px' }}></span> DB Node 2 (EU-West)
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;