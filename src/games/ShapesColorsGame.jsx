import { useMemo, useState } from 'react';
import { Circle, Square, Triangle, Star, PartyPopper } from 'lucide-react';
import Sound from '../utils/sound';

const SHAPES = ['circle', 'square', 'triangle', 'star'];
const SHAPE_LABELS = { circle: 'doira', square: 'kvadrat', triangle: 'uchburchak', star: 'yulduz' };
const SHAPE_ICONS = { circle: Circle, square: Square, triangle: Triangle, star: Star };
const COLORS = ['red', 'blue', 'green', 'purple', 'orange'];
const COLOR_LABELS = {
  red: 'Qizil',
  blue: "Ko'k",
  green: 'Yashil',
  purple: 'Binafsha',
  orange: 'To\'q sariq',
};
const COLOR_CLASSES = {
  red: 'text-rose-500',
  blue: 'text-candy-blue',
  green: 'text-candy-green',
  purple: 'text-candy-purple',
  orange: 'text-amber-500',
};

const TOTAL = 5;

function makeRound() {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const target = { shape, color };
  const tiles = [];
  while (tiles.length < 6) {
    const s = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    const same = s === shape && c === color;
    if (same && tiles.some((t) => t.same)) continue;
    tiles.push({ id: tiles.length, shape: s, color: c, same });
  }
  return { target, tiles };
}

/**
 * Shakl va ranglar: "Qizil doirani top" kabi savollar.
 * 5 raund, onFinish = to'g'ri javoblar / 5 * 100.
 */
export default function ShapesColorsGame({ onFinish }) {
  const [round, setRound] = useState(0);
  const [data, setData] = useState(makeRound);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [locked, setLocked] = useState(false);

  const target = useMemo(() => data.target, [data]);
  const TargetIcon = SHAPE_ICONS[target.shape];

  const pick = (tile) => {
    if (locked) return;
    setLocked(true);
    if (tile.same) {
      Sound.answer(true);
      const newScore = score + 1;
      setScore(newScore);
      setFeedback('right');
      setTimeout(() => {
        if (round >= TOTAL - 1) {
          onFinish((newScore / TOTAL) * 100);
          return;
        }
        setRound((r) => r + 1);
        setData(makeRound());
        setFeedback(null);
        setLocked(false);
      }, 550);
    } else {
      Sound.answer(false);
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setLocked(false);
      }, 550);
    }
  };

  return (
    <div>
      <p className="mb-1 flex items-center justify-center gap-2 text-center font-semibold text-slate-500">
        Top:
        <TargetIcon size={22} className={COLOR_CLASSES[target.color]} fill="currentColor" />
        {COLOR_LABELS[target.color]} {SHAPE_LABELS[target.shape]}
      </p>
      <p className="mb-4 text-center text-sm font-bold text-amber-600">Raund {round + 1} / {TOTAL}</p>

      <div className="mx-auto grid max-w-sm grid-cols-3 gap-3">
        {data.tiles.map((tile) => {
          const Icon = SHAPE_ICONS[tile.shape];
          return (
            <button
              key={tile.id}
              onClick={() => pick(tile)}
              className={`flex aspect-square items-center justify-center rounded-3xl border-2 bg-white shadow-soft transition active:scale-90 ${
                feedback === 'right' && tile.same
                  ? 'animate-tada border-candy-green bg-soft-mint'
                  : feedback === 'right'
                    ? 'opacity-30'
                    : feedback === 'wrong' && tile.same
                      ? 'opacity-70'
                      : feedback === 'wrong' && !tile.same
                        ? 'animate-shake border-rose-300'
                        : 'border-soft-purple hover:scale-105 hover:border-candy-purple'
              }`}
            >
              <Icon size={46} className={COLOR_CLASSES[tile.color]} fill="currentColor" />
            </button>
          );
        })}
      </div>

      {feedback === 'right' && (
        <p className="mt-4 animate-pop-in text-center text-lg font-extrabold text-candy-green">
          <PartyPopper size={18} className="inline" /> Barakalla!
        </p>
      )}
      {feedback === 'wrong' && (
        <p className="mt-4 animate-pop-in text-center text-lg font-extrabold text-rose-500">Boshqa birini qidir!</p>
      )}
      <p className="mt-4 text-center text-sm font-bold text-slate-400">To'g'ri javoblar: {score} / {TOTAL}</p>
    </div>
  );
}