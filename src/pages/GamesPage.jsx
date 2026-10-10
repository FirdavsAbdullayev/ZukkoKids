import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Coins, Star, Lock, Play, Brain, Grid, Search, Music, Target, Hash,
  Shapes, Map, Heart, Check, Medal,
} from 'lucide-react';
import { useShop } from '../hooks/useShop';
import { useUser } from '../hooks/useUser';
import Sound from '../utils/sound';
import GameShell from '../games/GameShell';
import GAME_COMPONENTS from '../games';

const ICON_BY_GAME = {
  memory: Brain,
  tictactoe: Grid,
  odd_one_out: Search,
  simon: Music,
  balloon_pop: Target,
  number_hunt: Hash,
  shapes_colors: Shapes,
  maze: Map,
};

const GRADIENT_BY_GAME = {
  memory: 'from-candy-purple to-purple-400',
  tictactoe: 'from-candy-blue to-sky-400',
  odd_one_out: 'from-amber-400 to-orange-400',
  simon: 'from-candy-pink to-rose-400',
  balloon_pop: 'from-amber-400 to-yellow-500',
  number_hunt: 'from-candy-blue to-cyan-400',
  shapes_colors: 'from-candy-green to-emerald-400',
  maze: 'from-candy-pink to-fuchsia-500',
};

function formatProgress(p) {
  if (!p) return null;
  const parts = [];
  if (p.best_score > 0) parts.push(`${p.best_score} ball`);
  if (p.stars_earned > 0) parts.push(`${p.stars_earned} yulduz`);
  if (p.plays > 0) parts.push(`${p.plays} marta o'ynalgan`);
  return parts.join(' • ');
}

export default function GamesPage() {
  const { games, isOwned, buy, loading, error, refresh } = useShop();
  const { user } = useUser();
  const [playing, setPlaying] = useState(null);
  const [buying, setBuying] = useState(null);
  const [msg, setMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    refresh();
  }, [refresh]);

  const unlock = async (game) => {
    if (buying) return;
    setBuying(game.key);
    setErrMsg('');
    setMsg('');
    try {
      await buy(game.key);
      Sound.fanfare();
      setMsg(`"${game.title}" ochildi! Endi o'ynashingiz mumkin.`);
    } catch (e) {
      Sound.error();
      setErrMsg(e.response?.data?.message || 'Ochishda xatolik yuz berdi');
    } finally {
      setBuying(null);
    }
  };

  if (playing) {
    const GameComp = GAME_COMPONENTS[playing.key] || GAME_COMPONENTS.memory;
    return (
      <GameShell
        game={playing}
        onClose={() => {
          setPlaying(null);
          refresh();
        }}
        renderGame={({ onFinish }) => <GameComp onFinish={onFinish} />}
      />
    );
  }

  return (
    <section className="animate-pop-in">
      <Link
        to="/"
        className="mb-2 inline-flex items-center gap-1 text-sm font-bold text-slate-400 transition hover:text-candy-purple"
        onClick={Sound.click}
      >
        <ArrowLeft size={16} /> Bosh sahifa
      </Link>
      <h1 className="flex items-center gap-2 text-2xl font-extrabold text-candy-purple sm:text-3xl">
        <Play size={28} className="fill-candy-purple" /> O'yinlar
      </h1>
      <p className="mb-6 text-slate-500">
        O'yin o'ynab tanga yig'! Ba'zi o'yinlar bepul, ba'zilari do'kondan ochiladi.
      </p>

      {errMsg && (
        <p className="mb-4 animate-shake rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">{errMsg}</p>
      )}
      {msg && (
        <p className="mb-4 animate-pop-in rounded-xl bg-soft-mint/70 p-3 text-center font-bold text-green-700">{msg}</p>
      )}

      {loading ? (
        <div className="glass-card flex items-center justify-center gap-2 p-8 text-slate-400">
          <Heart size={20} className="animate-pulse text-pink-400" /> O'yinlar yuklanmoqda...
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game, i) => {
            const Icon = ICON_BY_GAME[game.key] || Shapes;
            const gradient = GRADIENT_BY_GAME[game.key] || 'from-candy-purple to-purple-400';
            const unlocked = isOwned(game.key) || game.price === 0;
            const best = game.progress?.best_score || 0;
            return (
              <div
                key={game.key}
                className="play-card glass-card group flex flex-col p-5 animate-stagger"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className={`inline-flex rounded-2xl bg-gradient-to-br p-3 text-white shadow-soft transition group-hover:scale-110 ${gradient}`}>
                    <Icon size={24} />
                  </div>
                  {unlocked ? (
                    <span className="pill bg-soft-mint text-candy-green">
                      <Check size={14} /> Ochiq
                    </span>
                  ) : (
                    <span className="pill bg-soft-yellow text-amber-700">
                      <Coins size={14} /> {game.price}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-extrabold text-slate-800">{game.title}</h3>
                <p className="mt-1 flex-1 text-sm text-slate-500">{game.description}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400">
                  <span className="pill bg-soft-yellow/60 text-amber-700">
                    <Coins size={13} /> +{game.reward_coins}
                  </span>
                  {best > 0 && (
                    <span className="pill bg-soft-purple/60 text-purple-700">
                      <Medal size={13} /> Eng yaxshi: {best}
                    </span>
                  )}
                  {game.progress && (
                    <span className="w-full text-[11px] text-slate-400">
                      {formatProgress(game.progress)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    Sound.select();
                    if (unlocked) setPlaying(game);
                    else unlock(game);
                  }}
                  disabled={buying === game.key}
                  className={`btn-candy mt-4 ${unlocked ? 'bg-candy-purple' : 'bg-candy-blue'}`}
                >
                  {buying === game.key ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-white/40 border-t-white" />
                      Ochilmoqda...
                    </>
                  ) : unlocked ? (
                    <>
                      <Play size={18} /> O'ynash
                    </>
                  ) : (
                    <>
                      <Lock size={18} /> Ochish
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!loading && error && <p className="glass-card mt-6 p-4 text-center text-sm text-red-500">{error}</p>}

      <div className="glass-card mt-6 flex items-center gap-3 bg-soft-yellow/50 p-4">
        <Star size={20} className="shrink-0 fill-amber-400 text-amber-400" />
        <p className="text-sm text-slate-600">
          <b>Qoidalar:</b> har bir o'yin birinchi g'alabada tanga va yulduz beradi (kamida{' '}
          <b>60 ball</b> bo'lishi kerak). Keyingi marta o'ynashda mukofot berilmaydi — shunchaki
          reytingingiz yaxshilanadi!
        </p>
      </div>
    </section>
  );
}