import { useState } from 'react';
import { Coins, Star, PartyPopper, RotateCcw, X, Trophy, Medal } from 'lucide-react';
import { useShop } from '../hooks/useShop';
import Sound from '../utils/sound';

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

const GAME_GRADIENT = (key) => GRADIENT_BY_GAME[key] || 'from-candy-purple to-purple-400';

/**
 * O'yin qobig'i: o'yin komponentini joylaydi, natijani serverga yuboradi
 * va natija oynasini ko'rsatadi. Xuddi o'yin fixturasi:
 * komponent `onFinish(score)` chaqirganda bu yerda API chaqiriladi.
 */
export default function GameShell({ game, onClose, renderGame }) {
  const { reportGameResult } = useShop();
  const [round, setRound] = useState(0);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFinish = async (score) => {
    if (submitting || result) return;
    setSubmitting(true);
    setError('');
    try {
      const safe = Math.max(0, Math.min(100, Math.round(score)));
      const res = await reportGameResult(game.key, safe);
      setResult({ score: safe, res });
      if (res?.data?.first_win) {
        Sound.fanfare();
      } else if (res?.data?.earned_coins > 0) {
        Sound.success();
      } else if (safe >= (game.min_score || 50)) {
        Sound.pop();
      } else {
        Sound.error();
      }
    } catch (err) {
      Sound.error();
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          'Natijani saqlashda xatolik yuz berdi'
      );
      // Natijani lokal ko'rsatish uchun o'tkazib yuboramiz (serverda boshqa safar hisoblanadi)
      setResult({ score: Math.max(0, Math.min(100, Math.round(score))), res: null });
    } finally {
      setSubmitting(false);
    }
  };

  const win = result?.score >= (game.min_score || 50);

  return (
    <section className="animate-pop-in">
      <div className="glass-card mb-5 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-soft-purple/40 to-soft-sky/40 p-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Mini-o'yin</p>
          <h1 className="flex items-center gap-2 text-xl font-extrabold text-slate-800 sm:text-2xl">
            <Trophy size={22} className="shrink-0 text-candy-purple" />
            {game.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {game.reward_coins > 0 && (
            <span className="pill bg-soft-yellow text-amber-700">
              <Coins size={15} /> +{game.reward_coins}
            </span>
          )}
          <button
            onClick={() => {
              Sound.click();
              onClose();
            }}
            className="rounded-xl bg-white/70 p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            title="Chiqish"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 animate-shake rounded-xl bg-red-50 p-3 text-center text-sm font-semibold text-red-600">
          {error}
        </p>
      )}

      <div key={round} className="glass-card p-5 sm:p-8">
        {result ? (
          <div className="mx-auto max-w-md text-center">
            {win && (
              <div className="mx-auto -mt-12 mb-3 w-fit animate-tada rounded-full bg-white px-4 py-2 text-sm font-extrabold text-candy-purple shadow-candy">
                <PartyPopper size={16} className="inline" /> Tabriklaymiz!
              </div>
            )}
            <div
              className={`mx-auto mb-4 inline-flex rounded-3xl bg-gradient-to-br p-8 text-white shadow-candy ${GAME_GRADIENT(
                game.key
              )}`}
            >
              <Medal size={48} />
            </div>
            <p className="text-3xl font-extrabold text-slate-800">
              {result.score} ball
            </p>
            {result.res?.data ? (
              <div className="mt-3 flex items-center justify-center gap-4 text-lg font-extrabold">
                <span className="pill bg-soft-yellow text-amber-700">
                  <Coins size={17} /> +{result.res.data.earned_coins}
                </span>
                <span className="pill bg-soft-purple text-purple-700">
                  <Star size={17} className="fill-purple-500 text-purple-500" /> +
                  {result.res.data.earned_stars}
                </span>
              </div>
            ) : (
              <p className="mt-3 text-sm font-semibold text-slate-400">
                Natija saqlanmadi — keyingi o'yinda mukofot hisoblanadi.
              </p>
            )}
            {result.res?.data && !result.res.data.first_win && result.res.data.earned_coins === 0 && (
              <p className="mt-2 text-sm font-semibold text-slate-400">
                Mukofot birinchi g'alabada beriladi. Yana urinib ko'r!
              </p>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => {
                  Sound.click();
                  setRound((r) => r + 1);
                  setResult(null);
                }}
                className="btn-candy bg-candy-blue"
              >
                <RotateCcw size={18} /> Qayta o'ynash
              </button>
              <button onClick={() => { Sound.click(); onClose(); }} className="btn-candy bg-candy-purple">
                <X size={18} /> Yopish
              </button>
            </div>
          </div>
        ) : (
          renderGame({ onFinish: handleFinish, disabled: submitting })
        )}
      </div>
    </section>
  );
}

export { GAME_GRADIENT };