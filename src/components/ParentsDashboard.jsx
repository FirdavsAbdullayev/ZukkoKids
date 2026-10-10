import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, Coins, Star, Trophy, BookOpen, ArrowLeft, CalendarDays, TrendingUp,
  BarChart3, History, Languages, Hash, Globe2, Atom, Users,
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { getUserProgress, listUsers, listLessons } from '../services/api';
import Avatar from './Avatar';
import Sound from '../utils/sound';

const CATEGORY_LABELS = {
  alphabet: { label: 'Alifbo', Icon: Languages },
  numbers: { label: 'Raqamlar', Icon: Hash },
  english: { label: 'Ingliz tili', Icon: Globe2 },
  stem: { label: 'STEM', Icon: Atom },
};

function formatDuration(seconds) {
  const s = Number(seconds) || 0;
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  if (h > 0) return `${h} soat ${m} daqiqa`;
  return `${m} daqiqa`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ParentsDashboard() {
  const { user } = useUser();
  const [progress, setProgress] = useState(null);
  const [children, setChildren] = useState([]);
  const [lessonTotals, setLessonTotals] = useState({});
  const [selectedId, setSelectedId] = useState(user?.id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) setSelectedId(user.id);
  }, [user?.id]);

  const loadDashboard = useCallback(async (userId) => {
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      const res = await getUserProgress(userId);
      setProgress(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Statistikani yuklab bo'lmadi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    listUsers()
      .then((res) => {
        const sameParent = res.data.filter((u) => u.parent_email === user?.parent_email);
        setChildren(sameParent.length ? sameParent : res.data);
      })
      .catch(() => {});
  }, [user?.parent_email]);

  // Har bir kategoriyadagi darslar soni (progress bar uchun haqiqiy max qiymat)
  useEffect(() => {
    listLessons()
      .then((res) => {
        const totals = {};
        (res.data || []).forEach((l) => {
          totals[l.category] = (totals[l.category] || 0) + 1;
        });
        setLessonTotals(totals);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadDashboard(selectedId);
  }, [selectedId, loadDashboard]);

  const stats = progress?.stats;
  const categoryEntries = stats?.by_category ? Object.entries(stats.by_category) : [];

  return (
    <section className="animate-pop-in">
      <Link
        to="/"
        className="mb-2 inline-flex items-center gap-1 text-sm font-bold text-slate-400 transition hover:text-candy-green"
        onClick={Sound.click}
      >
        <ArrowLeft size={16} /> Bosh sahifa
      </Link>
      <h1 className="flex items-center gap-2 text-2xl font-extrabold text-candy-green sm:text-3xl">
        <Users size={28} /> Ota-onalar paneli
      </h1>
      <p className="mb-6 text-slate-500">
        Farzandingizning o'quv muvaffaqiyati va sarflangan vaqti statistikasi.
      </p>

      {error && (
        <p className="mb-4 animate-shake rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-500">
          {error}
        </p>
      )}

      {/* Bola tanlash */}
      {children.length > 1 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-500">Bola:</span>
          {children.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                Sound.select();
                setSelectedId(c.id);
              }}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 font-bold transition ${
                selectedId === c.id
                  ? 'bg-candy-green text-white shadow-candy'
                  : 'bg-white/70 text-slate-500 hover:bg-soft-mint/50'
              }`}
            >
              <Avatar url={c.avatar_url} size={26} />
              {c.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="glass-card p-8 text-center text-slate-400">Yuklanmoqda...</div>
      ) : (
        <>
          {/* Asosiy statistik kartalar */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="play-card glass-card bg-soft-yellow/70 animate-stagger">
              <Coins size={22} className="text-amber-500" />
              <p className="mt-2 text-3xl font-extrabold text-amber-700 tabular-nums">
                {progress?.user?.coins_balance ?? 0}
              </p>
              <p className="text-sm font-semibold text-amber-600">Tanga balansi</p>
            </div>

            <div className="play-card glass-card bg-soft-purple/70 animate-stagger" style={{ animationDelay: '60ms' }}>
              <Star size={22} className="fill-purple-500 text-purple-500" />
              <p className="mt-2 text-3xl font-extrabold text-purple-700 tabular-nums">
                {progress?.user?.stars_count ?? 0}
              </p>
              <p className="text-sm font-semibold text-purple-600">Yulduzlar</p>
            </div>

            <div className="play-card glass-card bg-soft-sky/70 animate-stagger" style={{ animationDelay: '120ms' }}>
              <Trophy size={22} className="text-candy-blue" />
              <p className="mt-2 text-3xl font-extrabold text-candy-blue tabular-nums">
                {stats?.total_completed ?? 0}
              </p>
              <p className="text-sm font-semibold text-sky-600">Tugatilgan darslar</p>
            </div>

            <div className="play-card glass-card bg-soft-mint/70 animate-stagger" style={{ animationDelay: '180ms' }}>
              <Clock size={22} className="text-candy-green" />
              <p className="mt-2 text-3xl font-extrabold text-candy-green tabular-nums">
                {formatDuration(stats?.total_time_seconds || 0)}
              </p>
              <p className="text-sm font-semibold text-green-600">Umumiy o'quv vaqti</p>
            </div>
          </div>

          {/* Kategoriya statistikasi */}
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="glass-card p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-slate-700">
                <BarChart3 size={20} className="text-candy-blue" /> Kategoriya bo'yicha
                o'zlashtirish
              </h3>
              {categoryEntries.length === 0 ? (
                <p className="text-sm text-slate-400">Hali dars tugatilmagan.</p>
              ) : (
                <div className="space-y-3">
                  {categoryEntries.map(([cat, s]) => {
                    const total = lessonTotals[cat] || 0;
                    const pct = total > 0 ? Math.min(100, Math.round((s.completed_count / total) * 100)) : 0;
                    const meta = CATEGORY_LABELS[cat];
                    return (
                      <div key={cat}>
                        <div className="mb-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-sm font-bold">
                          <span className="inline-flex min-w-0 items-center gap-1.5 text-slate-600">
                            {meta ? <meta.Icon size={16} className="shrink-0 text-slate-400" /> : null}
                            {meta?.label || cat}
                          </span>
                          <span className="text-slate-400">
                            {s.completed_count}/{total || '?'} dars · o'rt.{' '}
                            {s.completed_count ? Math.round(s.total_score / s.completed_count) : 0}%
                          </span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-candy-green to-emerald-400 transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* So'nggi o'rganilgan darslar */}
            <div className="glass-card p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-slate-700">
                <History size={20} className="text-candy-purple" /> So'nggi o'rganganlari
              </h3>
              {!progress?.completed_lessons?.length ? (
                <p className="text-sm text-slate-400">
                  Farzandingiz hali dars yakunlamagan. Unga dars tanlashda yordam bering!
                </p>
              ) : (
                <ul className="space-y-3">
                  {progress.completed_lessons.slice(0, 6).map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-3 rounded-2xl bg-white/70 p-3 transition hover:bg-white"
                    >
                      <BookOpen size={18} className="shrink-0 text-candy-purple" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-slate-700">{p.lesson?.title}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <CalendarDays size={12} />
                          <span>{formatDate(p.completed_at)}</span>
                          <Clock size={12} />
                          <span>{formatDuration(p.time_spent_seconds)}</span>
                        </div>
                      </div>
                      <span className="pill shrink-0 bg-soft-sky text-candy-blue">{p.score} ball</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* O'rtacha ball banneri */}
          {stats && (
            <div className="glass-card mt-6 flex animate-slide-up items-center gap-4 bg-gradient-to-r from-soft-yellow/70 to-soft-orange/70 p-5">
              <div className="rounded-2xl bg-white p-3 text-candy-orange shadow-candy">
                <TrendingUp size={24} />
              </div>
              <p className="text-slate-700">
                O'rtacha dars natijasi:{' '}
                <b className="text-candy-orange">{stats.average_score}%</b>{' '}
                —{' '}
                {stats.average_score >= 70
                  ? 'Juda yaxshi o\u2018zlashtirmoqda!'
                  : 'Biroz ko\u2018proq mashq qilsa yaxshi!'}
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}