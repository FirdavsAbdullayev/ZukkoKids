import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Coins, Gamepad2, Clapperboard, TreePine, Pizza, Download, Check, Film,
  ShoppingBag, Heart, Lock,
} from 'lucide-react';
import { useShop } from '../hooks/useShop';
import { useUser } from '../hooks/useUser';
import Sound from '../utils/sound';

const ICON_BY_NAME = {
  clapperboard: Clapperboard,
  gamepad: Gamepad2,
  film: Film,
  tree: TreePine,
  pizza: Pizza,
};

const GRADIENT_BY_KIND = {
  unlock: 'from-candy-pink to-rose-400',
  reward: 'from-candy-purple to-purple-400',
};

export default function StorePage() {
  const { user } = useUser();
  const { shop, isOwned, buy, loading, error, refresh } = useShop();
  const [msg, setMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Do'konda mukofot va ochilishlar ko'rsatiladi (o'yinlar GamesPage'da)
  const items = shop.filter((i) => i.kind !== 'game');

  const buyItem = async (item) => {
    if (isOwned(item.key)) return;
    setBusy(item.key);
    setMsg('');
    setErrMsg('');
    try {
      await buy(item.key);
      setMsg(`Sotib olindi: ${item.title}`);
    } catch (e) {
      setErrMsg(e.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="animate-pop-in">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-bold text-slate-400 transition hover:text-candy-blue"
        onClick={Sound.click}
      >
        <ArrowLeft size={16} /> Bosh sahifa
      </Link>

      <div className="glass-card mb-6 mt-2 flex items-center gap-4 bg-gradient-to-r from-soft-yellow/70 to-soft-orange/70 p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-white shadow-candy">
          <Coins size={26} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-amber-800 sm:text-3xl">Tanga do'koni</h1>
          <p className="font-semibold text-amber-600">
            Yig'gan tangalaringni qiziqarli imtiyozga almashtir! Balansing:{' '}
            <b className="tabular-nums">{user.coins_balance}</b>
          </p>
        </div>
      </div>

      {errMsg && (
        <p className="mb-4 animate-shake rounded-xl bg-red-50 p-3 text-center font-bold text-red-600">{errMsg}</p>
      )}
      {msg && (
        <p className="mb-4 animate-pop-in rounded-xl bg-soft-mint/70 p-3 text-center font-bold text-green-700">
          {msg}
        </p>
      )}

      {loading ? (
        <div className="glass-card flex items-center justify-center gap-2 p-8 text-slate-400">
          <Heart size={20} className="animate-pulse text-pink-400" /> Do'kon yuklanmoqda...
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = ICON_BY_NAME[item.icon] || ShoppingBag;
            const owned = isOwned(item.key);
            const cantAfford = user.coins_balance < item.price;
            const gradient = GRADIENT_BY_KIND[item.kind] || 'from-candy-blue to-sky-400';
            return (
              <div
                key={item.key}
                className={`glass-card group relative flex flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-pop ${
                  owned ? 'bg-soft-mint/60' : ''
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className={`inline-flex rounded-2xl bg-gradient-to-br p-3 text-white shadow-soft ${gradient}`}>
                    <Icon size={26} />
                  </div>
                  {item.kind === 'unlock' && (
                    <span className="pill bg-soft-pink/70 text-candy-pink">
                      <Lock size={13} /> Ochish
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-extrabold text-slate-800">{item.title}</h3>
                <p className="mb-4 mt-1 flex-1 text-sm text-slate-500">{item.description}</p>
                <p className="mb-3 flex items-center gap-1 text-sm font-bold text-amber-600">
                  <Coins size={15} /> {item.price} tanga
                </p>

                <button
                  onClick={() => !owned && buyItem(item)}
                  disabled={owned || cantAfford || busy === item.key}
                  className={`btn-candy mt-auto ${
                    owned ? 'bg-candy-green opacity-80' : cantAfford ? 'bg-slate-300' : 'bg-candy-purple'
                  }`}
                >
                  {owned ? (
                    <>
                      <Check size={18} /> Sotib olindi
                    </>
                  ) : busy === item.key ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-white/40 border-t-white" />
                      Sotilmoqda...
                    </>
                  ) : cantAfford ? (
                    'Yetarli emas'
                  ) : (
                    <>
                      <Download size={18} /> Sotib olish
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!loading && error && <p className="glass-card mt-6 p-4 text-center text-sm text-red-500">{error}</p>}

      <div className="glass-card mt-6 flex items-center gap-3 bg-soft-sky/50 p-4">
        <Gamepad2 size={20} className="shrink-0 text-candy-blue" />
        <p className="text-sm text-slate-600">
          O'yinlarni ochish ham shu tangalar bilan bo'ladi —{' '}
          <Link to="/games" className="font-bold text-candy-purple hover:underline" onClick={Sound.select}>
            O'yinlar bo'limiga
          </Link>{' '}
          o'ting!
        </p>
      </div>

      <p className="glass-card mt-6 p-4 text-center text-sm text-slate-500">
        Bu imtiyozlar ota-ona nazoratida amalga oshiriladi — tangalar bilan ishtiyoqlanishing maktubda
        mashq qilish hali ham birinchi o'rinda!
      </p>
    </section>
  );
}