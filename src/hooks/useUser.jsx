import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { createUser, getUser } from '../services/api';

const UserContext = createContext(null);

const STORAGE_KEY = 'zukkokids_user';

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // Sahifa ochilganda serverdan yangi balansni sinxronlash
  const refreshUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await getUser(user.id);
      if (res?.data) setUser(res.data);
    } catch {
      // offline bo'lsa jim o'tamiz
    }
  }, [user?.id]);

  const login = useCallback(async ({ name, age, parent_email, avatar_url }) => {
    setLoading(true);
    try {
      const res = await createUser({
        name,
        age: Number(age),
        parent_email,
        avatar_url: avatar_url || null,
      });
      setUser(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, setUser, login, logout, refreshUser, loading }),
    [user, login, logout, refreshUser, loading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser UserProvider ichida ishlatilishi kerak");
  return ctx;
}
