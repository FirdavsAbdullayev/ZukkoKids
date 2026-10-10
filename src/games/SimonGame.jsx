import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import Sound from '../utils/sound';

const PADS = [
  { id: 0, color: 'bg-candy-green', glow: 'shadow-glow-green', label: 'Yashil' },
  { id: 1, color: 'bg-candy-blue', glow: 'bg-candy-blue/60', label: 'Ko\'k' },
  { id: 2, color: 'bg-candy-pink', glow: 'bg-candy-pink/60', label: 'Pushti' },
  { id: 3, color: 'bg-amber-400', glow: 'bg-amber-400/60', label: 'Sariq' },
];

/**
 * Simon: ranglar ketma-ketligini takrorlash.
 * Noto'g'ri bosilganda tugaydi. onFinish = (nechta raund} )*20, maks 100.
 */
export default function SimonGame({ onFinish }) {
  const [seq, setSeq] = useState([]);
  const [inputIdx, setInputIdx] = useState(0);
  const [light, setLight] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | showing | input
  const seqRef = useRef([]);
  const startedRef = useRef(false);

  useEffect(() => {
    // Boshlovchi: birinchi raundni avtomatik boshlaymiz.
    // StrictMode ikki marta chaqirmasligi uchun ref guard.
    if (startedRef.current) return;
    startedRef.current = true;
    startRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== 'showing') return;
    const copy = seqRef.current;
    let i = 0;
    const interval = setInterval(() => {
      setLight(copy[i]);
      Sound.select();
      i += 1;
      if (i >= copy.length) {
        clearInterval(interval);
        setTimeout(() => {
          setLight(null);
          setPhase('input');
          setInputIdx(0);
        }, 500);
      } else {
        setTimeout(() => setLight(null), 350);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [phase]);

  const startRound = () => {
    const newSeqVal = Math.floor(Math.random() * 4);
    const next = [...seqRef.current, newSeqVal];
    seqRef.current = next;
    setSeq(next);
    setPhase('showing');
  };

  const press = (padId) => {
    if (phase !== 'input') return;
    setLight(padId);
    setTimeout(() => setLight(null), 200);
    const expected = seq[inputIdx];
    if (padId !== expected) {
      Sound.error();
      const score = Math.min(100, Math.max(20, seq.length * 20 - 20));
      setTimeout(() => onFinish(score), 500);
      return;
    }
    Sound.answer(true);
    const nextIdx = inputIdx + 1;
    if (nextIdx >= seq.length) {
      const roundScore = Math.min(100, seq.length * 20);
      if (roundScore >= 100) {
        setTimeout(() => onFinish(100), 400);
        return;
      }
      setTimeout(() => startRound(), 700);
    } else {
      setInputIdx(nextIdx);
    }
  };

  return (
    <div>
      <p className="mb-4 text-center font-semibold text-slate-500">
        Ranglar tartibini eslab qol va takrorla!
      </p>
      <div className="mx-auto grid w-fit grid-cols-2 gap-3">
        {PADS.map((pad) => (
          <button
            key={pad.id}
            onClick={() => press(pad.id)}
            className={`flex h-28 w-28 items-center justify-center rounded-3xl text-2xl font-extrabold text-white/80 shadow-candy transition active:scale-90 sm:h-32 sm:w-32 ${
              light === pad.id ? `${pad.color} ${pad.glow} scale-95` : `${pad.color} opacity-80 hover:opacity-100`
            }`}
          >
            {light === pad.id ? <Sparkles size={30} /> : ''}
          </button>
        ))}
      </div>
      <p className="mt-5 text-center text-sm font-bold text-slate-400">
        {phase === 'input' ? `Takrorla: ${seq.length} qadam` : phase === 'showing' ? 'Eslab qol...' : 'Boshlash...'}
      </p>
    </div>
  );
}