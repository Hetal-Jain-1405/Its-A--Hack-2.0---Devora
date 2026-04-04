import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = auth.getToken(), u = localStorage.getItem('cf_user');
    if (t && u) { try { setUser(JSON.parse(u)); setIsAuth(true); } catch { auth.clearToken(); } }
    setLoading(false);
  }, []);
  const login = async (email, pw) => {
    const d = await auth.login(email, pw);
    auth.setToken(d.access_token); localStorage.setItem('cf_user', JSON.stringify(d.user));
    setUser(d.user); setIsAuth(true); return d;
  };
  const register = async (email, pw, name, role) => {
    const d = await auth.register(email, pw, name, role);
    auth.setToken(d.access_token); localStorage.setItem('cf_user', JSON.stringify(d.user));
    setUser(d.user); setIsAuth(true); return d;
  };
  const logout = () => {
    auth.clearToken();
    localStorage.removeItem('cf_user');
    localStorage.removeItem('cf_patient_id');
    setUser(null);
    setIsAuth(false);
  };
  return (<AuthContext.Provider value={{ user, isAuth, loading, login, register, logout }}>{children}</AuthContext.Provider>);
}
export function useAuth() { const c = useContext(AuthContext); if (!c) throw new Error('useAuth requires AuthProvider'); return c; }
export default AuthContext;
