import { useEffect, useRef } from 'react';

const COLORS = ['#7B2CBF', '#F72585', '#FF8500', '#FFD166', '#2DC653', '#4361EE', '#00B4D8'];

/**
 * Canvas asosidagi konfetti portlash animatsiyasi.
 * `fire` prop'i o'zgarganda (raqamli trigger) partiyalangan rangli konfetilar uchadi.
 */
export default function Confetti({ fire, maxPieces = 160 }) {
  const canvasRef = useRef(null);
  const piecesRef = useRef([]);
  const rafRef = useRef(null);
  const lastFireRef = useRef(null);

  useEffect(() => {
    if (fire == null || fire === lastFireRef.current) return;
    lastFireRef.current = fire;
    startBurst();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fire]);

  const startBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = rect.width / 2;
    const cy = rect.height / 3;
    const count = Math.min(maxPieces, Math.floor(rect.width / 4));

    piecesRef.current = Array.from({ length: count }, () => ({
      x: cx,
      y: cy,
      vx: (Math.random() - 0.5) * 18,
      vy: -Math.random() * 16 - 4,
      gravity: 0.35 + Math.random() * 0.2,
      size: 5 + Math.random() * 7,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }));

    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const duration = 2600;

    const tick = (now) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, rect.width, rect.height);
      const active = [];

      piecesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rot += p.vr;
        p.vx *= 0.99;

        if (p.y > rect.height + 20) return;
        active.push(p);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      piecesRef.current = active;

      if (elapsed < duration && active.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}