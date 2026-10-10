import { useEffect, useMemo, useState } from 'react';
import Sound from '../utils/sound';

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function bestMove(board) {
  const empty = board.map((v, i) => (v ? null : i)).filter((i) => i !== null);
  if (empty.length === 0) return null;

  const own = (m) => m === 'O';
  // 1) g'alaba yozish
  for (const [a, b, c] of LINES) {
    const cells = [board[a], board[b], board[c]];
    if (cells.filter((v) => own(v)).length === 2 && cells.filter((v) => v === null).length === 1) {
      const idx = [a, b, c].find((i) => board[i] === null);
      if (idx !== undefined) return idx;
    }
  }
  // 2) raqibni bloklash
  for (const [a, b, c] of LINES) {
    const cells = [board[a], board[b], board[c]];
    if (cells.filter((v) => v === 'X').length === 2 && cells.filter((v) => v === null).length === 1) {
      const idx = [a, b, c].find((i) => board[i] === null);
      if (idx !== undefined) return idx;
    }
  }
  // 3) markazni olish
  if (board[4] === null) return 4;
  // 4) tasodifiy bo'sh katak
  return empty[Math.floor(Math.random() * empty.length)];
}

/**
 * Triq: kompyuterga qarshi (oddiy AI).
 * G'alaba 100, durang 60, mag'lubiyat 20.
 */
export default function TicTacToeGame({ onFinish }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [status, setStatus] = useState('play'); // play | over

  const ended = useMemo(() => status === 'over', [status]);

  useEffect(() => {
    if (status === 'over') return;
    const w = winner(board);
    if (w) {
      setStatus('over');
      Sound.fanfare();
      setTimeout(() => onFinish(w === 'X' ? 100 : 20), 600);
      return;
    }
    if (!board.includes(null)) {
      setStatus('over');
      Sound.pop();
      setTimeout(() => onFinish(60), 600);
      return;
    }
    // AI navbati (O) — X birinchi o'ynaydi, X tugmani bosgach AI bir zumda javob beradi
    const xCount = board.filter((v) => v === 'X').length;
    const oCount = board.filter((v) => v === 'O').length;
    if (xCount > oCount) {
      const move = bestMove(board);
      if (move !== null) {
        const t = setTimeout(() => {
          setBoard((b) => {
            const nb = [...b];
            nb[move] = 'O';
            return nb;
          });
        }, 350);
        return () => clearTimeout(t);
      }
    }
  }, [board, status, onFinish]);

  const play = (i) => {
    if (ended || board[i]) return;
    const copy = [...board];
    copy[i] = 'X';
    Sound.select();
    setBoard(copy);
  };

  return (
    <div>
      <p className="mb-4 text-center font-semibold text-slate-500">
        Siz “X” bilan o'ynaysiz, kompyuter “O” bilan. Qator hosil qil!
      </p>
      <div className="mx-auto grid w-fit grid-cols-3 gap-2.5">
        {board.map((v, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            disabled={!!v || ended}
            className={`flex h-20 w-20 items-center justify-center rounded-2xl border-2 bg-white text-4xl font-extrabold shadow-soft transition active:scale-90 sm:h-24 sm:w-24 ${
              v === 'X'
                ? 'border-candy-blue text-candy-blue'
                : v === 'O'
                  ? 'border-candy-pink text-candy-pink'
                  : 'border-soft-purple text-transparent hover:scale-105 hover:border-candy-purple'
            }`}
          >
            {v || '·'}
          </button>
        ))}
      </div>
      <p className="mt-5 text-center text-sm font-bold text-slate-400">
        {ended ? "O'yin tugadi" : 'Navbat: Siz (X)'}
      </p>
    </div>
  );
}