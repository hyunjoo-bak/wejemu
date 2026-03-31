import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../data/mockUsers';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('erp_admin_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('erp_admin_user');
      }
    }
    setLoading(false);
  }, []);

  function login(email, password) {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!found) {
      return { success: false, type: 'not_found' };
    }
    if (found.status === 'pending') {
      return { success: false, type: 'pending' };
    }
    if (found.status === 'rejected') {
      return { success: false, type: 'rejected', rejectReason: found.rejectReason };
    }
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('erp_admin_user', JSON.stringify(safeUser));
    return { success: true };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('erp_admin_user');
    navigate('/login');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
