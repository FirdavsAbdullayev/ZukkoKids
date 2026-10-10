import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Eraser, RotateCcw, Download, ArrowLeft, Palette, Pencil, Paintbrush, Undo2,
} from 'lucide-react';
import Sound from '../utils/sound';

const COLORS = [
  '#7B2CBF', '#4361EE', '#2DC653', '#F72585', '#FF8500', '#3A0CA3', '#00B4D8',
];

export default function DrawingCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(10);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const lastPoint = useRef(null);
  const strokesRef = useRef([]); // har bir zarba oldidan snippet saqlanadi
  const hasDrawnRef = useRef(false);

  const snapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL();
  }, []);

  // Canvas o'lchamini moslash (chizim yo'qolmasligi uchun)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.min(rect.width, 720));
      const h = Math.max(1, Math.min(rect.width * 0.6, 450));
      const nextW = Math.round(w * dpr);
      const nextH = Math.round(h * dpr);
      if (canvas.width === nextW && canvas.height === nextH) return;

      // canvas.width/height o'zgarsa, canvas to'liq tozalanadi — avval saqlaymiz
      const prev = hasDrawnRef.current && canvas.width > 0 ? canvas.toDataURL() : null;

      canvas.width = nextW;
      canvas.height = nextH;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (prev) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, w, h);
        };
        img.src = prev;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setIsDrawing(true);
    lastPoint.current = getPoint(e);
    // Zarbadan oldin holatni snippet (undo uchun) saqlaymiz
    strokesRef.current.push(snapshot());
    setCanUndo(true);
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const point = getPoint(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    hasDrawnRef.current = true;
    setHasDrawn(true);
    lastPoint.current = point;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPoint.current = null;
  };

  const clearCanvas = () => {
    Sound.click();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    strokesRef.current = [];
    hasDrawnRef.current = false;
    setHasDrawn(false);
    setCanUndo(false);
  };

  const undo = () => {
    const prev = strokesRef.current.pop();
    const canvas = canvasRef.current;
    if (!canvas || !prev) {
      setCanUndo(strokesRef.current.length > 0);
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      // Snippet piksel o'lchamida saqlangan — dpr ko'paytmasdan chizish kerak,
      // aks holda ekran dpr > 1 bo'lsa rasm har safar kattalashib borardi.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      hasDrawnRef.current = strokesRef.current.length > 0;
      setHasDrawn(strokesRef.current.length > 0);
    };
    img.src = prev;
    setCanUndo(strokesRef.current.length > 0);
    Sound.click();
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    Sound.coin();
    const link = document.createElement('a');
    link.download = 'zukkokids-chizma.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <section className="animate-pop-in">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-bold text-slate-400 transition hover:text-candy-pink"
        onClick={Sound.click}
      >
        <ArrowLeft size={16} /> Bosh sahifa
      </Link>
      <h1 className="mb-1 mt-1 flex items-center gap-2 text-2xl font-extrabold text-candy-pink sm:text-3xl">
        <Paintbrush size={28} /> Chizish maydoni
      </h1>
      <p className="mb-6 text-slate-500">
        Barmog'ing yoki sichqoncha bilan harf va raqamlar chizib ko'rish!
      </p>

      <div className="glass-card flex flex-col items-center gap-5 p-6">
        {/* Ranglar va asboblar */}
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Palette size={18} className="text-slate-400" />
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  Sound.select();
                  setColor(c);
                }}
                className={`h-9 w-9 rounded-full ring-2 transition hover:scale-110 ${
                  color === c ? 'ring-candy-purple scale-110 animate-pop-in' : 'ring-white'
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Rang ${c}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Pencil size={18} className="text-slate-400" />
            <input
              type="range"
              min={3}
              max={30}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-28"
              aria-label="Qalam qalinligi"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="btn-candy bg-candy-blue disabled:opacity-40"
              title="Oxirgi zarbani qaytarish"
            >
              <Undo2 size={18} />
            </button>
            <button
              onClick={clearCanvas}
              className="btn-candy bg-slate-400"
              title="Tozalash"
            >
              <Eraser size={18} /> Toza
            </button>
            <button
              onClick={downloadImage}
              disabled={!hasDrawn}
              className="btn-candy bg-candy-green disabled:opacity-50"
              title="Rasmni saqlash"
            >
              <Download size={18} /> Saqla
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="w-full overflow-hidden rounded-2xl border-4 border-dashed border-soft-purple shadow-soft">
          <canvas
            ref={canvasRef}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
            className="block touch-none"
          />
        </div>

        <p className="flex items-center gap-1.5 text-sm text-slate-400">
          <Pencil size={14} className="text-candy-pink" /> Maslahat: katta harflarni chizishni
          avval mashq qiling!
        </p>
      </div>
    </section>
  );
}