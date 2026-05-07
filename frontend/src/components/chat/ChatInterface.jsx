
import { useState } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const ChatInterface = () => {
  const [activeChat, setActiveChat] = useState('techseller');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({
    techseller: [
      { from: 'them', text: 'Hi! Is the iPhone still available?', time: 'Mar 22, 10:30 AM' },
      { from: 'me', text: 'Yes, it\'s available! Battery health is 89%', time: 'Mar 22, 10:32 AM' },
      { from: 'them', text: 'Great! Would you take $550?', time: 'Mar 22, 10:35 AM' },
      { from: 'me', text: 'I can do $575 shipped. Let me know!', time: 'Mar 22, 10:36 AM' },
    ],
    alice_w: [
      { from: 'them', text: 'Are the headphones still for sale?', time: 'Mar 21, 2:00 PM' },
      { from: 'me', text: 'Yes, they are!', time: 'Mar 21, 2:05 PM' },
    ],
  });

  const chats = [
    { id: 'techseller', name: '@techseller', preview: 'Re: iPhone 13 Pro ($599)', time: 'Now', unread: true },
    { id: 'alice_w', name: '@alice_w', preview: 'Re: Headphones', time: '2m ago', unread: false },
    { id: 'bob_s', name: '@bob_s', preview: 'Re: Keyboard', time: 'Yesterday', unread: false },
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg = { from: 'me', text: message, time: 'Just now' };
    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMsg],
    }));
    setMessage('');
  };

  const activeMessages = messages[activeChat] || [];
  const currentChat = chats.find(c => c.id === activeChat);

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.main}>
        <div style={styles.backRow}>
          <a href="/buyer/dashboard" style={styles.backLink}>← Back to Dashboard</a>
        </div>

        <div style={styles.chatLayout}>
          {/* Chat List */}
          <div style={styles.chatList}>
            <div style={styles.chatListHeader}>
              <h3>💬 Messages</h3>
              <input type="text" placeholder="🔍 Search conversations" style={styles.searchInput} />
            </div>
            {chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                style={{
                  ...styles.chatItem,
                  backgroundColor: activeChat === chat.id ? '#eff6ff' : '#fff',
                }}
              >
                <div style={styles.chatAvatar}>👤</div>
                <div style={styles.chatInfo}>
                  <div style={styles.chatName}>{chat.name}</div>
                  <div style={styles.chatPreview}>{chat.preview}</div>
                </div>
                <div style={styles.chatMeta}>
                  <div style={styles.chatTime}>{chat.time}</div>
                  {chat.unread && <div style={styles.unreadDot}></div>}
                </div>
              </div>
            ))}
          </div>

          {/* Active Chat */}
          <div style={styles.chatWindow}>
            <div style={styles.chatHeader}>
              <div>
                <h4>{currentChat?.name || '@techseller'}</h4>
                <span style={styles.chatContext}>Re: iPhone 13 Pro ($599)</span>
              </div>
              <div style={styles.chatActions}>
                <button style={styles.chatActionBtn}>🚫 Block</button>
                <button style={styles.chatActionBtn}>🚩 Report</button>
              </div>
            </div>

            <div style={styles.messageArea}>
              {activeMessages.map((msg, i) => (
                <div key={i} style={{
                  ...styles.messageRow,
                  justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    ...styles.messageBubble,
                    backgroundColor: msg.from === 'me' ? '#3b82f6' : '#f3f4f6',
                    color: msg.from === 'me' ? '#fff' : '#1f2937',
                  }}>
                    <div style={styles.messageText}>{msg.text}</div>
                    <div style={{
                      ...styles.messageTime,
                      color: msg.from === 'me' ? '#bfdbfe' : '#9ca3af',
                    }}>{msg.time}</div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              <div style={styles.typing}>@techseller is typing...</div>
            </div>

            <div style={styles.inputArea}>
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                style={styles.messageInput}
              />
              <button onClick={handleSend} style={styles.sendBtn}>Send</button>
            </div>
          </div>
        </div>

        <div style={styles.statusBar}>⚡ Messages appear in real-time (WebSocket)</div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' },
  main: { flex: 1, maxWidth: '1100px', margin: '0 auto', padding: '24px', width: '100%' },
  backRow: { marginBottom: '16px' },
  backLink: { color: '#3b82f6', fontSize: '14px', textDecoration: 'none' },
  chatLayout: { display: 'flex', gap: '0', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', height: '600px' },
  chatList: { width: '300px', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' },
  chatListHeader: { padding: '16px' },
  searchInput: { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', marginTop: '8px' },
  chatItem: { display: 'flex', padding: '12px 16px', gap: '12px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', alignItems: 'center' },
  chatAvatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 },
  chatInfo: { flex: 1, minWidth: 0 },
  chatName: { fontSize: '14px', fontWeight: '600' },
  chatPreview: { fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  chatMeta: { textAlign: 'right' },
  chatTime: { fontSize: '11px', color: '#9ca3af' },
  unreadDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6', marginLeft: 'auto', marginTop: '4px' },
  chatWindow: { flex: 1, display: 'flex', flexDirection: 'column' },
  chatHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e5e7eb' },
  chatContext: { fontSize: '12px', color: '#6b7280' },
  chatActions: { display: 'flex', gap: '8px' },
  chatActionBtn: { padding: '4px 10px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#fff', fontSize: '11px', cursor: 'pointer' },
  messageArea: { flex: 1, overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  messageRow: { display: 'flex' },
  messageBubble: { maxWidth: '70%', padding: '10px 14px', borderRadius: '16px' },
  messageText: { fontSize: '14px' },
  messageTime: { fontSize: '10px', marginTop: '4px', textAlign: 'right' },
  typing: { fontSize: '12px', color: '#9ca3af', fontStyle: 'italic', paddingLeft: '8px' },
  inputArea: { display: 'flex', gap: '8px', padding: '16px 20px', borderTop: '1px solid #e5e7eb' },
  messageInput: { flex: 1, padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' },
  sendBtn: { padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  statusBar: { marginTop: '12px', fontSize: '12px', color: '#10b981', textAlign: 'center' },
};

export default ChatInterface;