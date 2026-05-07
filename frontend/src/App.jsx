// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModeProvider } from './context/ModeContext';
import LandingPage from './pages/LandingPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ModeProvider>
        <Router>
          <div className="app">
            <Routes>
              <Route path="/" element={<LandingPage />} />
            </Routes>
          </div>
        </Router>
      </ModeProvider>
    </AuthProvider>
  );
}

export default App;