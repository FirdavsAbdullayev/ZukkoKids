import { useEffect, useRef, useState } from 'react';
import Sound from '../utils/sound';

const DURATION = 20; // soniya
const COLORS = ['text-rose-400', 'text-candy-blue', 'text-candy-green', 'text-amber-400', 'text-candy-purple'];

/** Lucide'da balon ikoni yo'q — maxsus SVG ikon (currentColor bilan rang oladi). */
function BalloonIcon({ size = 54, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="12" cy="9" rx="6" ry="7.5" fill="currentColor" />
      <path d="M12 16.3l-1.4 2.2h2.8z" fill="currentColor" />
      <path
        d="M12 18.5c0 1.8-1.6 1.9-1.6 3.6"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="9.6" cy="6.5" rx="1.5" ry="2.2" fill="#fff" fillOpacity="0.45" />
    </svg>
  );
}

function randomBalloon() {
  return {
    id: Math.random().toString(36).slice(2),
    x: 5 + Math.random() * 85,
    y: 10 + Math.random() * 60,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    drift: 0.4 + Math.random() * 0.8,
  };
}

/**
 * Balon urish: 20 soniya ichida balonlarni bosish.
 * onFinish = popped * 10 (maks 100).
 */
export default function BalloonGame({ onFinish }) {
  const [balloons, setBalloons] = useState(() => [randomBalloon(), randomBalloon()]);
  const [popped, setPopped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [over, setOver] = useState(false);
  const poppedRef = useRef(0);
  const overRef = useRef(false);

  useEffect(() => {
    const spawn = setInterval(() => {
      setBalloons((prev) => [...prev.slice(-7), randomBalloon()]);
    }, 700);
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(spawn);
          clearInterval(timer);
          setOver((was) => {
            if (!was && !overRef.current) {
              overRef.current = true;
              setTimeout(() => onFinish(Math.min(100, poppedRef.current * 10)), 300);
            }
            return true;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      clearInterval(spawn);
      clearInterval(timer);
    };
  }, [onFinish]);

  const pop = (b) => {
    if (over) return;
    Sound.pop();
    poppedRef.current += 1;
    setPopped(poppedRef.current);
    setBalloons((prev) => prev.filter((x) => x.id !== b.id));
  };

  return (
    <div>
      <p className="mb-3 text-center font-semibold text-slate-500">
        {timeLeft} soniya ichida imkon qadar ko'p balonni ur!
      </p>
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="pill bg-soft-sky text-candy-blue">
          ⏱ {timeLeft}s
        </span>
        <span className="pill bg-soft-yellow text-amber-700">
          <BalloonIcon size={16} className="text-amber-600" /> {popped}
        </span>
      </div>

      <div
        className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-3xl border-2 border-soft-purple bg-gradient-to-b from-soft-sky/50 to-soft-mint/40"
        onContextMenu={(e) => e.preventDefault()}
      >
        {balloons.map((b) => (
          <button
            key={b.id}
            onClick={() => pop(b)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 select-none transition-transform duration-500 ${b.color}`}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              animation: `float 2.5s ease-in-out infinite`,
              animationDelay: `${b.drift}s`,
            }}
          >
            <BalloonIcon size={56} />
          </button>
        ))}
        {timeLeft === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <p className="animate-pop-in text-2xl font-extrabold text-candy-purple">
              Vaqt tugadi! {popped} ta balon
            </p>
          </div>
        )}
      </div>
      <p className="mt-4 text-center text-sm font-bold text-slate-400">Balonni bosing va ushlamang — ular uchib ketadi!</p>
    </div>
  );
}