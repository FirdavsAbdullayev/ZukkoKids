import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Coins, Star, Users, LogOut, Volume2, VolumeX, Flame, Trophy, ShoppingBag, Award,
  GraduationCap, Gamepad2, Clapperboard,
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import Avatar from './Avatar';
import { getLevelInfo, LEVEL_TITLES } from '../utils/level';
import Sound from '../utils/sound';

export default function Header({ streak = 0 }) {
  const { user, logout, refreshUser } = useUser();
  const [bounce, setBounce] = useState(false);
  const [soundOn, setSoundOn] = useState(() => Sound.isEnabled());

  // Tanga/yulduz soni o'zgarganda animatsiya
  useEffect(() => {
    if (!user) return;
    setBounce(true);
    const t = setTimeout(() => setBounce(false), 600);
    return () => clearTimeout(t);
  }, [user?.coins_balance, user?.stars_count]);

  // Sahifa ochilganda balansni yangilash
  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) return null;

  const { level, progressPct } = getLevelInfo(user.coins_balance);
  const levelTitle = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    Sound.setEnabled(next);
    if (next) Sound.pop();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
        {/* Logo */}
        <Link to="/" className="group flex shrink-0 items-center gap-3" onClick={Sound.click}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-candy-purple to-purple-400 text-white shadow-candy transition group-hover:animate-tada sm:h-11 sm:w-11">
            <GraduationCap size={24} />
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-extrabold leading-none text-gradient">ZukkoKids</p>
            <p className="text-xs text-slate-400">O'rgan va o'yna!</p>
          </div>
        </Link>

        <div className="flex min-w-0 items-center gap-1 sm:gap-2.5">
          {/* Streak (mobilda yashiriladi, pastki nav/hero'da ko'rinadi) */}
          {streak > 0 && (
            <div className="pill hidden bg-soft-orange/80 text-orange-700 sm:inline-flex" title={`${streak} kunlik seriya`}>
              <Flame size={17} className="text-orange-500" />
              <span className="tabular-nums">{streak}</span>
            </div>
          )}

          {/* Coins */}
          <div
            className={`pill bg-soft-yellow text-amber-700 transition-transform ${
              bounce ? 'animate-tada' : ''
            }`}
            title="Tangalar"
          >
            <Coins size={16} className="text-amber-500 sm:hidden" />
            <Coins size={18} className="hidden text-amber-500 sm:block" />
            <span className="tabular-nums">{user.coins_balance}</span>
          </div>

          {/* Stars */}
          <div
            className={`pill bg-soft-purple text-purple-700 transition-transform ${
              bounce ? 'animate-tada' : ''
            }`}
            title="Yulduzlar"
          >
            <Star size={16} className="fill-purple-500 text-purple-500 sm:hidden" />
            <Star size={18} className="hidden fill-purple-500 text-purple-500 sm:block" />
            <span className="tabular-nums">{user.stars_count}</span>
          </div>

          {/* Daraja + avatar */}
          <div className="glass-nav flex shrink-0 items-center gap-2 px-1.5 py-1 sm:px-2 sm:py-1.5">
            <Avatar url={user.avatar_url} size={34} />
            <div className="hidden md:block">
              <p className="text-xs font-extrabold leading-tight text-slate-700" title={levelTitle}>
                {level} — {levelTitle}
              </p>
              <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-candy-purple to-candy-pink transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="glass-nav hidden items-center gap-1 px-2 py-1 lg:flex">
            <Link
              to="/lessons"
              className="rounded-xl p-2 text-slate-500 transition hover:bg-soft-sky/40 hover:text-candy-blue"
              title="Darslar"
              onClick={Sound.select}
            >
              <Trophy size={20} />
            </Link>
            <Link
              to="/games"
              className="rounded-xl p-2 text-slate-500 transition hover:bg-soft-purple/40 hover:text-candy-purple"
              title="O'yinlar"
              onClick={Sound.select}
            >
              <Gamepad2 size={20} />
            </Link>
            <Link
              to="/cartoons"
              className="rounded-xl p-2 text-slate-500 transition hover:bg-soft-pink/50 hover:text-candy-pink"
              title="Multfilmlar"
              onClick={Sound.select}
            >
              <Clapperboard size={20} />
            </Link>
            <Link
              to="/achievements"
              className="rounded-xl p-2 text-slate-500 transition hover:bg-soft-purple/40 hover:text-candy-purple"
              title="Yutuqlar"
              onClick={Sound.select}
            >
              <Award size={20} />
            </Link>
            <Link
              to="/store"
              className="rounded-xl p-2 text-slate-500 transition hover:bg-soft-yellow/60 hover:text-amber-600"
              title="Tanga do'koni"
              onClick={Sound.select}
            >
              <ShoppingBag size={20} />
            </Link>
            <Link
              to="/parents"
              className="rounded-xl p-2 text-slate-500 transition hover:bg-soft-mint/60 hover:text-candy-green"
              title="Ota-onalar paneli"
              onClick={Sound.select}
            >
              <Users size={20} />
            </Link>
          </nav>

          {/* Mobil + qo'shimcha */}
          <button
            onClick={toggleSound}
            className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 sm:p-2"
            title={soundOn ? 'Ovozni o\'chirish' : 'Ovozni yoqish'}
          >
            {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button
            onClick={logout}
            className="rounded-xl p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 sm:p-2"
            title="Chiqish"
            onClickCapture={Sound.click}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}