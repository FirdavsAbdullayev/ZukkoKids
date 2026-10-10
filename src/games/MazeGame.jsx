import { useCallback, useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Rabbit, Star } from 'lucide-react';
import Sound from '../utils/sound';

const MAZE = [
  '#######',
  'S     #',
  '### # #',
  '#   # #',
  '# ### #',
  '#   # G',
  '#######',
];

const HEIGHT = MAZE.length;
const WIDTH = MAZE[0].length;

function findStart() {
  for (let r = 0; r < HEIGHT; r += 1) {
    const c = MAZE[r].indexOf('S');
    if (c !== -1) return { r, c };
  }
  return { r: 1, c: 0 };
}

const START = findStart();
const DELTAS = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };

/**
 * Labirint: S dan yulduzga yetish. onFinish = 100 (yetishganda).
 */
export default function MazeGame({ onFinish }) {
  const [pos, setPos] = useState(START);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const move = useCallback(
    (dir) => {
      if (won) return;
      const [dr, dc] = DELTAS[dir];
      const nr = pos.r + dr;
      const nc = pos.c + dc;
      if (nr < 0 || nc < 0 || nr >= HEIGHT || nc >= WIDTH) return;
      const ch = MAZE[nr][nc];
      if (ch === '#') {
        Sound.error();
        return;
      }
      Sound.select();
      setPos({ r: nr, c: nc });
      setMoves((m) => m + 1);
      if (ch === 'G') {
        setWon(true);
        Sound.fanfare();
        setTimeout(() => onFinish(100), 400);
      }
    },
    [pos, won, onFinish]
  );

  useEffect(() => {
    const onKey = (e) => {
      const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        move(dir);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move]);

  return (
    <div>
      <p className="mb-1 text-center font-semibold text-slate-500">
        Yulduzga yetib bor! Strelka tugmalari yoki klaviatura bilan harakatlan
      </p>
      <p className="mb-4 text-center text-sm font-bold text-amber-600">Harakatlar: {moves}</p>

      <div className="mx-auto grid w-fit gap-0.5 rounded-2xl bg-soft-purple/30 p-2" style={{ gridTemplateColumns: `repeat(${WIDTH}, minmax(0,1fr))` }}>
        {MAZE.map((row, r) =>
          [...row].map((ch, c) => {
            const isPlayer = pos.r === r && pos.c === c;
            const isGoal = ch === 'G';
            return (
              <div
                key={`${r}-${c}`}
                className={`flex h-8 w-8 items-center justify-center sm:h-9 sm:w-9 ${
                  ch === '#'
                    ? 'rounded-md bg-candy-purple/70'
                    : isPlayer
                      ? 'animate-bounce-slow'
                      : ''
                }`}
              >
                {isPlayer ? (
                  <Rabbit size={22} className="text-candy-purple" />
                ) : isGoal ? (
                  <Star size={20} className="fill-amber-400 text-amber-400" />
                ) : (
                  ''
                )}
              </div>
            );
          })
        )}
      </div>

      {won && (
        <p className="mt-4 animate-pop-in text-center text-lg font-extrabold text-candy-green">
          Yulduzga yetding! Ajoyib!
        </p>
      )}

      <div className="mt-6 grid w-40 grid-cols-3 gap-2 mx-auto">
        <span />
        <button onClick={() => move('up')} className="rounded-2xl bg-soft-purple p-3 text-candy-purple shadow-soft transition active:scale-90" aria-label="Yuqoriga">
          <ArrowUp size={20} />
        </button>
        <span />
        <button onClick={() => move('left')} className="rounded-2xl bg-soft-purple p-3 text-candy-purple shadow-soft transition active:scale-90" aria-label="Chapga">
          <ArrowLeft size={20} />
        </button>
        <button onClick={() => move('down')} className="rounded-2xl bg-soft-purple p-3 text-candy-purple shadow-soft transition active:scale-90" aria-label="Pastga">
          <ArrowDown size={20} />
        </button>
        <button onClick={() => move('right')} className="rounded-2xl bg-soft-purple p-3 text-candy-purple shadow-soft transition active:scale-90" aria-label="O'ngga">
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}