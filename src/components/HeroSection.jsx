import { Link } from 'react-router-dom';
import {
  Languages, Hash, Pencil, Sparkles, Coins, TrendingUp, Trophy, Users, ArrowRight,
  Flame, Award, ShoppingBag, Lightbulb, Gamepad2, Clapperboard,
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import Avatar from './Avatar';
import Sound from '../utils/sound';

const SECTIONS = [
  {
    to: '/alphabet',
    title: 'Alifbo',
    badge: 'Ovoz bilan',
    description: "Harflarni talaffuzi bilan o'rgan",
    gradient: 'from-candy-purple to-purple-400',
    bg: 'bg-soft-purple/60',
    icon: Languages,
  },
  {
    to: '/lessons',
    title: 'Darslar',
    badge: 'Tanga yig\'',
    description: "Raqamlar, ingliz tili, STEM darslari",
    gradient: 'from-candy-blue to-sky-400',
    bg: 'bg-soft-sky/60',
    icon: TrendingUp,
  },
  {
    to: '/games',
    title: "O'yinlar",
    badge: 'Yangi!',
    description: "O'yin o'ynab tanga va yulduz yig'",
    gradient: 'from-candy-purple to-fuchsia-500',
    bg: 'bg-soft-purple/60',
    icon: Gamepad2,
  },
  {
    to: '/cartoons',
    title: 'Multfilmlar',
    badge: 'Video',
    description: "Xavfsiz ta'limiy multfilmlar to'plami",
    gradient: 'from-candy-pink to-rose-400',
    bg: 'bg-soft-pink/60',
    icon: Clapperboard,
  },
  {
    to: '/drawing',
    title: 'Chizish maydoni',
    badge: 'Kanvas',
    description: "Barmog'ing bilan harf va raqam chiz",
    gradient: 'from-candy-pink to-pink-400',
    bg: 'bg-soft-pink/60',
    icon: Pencil,
  },
  {
    to: '/achievements',
    title: 'Yutuqlar zali',
    badge: 'Medallar',
    description: 'Ochilgan barcha medallaringni ko\'r',
    gradient: 'from-candy-green to-emerald-400',
    bg: 'bg-soft-mint/60',
    icon: Award,
  },
  {
    to: '/store',
    title: 'Tanga do\'koni',
    badge: 'Yangi!',
    description: "Tangalarni imtiyozlarga almashtir",
    gradient: 'from-amber-400 to-orange-400',
    bg: 'bg-soft-yellow/70',
    icon: ShoppingBag,
  },
  {
    to: '/parents',
    title: 'Ota-onalar',
    badge: 'Panel',
    description: "Rivojlanish statistikasi va vaqt",
    gradient: 'from-candy-green to-teal-400',
    bg: 'bg-soft-mint/60',
    icon: Users,
  },
];

export default function HeroSection() {
  const { user } = useUser();

  return (
    <section className="animate-pop-in">
      {/* Salomlashish */}
      <div className="glass-card mb-8 flex flex-col items-center gap-4 bg-hero-gradient p-5 text-center sm:flex-row sm:p-8 sm:text-left">
        <div className="animate-float">
          <Avatar url={user?.avatar_url} size={88} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-slate-800 sm:text-4xl">
            Salom, {user?.name}!
          </h1>
          <p className="mt-2 text-slate-500">
            Bugun qaysi qiziqarli darsni boshlaysiz? Har bir dars{' '}
            <span className="inline-flex items-center gap-0.5 font-bold text-amber-500">
              <Coins size={15} /> tanga
            </span>{' '}
            va{' '}
            <span className="inline-flex items-center gap-0.5 font-bold text-purple-500">
              <Trophy size={15} /> yulduz
            </span>{' '}
            beradi!
          </p>
        </div>
        <div className="glass-nav flex items-center gap-4 px-5 py-3">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-amber-600">{user?.coins_balance}</p>
            <p className="text-xs font-semibold text-slate-400">tanga</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-2xl font-extrabold text-purple-600">{user?.stars_count}</p>
            <p className="text-xs font-semibold text-slate-400">yulduz</p>
          </div>
        </div>
      </div>

      {/* Bo'lim kartalari */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map(({ to, title, badge, description, gradient, bg, icon: Icon }, i) => (
          <Link
            key={to}
            to={to}
            onClick={Sound.select}
            className={`play-card glass-card group relative animate-stagger ${bg}`}
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`inline-flex rounded-2xl bg-gradient-to-br p-3 text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${gradient}`}
              >
                <Icon size={26} />
              </div>
              <span className="pill bg-white/80 text-slate-400">{badge}</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{description}</p>

            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-candy-purple opacity-70 transition group-hover:gap-2 group-hover:opacity-100">
              Boshlash <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>

      {/* Motivatsiya banner */}
      <div className="glass-card mt-8 flex flex-col items-center gap-3 bg-gradient-to-r from-soft-yellow/70 to-soft-orange/70 p-6 text-center sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white p-3 text-amber-500 shadow-candy">
            <Lightbulb size={24} />
          </div>
          <p className="text-lg font-bold text-amber-700">
            Har kuni 15 daqiqa o'rgansang, aqlli bolaga aylanasiz!
          </p>
        </div>
        <Link
          to="/lessons"
          onClick={Sound.click}
          className="btn-candy btn-glow shrink-0 bg-candy-purple"
        >
          <Flame size={18} /> Bugun o'rganishni boshlash
        </Link>
      </div>
    </section>
  );
}