// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModeProvider } from './context/ModeContext';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Buyer Pages
import BuyerHome from './pages/BuyerHome';
import SearchResults from './components/buyer/SearchResults';
import ItemDetail from './components/buyer/ItemDetail';
import Checkout from './components/buyer/Checkout';
import PurchaseHistory from './components/buyer/PurchaseHistory';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <ModeProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Buyer Routes */}
              <Route path="/buyer/dashboard" element={<BuyerHome />} />
              <Route path="/buyer/search" element={<SearchResults />} />
              <Route path="/buyer/item/:itemId" element={<ItemDetail />} />
              <Route path="/buyer/checkout/:itemId" element={<Checkout />} />
              <Route path="/buyer/purchases" element={<PurchaseHistory />} />
            </Routes>
          </div>
        </Router>
      </ModeProvider>
    </AuthProvider>
  );
}

export default App;