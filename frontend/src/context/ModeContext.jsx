// src/context/ModeContext.jsx
import { createContext, useState, useCallback, useMemo } from 'react';

const ModeContext = createContext(null);

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState('buyer');

  const switchMode = useCallback((newMode) => {
    setMode(newMode);
  }, []);

  const isBuyer = mode === 'buyer';
  const isSeller = mode === 'seller';
  const isAdmin = mode === 'admin';

  const value = useMemo(() => ({
    mode,
    switchMode,
    isBuyer,
    isSeller,
    isAdmin
  }), [mode, switchMode, isBuyer, isSeller, isAdmin]);

  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  );
};

export default ModeContext;