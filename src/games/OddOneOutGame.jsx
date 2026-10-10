import { useState } from 'react';
import {
  Cat, Dog, Bird, Fish, Rabbit, Squirrel, Turtle, Snail, Bug, Rat, Bone, PawPrint,
  PartyPopper,
} from 'lucide-react';
import Sound from '../utils/sound';

const ICON_POOL = [Cat, Dog, Bird, Fish, Rabbit, Squirrel, Turtle, Snail, Bug, Rat, Bone, PawPrint];

const TOTAL_ROUNDS = 5;

function pickIcon() {
  return ICON_POOL[Math.floor(Math.random() * ICON_POOL.length)];
}

function makeRound() {
  const same = pickIcon();
  let odd = pickIcon();
  while (odd === same) odd = pickIcon();
  const tiles = [
    { id: 0, Icon: same, odd: false },
    { id: 1, Icon: same, odd: false },
    { id: 2, Icon: same, odd: false },
    { id: 3, Icon: odd, odd: true },
  ];
  return tiles.sort(() => Math.random() - 0.5);
}

/**
 * Chap-topoq: 4 ta rasmdan boshqasini topish.
 * 5 raund, onFinish = to'g'ri javoblar soni * 20.
 */
export default function OddOneOutGame({ onFinish }) {
  const [round, setRound] = useState(0);
  const [tiles, setTiles] = useState(makeRound);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'right' | 'wrong' | null
  const [locked, setLocked] = useState(false);

  const pick = (tile) => {
    if (locked) return;
    setLocked(true);
    if (tile.odd) {
      Sound.answer(true);
      const newScore = score + 1;
      setScore(newScore);
      setFeedback('right');
      setTimeout(() => {
        if (round >= TOTAL_ROUNDS - 1) {
          onFinish((newScore / TOTAL_ROUNDS) * 100);
          return;
        }
        setRound((r) => r + 1);
        setTiles(makeRound());
        setFeedback(null);
        setLocked(false);
      }, 650);
    } else {
      Sound.answer(false);
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setLocked(false);
      }, 650);
    }
  };

  return (
    <div>
      <p className="mb-1 text-center font-semibold text-slate-500">
        To'rtta ikonkadan boshqacha bo'lganini top
      </p>
      <p className="mb-4 text-center text-sm font-bold text-amber-600">Raund {round + 1} / {TOTAL_ROUNDS}</p>
      <div className="mx-auto grid max-w-sm grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((tile) => {
          const Icon = tile.Icon;
          return (
            <button
              key={tile.id}
              onClick={() => pick(tile)}
              className={`flex aspect-square items-center justify-center rounded-3xl border-2 bg-white shadow-soft transition active:scale-90 ${
                feedback === 'right' && tile.odd
                  ? 'animate-tada border-candy-green bg-soft-mint'
                  : feedback === 'right'
                    ? 'opacity-40'
                    : feedback === 'wrong' && !tile.odd
                      ? 'animate-shake border-rose-300 opacity-50'
                      : 'border-soft-purple hover:scale-105 hover:border-candy-purple'
              }`}
            >
              <Icon size={44} className="text-slate-700" />
            </button>
          );
        })}
      </div>
      {feedback === 'right' && (
        <p className="mt-4 animate-pop-in text-center text-lg font-extrabold text-candy-green">
          <PartyPopper size={18} className="inline" /> To'g'ri!
        </p>
      )}
      {feedback === 'wrong' && (
        <p className="mt-4 animate-pop-in text-center text-lg font-extrabold text-rose-500">Boshqa birini qidir!</p>
      )}
      <p className="mt-4 text-center text-sm font-bold text-slate-400">
        To'g'ri javoblar: {score} / {TOTAL_ROUNDS}
      </p>
    </div>
  );
}