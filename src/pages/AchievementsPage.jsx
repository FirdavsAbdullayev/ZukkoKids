import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Trophy, Target, Coins, Star, BookOpen, Zap, Medal, Lock, Flame,
} from 'lucide-react';
import { getUserProgress } from '../services/api';
import { useUser } from '../hooks/useUser';
import useStreak from '../hooks/useStreak';

const BADGES = [
  {
    id: 'first-step',
    Icon: BookOpen,
    title: "Birinchi qadam",
    description: 'Birinchi darsni yakunlash',
    color: 'from-candy-blue to-sky-400',
    check: (s, u, p) => p.completed_lessons.length >= 1,
  },
  {
    id: 'perfect-10',
    Icon: Medal,
    title: 'Mukammal',
    description: 'Kamida 2 ta darsda 90+ ball',
    color: 'from-amber-400 to-orange-400',
    check: (s, u, p) => p.completed_lessons.filter((l) => l.score >= 90).length >= 2,
  },
  {
    id: 'collector',
    Icon: Coins,
    title: 'Tangachi',
    description: '100 tanga yig\'ish',
    color: 'from-yellow-400 to-amber-500',
    check: (s, u) => u.coins_balance >= 100,
  },
  {
    id: 'star-gazer',
    Icon: Star,
    title: 'Yulduzchi',
    description: '5 yulduz to\'plash',
    color: 'from-purple-400 to-fuchsia-400',
    check: (s, u) => u.stars_count >= 5,
  },
  {
    id: 'student-10',
    Icon: Trophy,
    title: 'Tirishqoq',
    description: '10 ta dars yakunlash',
    color: 'from-candy-green to-emerald-400',
    check: (s, u, p) => p.completed_lessons.length >= 10,
  },
  {
    id: 'sharp',
    Icon: Target,
    title: 'Aniq otuvchi',
    description: 'Bir darsda 100 ball',
    color: 'from-candy-pink to-rose-400',
    check: (s, u, p) => p.completed_lessons.some((l) => l.score === 100),
  },
  {
    id: 'speed',
    Icon: Zap,
    title: 'Tez o\'quvchi',
    description: '2 daqiqadan kam vaqtda dars yakunlash',
    color: 'from-sky-400 to-cyan-400',
    check: (s, u, p) => p.completed_lessons.some((l) => l.time_spent_seconds <= 120),
  },
  {
    id: 'week-streak',
    Icon: Star,
    title: 'Hafta seriyasi',
    description: '7 kun ketma-ket o\'qish',
    color: 'from-orange-400 to-red-400',
    check: (s) => s >= 7,
  },
];

export default function AchievementsPage() {
  const { user } = useUser();
  const { streak: streakInfo } = useStreak();
  const streak = streakInfo.count;
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await getUserProgress(user.id);
      setProgress(res.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    load();
  }, [load]);

  const unlocked = progress
    ? BADGES.filter((b) => b.check(streak, progress.user || user, progress)).length
    : 0;

  return (
    <section className="animate-pop-in">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-bold text-slate-400 transition hover:text-candy-purple"
      >
        <ArrowLeft size={16} /> Bosh sahifa
      </Link>

      <div className="glass-card mb-6 mt-2 flex flex-col items-center gap-4 bg-gradient-to-r from-soft-purple/70 to-soft-sky/70 p-6 text-center sm:flex-row sm:text-left">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-candy-purple to-purple-400 text-white shadow-candy animate-float">
          <Trophy size={30} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-slate-800 sm:text-3xl">Yutuqlar zali</h1>
          <p className="text-slate-500">
            Qancha ko'p o'rgansang, shuncha medal yig'asiz! Ochiq: {unlocked} / {BADGES.length}
          </p>
        </div>
        <div className="glass-card shrink-0 bg-white/70 px-4 py-2 text-center">
          <p className="flex items-center justify-center gap-1 text-2xl font-extrabold text-candy-orange">
            <Flame size={22} /> {streak}
          </p>
          <p className="text-xs font-semibold text-slate-400">kunlik seriya</p>
        </div>
      </div>

      {loading ? (
        <div className="glass-card p-8 text-center text-slate-400">Yuklanmoqda...</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((badge) => {
            const isUnlocked = progress && badge.check(streak, progress.user || user, progress);
            return (
              <div
                key={badge.id}
                className={`glass-card relative overflow-hidden p-5 transition-all duration-300 ${
                  isUnlocked
                    ? 'hover:-translate-y-1 hover:shadow-pop'
                    : 'opacity-60 grayscale'
                }`}
              >
                <div
                  className={`mb-3 inline-flex rounded-2xl bg-gradient-to-br p-3 text-white shadow-soft ${
                    badge.color
                  } ${isUnlocked ? 'animate-pop-in' : ''}`}
                >
                  {isUnlocked ? <badge.Icon size={24} /> : <Lock size={24} />}
                </div>
                <h3 className="text-lg font-extrabold text-slate-800">{badge.title}</h3>
                <p className="text-sm text-slate-500">{badge.description}</p>
                <span
                  className={`pill mt-3 ${
                    isUnlocked ? 'bg-soft-yellow text-amber-700' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isUnlocked ? 'Ochilgan' : 'Yopiq'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}