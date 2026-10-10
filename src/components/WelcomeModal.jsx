import { useState } from 'react';
import { Sparkles, Rocket, GraduationCap, Coins } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { AVATAR_OPTIONS } from './Avatar';
import Sound from '../utils/sound';

export default function WelcomeModal() {
  const { login, loading } = useUser();
  const [form, setForm] = useState({
    name: '',
    age: '',
    parent_email: '',
    avatar_url: AVATAR_OPTIONS[0].key,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    Sound.success();
    try {
      await login(form);
    } catch (err) {
      Sound.error();
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Serverga ulanib bo'lmadi. Backend ishga tushganini tekshiring.";
      setError(msg);
    }
  };

  return (
    <div className="mx-auto mt-6 max-w-lg animate-pop-in">
      <div className="glass-card bg-hero-gradient p-6 text-center sm:p-8">
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-candy-purple to-purple-400 text-white shadow-candy animate-float">
          <GraduationCap size={44} />
        </div>
        <h1 className="text-2xl font-extrabold text-gradient sm:text-3xl">ZukkoKids'ga xush kelibsiz!</h1>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-slate-500">
          O'rgan, o'yna, tanga yig'!{' '}
          <Coins size={16} className="inline text-amber-500" /> Biliming tangaga aylanadi.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          <div>
            <label className="mb-1 block font-bold text-slate-600">Isming</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={60}
              placeholder="Masalan: Aziza"
              className="w-full rounded-2xl border-2 border-soft-purple bg-white px-4 py-3 text-lg outline-none transition focus:border-candy-purple focus:shadow-glow"
            />
          </div>

          <div>
            <label className="mb-1 block font-bold text-slate-600">Yoshing</label>
            <input
              name="age"
              type="number"
              min={3}
              max={12}
              value={form.age}
              onChange={handleChange}
              required
              placeholder="3 dan 12 gacha"
              className="w-full rounded-2xl border-2 border-soft-purple bg-white px-4 py-3 text-lg outline-none transition focus:border-candy-purple focus:shadow-glow"
            />
          </div>

          <div>
            <label className="mb-1 block font-bold text-slate-600">
              Ota-ona email{' '}
              <span className="text-xs font-normal text-slate-400">(statistika uchun)</span>
            </label>
            <input
              name="parent_email"
              type="email"
              value={form.parent_email}
              onChange={handleChange}
              required
              placeholder="parent@example.com"
              className="w-full rounded-2xl border-2 border-soft-purple bg-white px-4 py-3 text-lg outline-none transition focus:border-candy-purple focus:shadow-glow"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold text-slate-600">Avataringni tanla</label>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {AVATAR_OPTIONS.map((a) => {
                const selected = form.avatar_url === a.key;
                return (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => {
                      Sound.select();
                      setForm((f) => ({ ...f, avatar_url: a.key }));
                    }}
                    className={`rounded-2xl border-2 bg-white p-3 transition hover:scale-110 ${
                      selected
                        ? 'border-candy-purple ring-4 ring-candy-purple/30 animate-wiggle'
                        : 'border-transparent'
                    }`}
                    aria-label={a.label}
                  >
                    <div
                      className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-white ${a.gradient}`}
                    >
                      <a.Icon size={20} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="animate-shake rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-candy btn-glow w-full bg-candy-purple text-lg disabled:opacity-60"
          >
            <Rocket size={20} />
            {loading ? 'Yaratilmoqda...' : "Boshlash! O'yna va o'rgan!"}
            <Sparkles size={18} />
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          Backend:{' '}
          <code className="rounded bg-white/70 px-1">http://localhost:5000/api-docs</code>
        </p>
      </div>
    </div>
  );
}