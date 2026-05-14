/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import socketService from '../../services/socketService';
import { formatCurrency } from '../../utils/formatters';

const Checkout = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [balance, setBalance] = useState(0);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const accountRes = await socketService.send('GET_ACCOUNT', {});
      if (accountRes.status === 'OK') setBalance(accountRes.balance);
      const searchRes = await socketService.send('SEARCH', { query: '' });
      if (searchRes.status === 'OK') {
        const found = searchRes.items.find(i => i.itemId === itemId);
        setItem(found || null);
      }
    } catch {
      setError('Failed to load checkout data');
    }
  }, [itemId]);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) document.getElementById(`code-${index + 1}`)?.focus();
  };

  const handlePurchase = async () => {
    if (!item) return;
    try {
      const response = await socketService.send('PURCHASE', { itemId: item.itemId });
      if (response.status === 'OK') { setOrderDetails(response); setShowSuccess(true); }
      else setError(response.message || 'Purchase failed');
    } catch { setError('Connection error.'); }
  };

  if (showSuccess && orderDetails) {
    return (
      <div style={styles.container}><Navbar />
        <div style={styles.successOverlay}><div style={styles.successCard}>
          <div style={styles.successCheck}>✓</div><h2>Purchase Successful!</h2><p>Thank you for your order.</p>
          <div style={styles.orderSummary}><p><strong>Order ID:</strong> {orderDetails.orderNumber}</p><p><strong>Item:</strong> {item?.name}</p><p><strong>Amount:</strong> {formatCurrency(item?.price || 0)}</p><p><strong>New Balance:</strong> {formatCurrency(orderDetails.newBalance)}</p></div>
          <div style={styles.successActions}><button onClick={() => navigate('/buyer/purchases')} style={styles.viewOrderBtn}>View Order</button><button onClick={() => navigate('/buyer/search')} style={styles.continueBtn}>Continue Shopping</button></div>
        </div></div><Footer /></div>
    );
  }

  const minutes = Math.floor(timer / 60), seconds = timer % 60;
  return (
    <div style={styles.container}><Navbar /><div style={styles.main}><div style={styles.checkoutCard}>
      <h2 style={styles.title}>Checkout</h2>
      {error && <div style={styles.error}>{error}</div>}
      <div style={styles.summary}><div style={styles.summaryRow}><span>{item?.name || 'Loading...'}</span><span>Qty: 1</span></div><div style={styles.summaryRow}><span>Seller: @{item?.sellerName}</span></div><hr style={styles.divider} /><div style={styles.summaryRow}><span>Subtotal</span><span>{formatCurrency(item?.price || 0)}</span></div><div style={styles.summaryRow}><span>Fees</span><span>$0.00</span></div><hr style={styles.divider} /><div style={{ ...styles.summaryRow, fontWeight: 'bold', fontSize: '18px' }}><span>Total</span><span>{formatCurrency(item?.price || 0)}</span></div></div>
      <div style={styles.balanceBox}><div style={styles.balanceRow}><span>Current Balance</span><span>{formatCurrency(balance)}</span></div><div style={styles.balanceRow}><span>After Purchase</span><span style={{ color: '#10b981', fontWeight: 'bold' }}>{formatCurrency(balance - (item?.price || 0))}</span></div><div style={styles.balanceCheck}>{(balance >= (item?.price || 0)) ? '✓ Sufficient Balance' : '❌ Insufficient Balance'}</div></div>
      <div style={styles.twoFA}><h4 style={styles.twoFATitle}>⚠️ 2FA Required (Purchase over $100)</h4><p style={styles.twoFALabel}>Enter 6-digit code from email</p><div style={styles.codeInputs}>{code.map((digit, i) => (<input key={i} id={`code-${i}`} type="text" maxLength="1" value={digit} onChange={(e) => handleCodeChange(i, e.target.value)} style={styles.codeInput} />))}</div><div style={styles.timer}>Code expires in {minutes}:{seconds.toString().padStart(2, '0')}</div><button style={styles.resendBtn}>Resend Code</button></div>
      <div style={styles.atomic}>⚡ Atomic Transaction: All steps complete or fully roll back<div style={styles.steps}><div>1. Debit Buyer ✓</div><div>2. Credit Seller ✓</div><div>3. Transfer Ownership ✓</div></div></div>
      <div style={styles.actions}><button onClick={() => navigate(-1)} style={styles.cancelBtn}>Cancel</button><button onClick={handlePurchase} style={{ ...styles.confirmBtn, opacity: balance < (item?.price || 0) ? 0.5 : 1 }} disabled={balance < (item?.price || 0)}>Confirm & Pay</button></div>
    </div></div><Footer /></div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' },
  main: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 20px' },
  checkoutCard: { backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '32px', width: '500px', maxWidth: '100%' },
  title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' },
  error: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  summary: { backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px', marginBottom: '16px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px' },
  divider: { border: 'none', borderTop: '1px dashed #d1d5db', margin: '8px 0' },
  balanceBox: { padding: '16px', marginBottom: '16px' },
  balanceRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' },
  balanceCheck: { fontSize: '14px', fontWeight: '500', color: '#10b981' },
  twoFA: { backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '16px', marginBottom: '16px' },
  twoFATitle: { fontSize: '14px', fontWeight: '600', color: '#92400e', marginBottom: '8px' },
  twoFALabel: { fontSize: '13px', color: '#6b7280', marginBottom: '12px' },
  codeInputs: { display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' },
  codeInput: { width: '44px', height: '52px', textAlign: 'center', fontSize: '22px', fontWeight: 'bold', border: '2px solid #d1d5db', borderRadius: '8px' },
  timer: { textAlign: 'center', fontSize: '13px', color: '#92400e', marginBottom: '8px' },
  resendBtn: { display: 'block', margin: '0 auto', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '13px' },
  atomic: { backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#1e40af', marginBottom: '20px' },
  steps: { display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px' },
  actions: { display: 'flex', gap: '12px' },
  cancelBtn: { flex: 1, padding: '14px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', fontSize: '15px', cursor: 'pointer' },
  confirmBtn: { flex: 1, padding: '14px', border: 'none', borderRadius: '8px', backgroundColor: '#10b981', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  successOverlay: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' },
  successCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '40px', textAlign: 'center', maxWidth: '450px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' },
  successCheck: { width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#10b981', fontSize: '36px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  orderSummary: { backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px', margin: '20px 0', textAlign: 'left' },
  successActions: { display: 'flex', gap: '12px', marginTop: '20px' },
  viewOrderBtn: { flex: 1, padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  continueBtn: { flex: 1, padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', fontSize: '14px', cursor: 'pointer' },
};

export default Checkout;