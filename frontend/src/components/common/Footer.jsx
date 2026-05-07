// src/components/common/Footer.jsx

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.links}>
        <span>About</span>
        <span>Help</span>
        <span>Privacy</span>
        <span>Terms</span>
        <span>Contact</span>
      </div>
      <div style={styles.status}>
        <span style={styles.dot}></span> DB Node 1 (US-East)
        <span style={{ ...styles.dot, marginLeft: '16px' }}></span> DB Node 2 (EU-West)
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#1f2937',
    color: '#9ca3af',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    marginTop: 'auto',
  },
  links: {
    display: 'flex',
    gap: '24px',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
  },
  dot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    marginRight: '6px',
  },
};

export default Footer;