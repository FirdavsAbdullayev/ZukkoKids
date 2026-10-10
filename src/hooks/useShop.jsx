import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getShop, getUserPurchases, purchaseItem, getGameProgress, completeGame } from '../services/api';
import { useUser } from './useUser';
import Sound from '../utils/sound';

/**
 * Do'kon + o'yin holati.
 * Xaridlar (ochilgan elementlar) va o'yin progresslarini serverdan sinxronlaydi.
 * Har bir context ishlatuvchi sahifa (Shop/Games/Cartoons) refresh() sodda ishlatadi.
 */
const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const { user, setUser } = useUser();
  const [shop, setShop] = useState([]); // /api/shop katalogi
  const [games, setGames] = useState([]); // /api/games katalogi (progress bilan)
  const [ownedKeys, setOwnedKeys] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userId = user?.id;

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      const [shopRes, gamesRes, purchasesRes] = await Promise.all([
        getShop(),
        getGameProgress(userId),
        getUserPurchases(userId),
      ]);
      setShop(shopRes.data || []);
      setGames(gamesRes.data?.games || []);
      setOwnedKeys(new Set(purchasesRes.data?.item_keys || []));
      if (setUser) {
        setUser((u) =>
          u && purchasesRes.data
            ? {
                ...u,
                coins_balance: purchasesRes.data.coins_balance,
                stars_count: purchasesRes.data.stars_count,
              }
            : u
        );
      }
    } catch {
      setError("Do'kon ma'lumotlarini yuklab bo'lmadi. Backend ishga tushganini tekshiring.");
    } finally {
      setLoading(false);
    }
  }, [userId, setUser]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const buy = useCallback(
    async (itemKey) => {
      if (!userId) return;
      try {
        const res = await purchaseItem(userId, itemKey);
        Sound.fanfare();
        setOwnedKeys((prev) => new Set(prev).add(itemKey));
        setUser((u) =>
          u && res.data
            ? { ...u, coins_balance: res.data.coins_balance, stars_count: res.data.stars_count }
            : u
        );
        return res;
      } catch (err) {
        Sound.error();
        throw err;
      }
    },
    [userId, setUser]
  );

  // O'yin natijasini serverga yuboradi, balans/progressni yangilaydi
  const reportGameResult = useCallback(
    async (gameKey, score) => {
      if (!userId) return null;
      try {
        const res = await completeGame({ user_id: userId, game_key: gameKey, score });
        if (res.data) {
          setUser((u) =>
            u
              ? { ...u, coins_balance: res.data.coins_balance, stars_count: res.data.stars_count }
              : u
          );
        }
        setGames((prev) =>
          prev.map((g) => (g.key === gameKey ? { ...g, progress: res.data?.progress || g.progress } : g))
        );
        return res;
      } catch (err) {
        Sound.error();
        throw err;
      }
    },
    [userId, setUser]
  );

  const isOwned = useCallback((key) => ownedKeys.has(key), [ownedKeys]);

  const value = useMemo(
    () => ({
      shop,
      games,
      ownedKeys,
      isOwned,
      loading,
      error,
      refresh,
      buy,
      reportGameResult,
    }),
    [shop, games, ownedKeys, isOwned, loading, error, refresh, buy, reportGameResult]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop ShopProvider ichida ishlatilishi kerak');
  return ctx;
}