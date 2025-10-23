import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // attempt session
    axios
      .get('/auth/me', { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (e) {
      // ignore
    }
  };

  const value = useMemo(() => ({ user, setUser, loading, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
