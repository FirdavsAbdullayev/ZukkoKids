import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Kundalik o'qish seriyasi (streak) trekeri.
 * localStorage'da saqlanadi. Har kuni kamida 1 marta dars tugatilsa streak o'sadi.
 *
 * Holat Context orqali ulashiladi — shuning uchun LessonsPage'da chaqirilgan
 * markStudyDay Header'dagi streak ko'rsatigini darhol yangilaydi.
 */
const STORAGE_KEY = 'zukkokids_streak';

const StreakContext = createContext(null);

function toDateStr(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function readStreak() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, lastDate: null };
    const parsed = JSON.parse(raw);
    if (typeof parsed?.count !== 'number') return { count: 0, lastDate: null };
    return { count: parsed.count, lastDate: parsed.lastDate || null };
  } catch {
    return { count: 0, lastDate: null };
  }
}

function isYesterday(dateStr) {
  if (!dateStr) return false;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return dateStr === toDateStr(y);
}

/** Oxirgi o'qish kecha yoki bugun bo'lmasa — seriya uzilgan. */
function resolveStreak(streak) {
  const today = toDateStr();
  if (!streak.lastDate) return { count: 0, lastDate: null };
  if (streak.lastDate === today || isYesterday(streak.lastDate)) return streak;
  // E'tiborsiz: lastDate today bo'lib qolmasin, aks holda bugungi markStudyDay
  // "bugun allaqachon qayd etilgan" deb hisoblanib, streak hech qachon o'smasdi.
  return { count: 0, lastDate: null };
}

export function StreakProvider({ children }) {
  const [streak, setStreak] = useState(() => resolveStreak(readStreak()));

  // Har qanday o'zgarishni saqlash (shu jumladan reset holatini ham)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(streak));
    } catch {
      /* ignore */
    }
  }, [streak]);

  /** Dars tugatilganda chaqiriladi. Bugun birinchi dars bo'lsa seriya +1. */
  const markStudyDay = useCallback(() => {
    const today = toDateStr();
    setStreak((prev) => {
      if (prev.lastDate === today) return prev; // bugun allaqachon +1 bo'lgan
      if (prev.lastDate && isYesterday(prev.lastDate)) {
        return { count: prev.count + 1, lastDate: today };
      }
      return { count: 1, lastDate: today };
    });
  }, []);

  const reset = useCallback(() => {
    setStreak({ count: 0, lastDate: null });
  }, []);

  const value = useMemo(
    () => ({ streak, markStudyDay, reset }),
    [streak, markStudyDay, reset]
  );

  return <StreakContext.Provider value={value}>{children}</StreakContext.Provider>;
}

export default function useStreak() {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error("useStreak StreakProvider ichida ishlatilishi kerak");
  return ctx;
}
