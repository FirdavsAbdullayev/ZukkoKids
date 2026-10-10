import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Lock, Clapperboard, Play, Coins, ShoppingBag, Languages, Hash,
  Palette, Music, Heart, Check, X,
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { useShop } from '../hooks/useShop';
import Sound from '../utils/sound';

const CATEGORIES = [
  { key: 'alphabet', label: 'Alifbo', Icon: Languages, active: 'bg-soft-purple/60 text-candy-purple border-candy-purple' },
  { key: 'numbers', label: 'Raqamlar', Icon: Hash, active: 'bg-soft-sky/60 text-candy-blue border-candy-blue' },
  { key: 'colors', label: 'Ranglar', Icon: Palette, active: 'bg-soft-yellow/70 text-amber-600 border-amber-400' },
  { key: 'songs', label: "O'shincha qo'shiqlar", Icon: Music, active: 'bg-soft-pink/60 text-candy-pink border-candy-pink' },
];

const CARTOONS = [
  // ---- Alifbo ----
  { key: 'abc-phonics', category: 'alphabet', title: 'ABC phonics qo\'shig\'i', youtubeId: 'RHTajLtFTzM', duration: '46 min' },
  { key: 'abc-a-z', category: 'alphabet', title: 'ABC — A dan Z gacha harflar', youtubeId: 'bo59TjaV3QA', duration: '19 min' },
  { key: 'letter-n-akili', category: 'alphabet', title: '"N" harfi — Akili bilan', youtubeId: 'res6L90-IyA', duration: '6 min' },
  { key: 'jkl-chuchu', category: 'alphabet', title: 'JKL harflari — ChuChu TV', youtubeId: 'Q2EvYEhyPeo', duration: '20 min' },
  { key: 'phonics-food', category: 'alphabet', title: 'Phonics A-Z (mazali oziq-ovqat)', youtubeId: 'E0kBWjwHCRk', duration: '8 min' },
  // ---- Raqamlar ----
  { key: 'count-1to10', category: 'numbers', title: '1 dan 10 gacha sanash', youtubeId: 'Yt8GFgxlITs', duration: '2 min' },
  { key: 'numbers-1to10', category: 'numbers', title: 'Raqamlar 1-10 (uzoq versiya)', youtubeId: 'BOjFLY2H5FA', duration: '28 min' },
  { key: 'numbers-counting', category: 'numbers', title: 'Sonlarni sanash to\'plami', youtubeId: 'glkQwKA5_PU', duration: '32 min' },
  { key: 'numbers-1to20', category: 'numbers', title: '1 dan 20 gacha raqamlar', youtubeId: 'FvXRAnUhpGQ', duration: '31 min' },
  { key: 'numbers-lucas', category: 'numbers', title: 'Raqamlar — Lucas & Friends', youtubeId: 'lA5fhaYp2eY', duration: '8 min' },
  // ---- Ranglar ----
  { key: 'colors-patty', category: 'colors', title: 'Ranglar qo\'shig\'i — Patty', youtubeId: 'EvMPRnMHfx8', duration: '3 min' },
  { key: 'colors-rainbow', category: 'colors', title: 'Kamalak ranglari', youtubeId: 'mXtpjBzPMeY', duration: '4 min' },
  { key: 'colors-nunu', category: 'colors', title: 'Ranglar — NuNu TV', youtubeId: 'MXvB1RUloPA', duration: '9 min' },
  { key: 'colors-canticos', category: 'colors', title: 'De Colores — Canticos', youtubeId: 'mT9zY9azG9Y', duration: '35 min' },
  // ---- Qo'shiqlar ----
  { key: 'baby-shark', category: 'songs', title: 'Baby Shark Dance', youtubeId: '5CkWJEDQUGo', duration: '3 min' },
  { key: 'baby-shark-top7', category: 'songs', title: 'Baby Shark — TOP 7 qo\'shiq', youtubeId: 'a53J0C73d1Q', duration: '19 min' },
];

const CARTOON_PASS_KEY = 'cartoon_pass';

/** Lokal MP4 fayl bor bo'lsa o'yna, aks holda YouTube-ga o'tadi. */
function VideoPlayer({ item }) {
  const [useYt, setUseYt] = useState(false);
  if (useYt) {
    return (
      <iframe
        className="aspect-video w-full rounded-2xl border-0 bg-black"
        src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&rel=0`}
        title={item.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }
  return (
    <video
      key={item.key}
      className="aspect-video w-full rounded-2xl bg-black"
      controls
      autoPlay
      playsInline
      preload="metadata"
      src={`/videos/${item.key}.mp4`}
      onError={() => setUseYt(true)}
    >
      <source src={`/videos/${item.key}.webm`} type="video/webm" />
      <p className="p-4 text-white">Xato: videoni yuklab bo'lmadi.</p>
    </video>
  );
}

export default function CartoonsPage() {
  const { user } = useUser();
  const { shop, isOwned, buy, loading, refresh } = useShop();
  const [activeCat, setActiveCat] = useState('alphabet');
  const [playing, setPlaying] = useState(null);
  const [buying, setBuying] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    refresh();
  }, [refresh]);

  const passItem = shop.find((i) => i.key === CARTOON_PASS_KEY);
  const passPrice = passItem?.price ?? 50;
  const unlocked = isOwned(CARTOON_PASS_KEY);

  const unlock = async () => {
    if (buying) return;
    setBuying(true);
    setErrMsg('');
    try {
      await buy(CARTOON_PASS_KEY);
      Sound.fanfare();
    } catch (e) {
      Sound.error();
      setErrMsg(e.response?.data?.message || 'Ochishda xatolik yuz berdi');
    } finally {
      setBuying(false);
    }
  };

  const list = CARTOONS.filter((c) => c.category === activeCat);

  return (
    <section className="animate-pop-in">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="mb-2 inline-flex items-center gap-1 text-sm font-bold text-slate-400 transition hover:text-candy-purple"
          onClick={Sound.click}
        >
          <ArrowLeft size={16} /> Bosh sahifa
        </Link>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-candy-pink sm:text-3xl">
          <Clapperboard size={28} /> Multfilmlar
        </h1>
      </div>
      <p className="mb-6 text-slate-500">Xavfsiz YouTube video tanlovlari — kichik maktabgacha yoshdagilar uchun.</p>

      {errMsg && (
        <p className="mb-4 animate-shake rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">{errMsg}</p>
      )}

      {/* Qulf — kutubxona ochilmagan */}
      {!unlocked ? (
        <div className="glass-card mx-auto max-w-lg p-8 text-center">
          <div className="mx-auto mb-4 inline-flex rounded-3xl bg-gradient-to-br from-candy-pink to-rose-400 p-6 text-white shadow-candy">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">Multfilm kutubxonasi yopiq</h2>
          <p className="mt-2 text-slate-500">
            Barcha multfilmlarni ochish uchun “{passItem?.title || 'Multfilm kutubxonasi'}”ni tangaga
            sotib oling. Bu do'konimizdagi maxsus ochish huquqi!
          </p>
          <p className="mt-4 flex items-center justify-center gap-2 text-lg font-extrabold text-amber-600">
            <Coins size={20} /> {passPrice} tanga
          </p>
          <button
            onClick={unlock}
            disabled={buying || user.coins_balance < passPrice}
            className={`btn-candy btn-glow mt-5 ${user.coins_balance < passPrice ? 'bg-slate-300' : 'bg-candy-pink'}`}
          >
            {buying ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-white/40 border-t-white" />
                Ochilmoqda...
              </>
            ) : user.coins_balance < passPrice ? (
              <>
                <Coins size={18} /> Yetarli emas
              </>
            ) : (
              <>
                <Lock size={18} /> Kutubxonani ochish
              </>
            )}
          </button>
          <Link to="/store" onClick={Sound.click} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-candy-purple hover:underline">
            <ShoppingBag size={16} /> Tanga yig'ish uchun do'konga borish
          </Link>
        </div>
      ) : (
        <>
          {/* Kategoriya tablar */}
          <div className="-mx-3 mb-6 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  Sound.select();
                  setActiveCat(cat.key);
                  setPlaying(null);
                }}
                className={`inline-flex shrink-0 items-center gap-2 rounded-2xl border-b-4 px-3.5 py-2 text-base font-extrabold transition sm:px-5 sm:py-3 sm:text-lg ${
                  activeCat === cat.key
                    ? cat.active
                    : 'border-transparent bg-white/70 text-slate-400 hover:text-slate-600'
                }`}
              >
                <cat.Icon size={20} /> {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="glass-card flex items-center justify-center p-8 text-slate-400">
              <Heart size={20} className="animate-pulse text-pink-400" /> Yuklanmoqda...
            </div>
          ) : playing ? (
            <div className="glass-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-slate-800">{playing.title}</h2>
                <button
                  onClick={() => setPlaying(null)}
                  className="rounded-xl bg-white/70 p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  title="Yopish"
                >
                  <X size={20} />
                </button>
              </div>
              <VideoPlayer item={playing} />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((item, i) => (
                <button
                  key={item.key}
                  onClick={() => {
                    Sound.select();
                    setPlaying(item);
                  }}
                  className="play-card glass-card group animate-stagger text-left"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="relative mb-3 overflow-hidden rounded-2xl bg-gradient-to-br from-soft-pink/70 to-soft-purple/70 p-6">
                    <div className="flex items-center justify-between">
                      <Clapperboard size={30} className="text-candy-pink" />
                      <span className="pill bg-white/80 text-slate-400">{item.duration}</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                      <span className="inline-flex rounded-full bg-candy-pink p-4 text-white shadow-candy animate-pop-in">
                        <Play size={22} className="fill-white ml-0.5" />
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800">{item.title}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm font-bold text-candy-pink">
                    <Check size={14} /> Ochiq — tomosha qilish
                    <span className="inline-flex opacity-0 transition group-hover:ml-1 group-hover:opacity-100">
                      <ArrowRight size={15} />
                    </span>
                  </p>
                </button>
              ))}
            </div>
          )}

          {!loading && !playing && list.length === 0 && (
            <p className="glass-card mt-6 p-6 text-center text-slate-500">Bu kategoriyada hozircha multfilm yo'q.</p>
          )}

          <div className="glass-card mt-6 flex items-center gap-3 bg-soft-yellow/50 p-4">
            <Check size={20} className="shrink-0 text-candy-green" />
            <p className="text-sm text-slate-600">
              <b>Xavfsizlik:</b> barcha videolar bolalar kanallaridan tanlangan. Lokal <code>/videos/</code>{' '}
              papkasiga MP4 qo'yilsa, avtomatik ravishda o'sha fayl ko'rsatiladi (internetsiz ishlaydi).
            </p>
          </div>
        </>
      )}
    </section>
  );
}