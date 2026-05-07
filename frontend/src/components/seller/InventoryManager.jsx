/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import socketService from '../../services/socketService';
import { formatCurrency } from '../../utils/formatters';

const InventoryManager = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', brand: '', price: '', quantity: '1', description: '', category: 'Electronics', condition: 'Good' });

  const loadInventory = useCallback(async () => {
    try {
      const response = await socketService.send('GET_INVENTORY', {});
      if (response.status === 'OK') {
        const itemList = response.items || [];
        setItems(itemList);
        setFilteredItems(itemList);
      }
    } catch {
      console.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadInventory(); }, []);

  useEffect(() => {
    if (filter === 'All') setFilteredItems(items);
    else if (filter === 'Active') setFilteredItems(items.filter(i => i.status === 'active'));
    else if (filter === 'Out of Stock') setFilteredItems(items.filter(i => i.status === 'out_of_stock'));
  }, [filter, items]);

  const activeCount = items.filter(i => i.status === 'active').length;
  const outOfStockCount = items.filter(i => i.status === 'out_of_stock').length;

  const openAddModal = () => {
    setEditItem(null);
    setForm({ name: '', brand: '', price: '', quantity: '1', description: '', category: 'Electronics', condition: 'Good' });
    setShowAddModal(true);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setForm({
      name: item.name, brand: item.brand, price: item.price.toString(),
      quantity: item.quantity.toString(), description: item.description || '',
      category: item.category || 'Electronics', condition: item.condition || 'Good'
    });
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.brand || !form.price || parseFloat(form.price) <= 0) return;
    try {
      if (editItem) {
        await socketService.send('EDIT_ITEM', { itemId: editItem.itemId, ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) });
      } else {
        await socketService.send('ADD_ITEM', { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) });
      }
      setShowAddModal(false);
      loadInventory();
    } catch { console.error('Save failed'); }
  };

  const handleRemove = async (itemId) => {
    try {
      await socketService.send('REMOVE_ITEM', { itemId });
      loadInventory();
    } catch { console.error('Remove failed'); }
  };

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 0) return;
    try {
      await socketService.send('EDIT_ITEM', { itemId, quantity: newQty });
      loadInventory();
    } catch { console.error('Quantity update failed'); }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.main}>
        <div style={styles.header}>
          <h2 style={styles.title}>Inventory Management</h2>
          <div style={styles.headerActions}>
            <button onClick={openAddModal} style={styles.addBtn}>+ Add New Item</button>
            <button onClick={() => setShowBulkModal(true)} style={styles.bulkBtn}>📤 Bulk Upload CSV</button>
          </div>
        </div>

        <div style={styles.filterBar}>
          {['All', 'Active', 'Out of Stock'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={filter === f ? styles.filterActive : styles.filterBtn}>
              {f} {f === 'All' ? `(${items.length})` : f === 'Active' ? `(${activeCount})` : `(${outOfStockCount})`}
            </button>
          ))}
        </div>

        <div style={styles.summary}>
          <span style={styles.summaryItem}>{items.length} Total</span>
          <span style={{ ...styles.summaryItem, color: '#10b981' }}>{activeCount} Active</span>
          <span style={{ ...styles.summaryItem, color: '#f59e0b' }}>{outOfStockCount} Out of Stock</span>
        </div>

        {isLoading ? <div style={styles.loading}>Loading inventory...</div> : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span style={styles.colName}>Item Name</span>
              <span style={styles.colPrice}>Price</span>
              <span style={styles.colQty}>Quantity</span>
              <span style={styles.colStatus}>Status</span>
              <span style={styles.colActions}>Actions</span>
            </div>
            {filteredItems.map(item => (
              <div key={item.itemId} style={{ ...styles.tableRow, backgroundColor: item.status === 'out_of_stock' ? '#f9fafb' : '#fff' }}>
                <span style={styles.colName}>
                  <strong>{item.name}</strong>
                  <br /><small style={{ color: '#6b7280' }}>Brand: {item.brand}</small>
                </span>
                <span style={styles.colPrice}>{formatCurrency(item.price)}</span>
                <span style={styles.colQty}>
                  <button onClick={() => handleQuantityChange(item.itemId, item.quantity - 1)} style={styles.qtyBtn}>−</button>
                  <span style={styles.qtyValue}>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.itemId, item.quantity + 1)} style={styles.qtyBtn}>+</button>
                </span>
                <span style={styles.colStatus}>
                  <span style={{ ...styles.statusBadge, backgroundColor: item.status === 'active' ? '#d1fae5' : '#e5e7eb', color: item.status === 'active' ? '#065f46' : '#374151' }}>
                    {item.status === 'active' ? 'Active' : 'Out of Stock'}
                  </span>
                </span>
                <span style={styles.colActions}>
                  <button onClick={() => openEditModal(item)} style={styles.actionLink}>Edit</button>
                  <button onClick={() => handleRemove(item.itemId)} style={{ ...styles.actionLink, color: '#dc2626' }}>Remove</button>
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={styles.infoFooter}>
          ℹ️ Items with 0 quantity are automatically hidden from buyer search results
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>{editItem ? 'Edit Item' : 'Add New Item'}</h3>
            <div style={styles.formGrid}>
              <input placeholder="Item Name*" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={styles.input} />
              <input placeholder="Brand*" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} style={styles.input} />
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={styles.input}>
                {['Electronics', 'Fashion', 'Home', 'Books', 'Sports', 'Other'].map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={form.condition} onChange={e => setForm({...form, condition: e.target.value})} style={styles.input}>
                {['New', 'Like New', 'Good', 'Fair'].map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Price* ($)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={styles.input} min="0.01" step="0.01" />
              <input type="number" placeholder="Quantity*" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} style={styles.input} min="1" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ ...styles.input, gridColumn: 'span 2', height: '80px' }} />
            </div>
            <div style={styles.modalActions}>
              <button onClick={() => setShowAddModal(false)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleSave} style={styles.saveBtn}>Save Item</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Bulk Upload Products (CSV)</h3>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>📥 Download Sample Template</p>
            <div style={styles.dropzone}>📁 Drop CSV file here or click to browse</div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Required: name, brand, price, quantity, description</p>
            <div style={styles.warning}>⚠️ All-or-nothing: Invalid row = entire batch rejected</div>
            <div style={styles.modalActions}>
              <button onClick={() => setShowBulkModal(false)} style={styles.cancelBtn}>Cancel</button>
              <button style={styles.saveBtn}>Upload All</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' },
  main: { flex: 1, maxWidth: '1100px', margin: '0 auto', padding: '24px', width: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937' },
  headerActions: { display: 'flex', gap: '12px' },
  addBtn: { padding: '10px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  bulkBtn: { padding: '10px 20px', backgroundColor: '#fff', color: '#374151', border: '2px dashed #d1d5db', borderRadius: '8px', cursor: 'pointer' },
  filterBar: { display: 'flex', gap: '8px', marginBottom: '16px' },
  filterBtn: { padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '20px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px' },
  filterActive: { padding: '8px 16px', border: 'none', borderRadius: '20px', backgroundColor: '#10b981', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  summary: { display: 'flex', gap: '16px', marginBottom: '16px' },
  summaryItem: { fontSize: '14px', fontWeight: '500', padding: '6px 12px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' },
  loading: { textAlign: 'center', padding: '60px', color: '#6b7280' },
  table: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  tableHeader: { display: 'flex', padding: '12px 20px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontWeight: '600', fontSize: '13px', color: '#6b7280' },
  tableRow: { display: 'flex', padding: '14px 20px', borderBottom: '1px solid #f3f4f6', alignItems: 'center', fontSize: '14px' },
  colName: { flex: 3 },
  colPrice: { flex: 1, fontWeight: '600' },
  colQty: { flex: 1, display: 'flex', alignItems: 'center', gap: '8px' },
  colStatus: { flex: 1 },
  colActions: { flex: 1, display: 'flex', gap: '12px' },
  qtyBtn: { width: '28px', height: '28px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyValue: { fontWeight: '600', minWidth: '24px', textAlign: 'center' },
  statusBadge: { padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' },
  actionLink: { background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '13px' },
  infoFooter: { marginTop: '16px', fontSize: '12px', color: '#6b7280', fontStyle: 'italic' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200 },
  modal: { backgroundColor: '#fff', borderRadius: '16px', padding: '32px', width: '550px', maxWidth: '90%' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' },
  input: { padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', width: '100%' },
  modalActions: { display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end' },
  cancelBtn: { padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer' },
  saveBtn: { padding: '10px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  dropzone: { border: '2px dashed #d1d5db', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#6b7280', cursor: 'pointer', marginTop: '12px' },
  warning: { backgroundColor: '#fef3c7', color: '#92400e', padding: '10px', borderRadius: '8px', fontSize: '12px', marginTop: '12px' },
};

export default InventoryManager;