// src/components/common/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useMode from '../../context/useMode';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isBuyer, isSeller, switchMode } = useMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleModeSwitch = (newMode) => {
    switchMode(newMode);
    if (newMode === 'buyer') navigate('/buyer/dashboard');
    else if (newMode === 'seller') navigate('/seller/dashboard');
    else if (newMode === 'admin') navigate('/admin/dashboard');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>📦</span>
          ParallelMarket
        </Link>
        <div style={styles.modeSwitcher}>
          <button
            onClick={() => handleModeSwitch('buyer')}
            style={isBuyer ? styles.modeActive : styles.modeInactive}
          >
            🛍️ Buyer
          </button>
          <button
            onClick={() => handleModeSwitch('seller')}
            style={isSeller ? styles.modeActiveGreen : styles.modeInactive}
          >
            🏪 Seller
          </button>
        </div>
      </div>

      <div style={styles.center}>
        <input
          type="text"
          placeholder={isBuyer ? "Search items to buy..." : "Search inventory..."}
          style={styles.searchBar}
        />
      </div>

      <div style={styles.right}>
        {isAuthenticated ? (
          <>
            <div style={styles.balance}>
              💰 ${user?.balance?.toFixed(2) || '0.00'}
            </div>
            <div style={styles.avatar}>
              👤 {user?.username || 'User'}
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button style={styles.outlineBtn}>Login</button>
            </Link>
            <Link to="/register">
              <button style={styles.primaryBtn}>Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#1f2937',
  },
  logoIcon: {
    fontSize: '22px',
  },
  modeSwitcher: {
    display: 'flex',
    backgroundColor: '#f3f4f6',
    borderRadius: '20px',
    padding: '3px',
  },
  modeActive: {
    padding: '8px 16px',
    borderRadius: '18px',
    border: 'none',
    backgroundColor: '#fff',
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  modeActiveGreen: {
    padding: '8px 16px',
    borderRadius: '18px',
    border: 'none',
    backgroundColor: '#fff',
    color: '#10b981',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  modeInactive: {
    padding: '8px 16px',
    borderRadius: '18px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#6b7280',
    fontWeight: '500',
    fontSize: '13px',
    cursor: 'pointer',
  },
  center: {
    flex: 1,
    maxWidth: '500px',
    margin: '0 24px',
  },
  searchBar: {
    width: '100%',
    padding: '10px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  balance: {
    backgroundColor: '#eff6ff',
    padding: '6px 12px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#3b82f6',
  },
  avatar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '500',
    fontSize: '14px',
  },
  logoutBtn: {
    padding: '6px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#6b7280',
    fontSize: '13px',
    cursor: 'pointer',
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
};

export default Navbar;