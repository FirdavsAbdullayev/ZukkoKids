import { useMemo } from 'react';
import { Circle, Square, Triangle, Star, Sparkles } from 'lucide-react';

const SHAPES = [
  { Icon: Sparkles, color: 'text-candy-purple', size: 26, delay: 0, top: '6%', left: '4%', duration: 6 },
  { Icon: Star, color: 'text-amber-400', size: 22, delay: 1.2, top: '14%', left: '88%', duration: 5 },
  { Icon: Circle, color: 'text-candy-blue', size: 20, delay: 0.6, top: '78%', left: '8%', duration: 7 },
  { Icon: Triangle, color: 'text-candy-pink', size: 24, delay: 2, top: '85%', left: '86%', duration: 6.5 },
  { Icon: Sparkles, color: 'text-candy-green', size: 20, delay: 1.6, top: '40%', left: '94%', duration: 5.5 },
  { Icon: Square, color: 'text-candy-orange', size: 20, delay: 0.3, top: '55%', left: '2%', duration: 8 },
  { Icon: Star, color: 'text-purple-300', size: 18, delay: 2.4, top: '30%', left: '90%', duration: 7 },
  { Icon: Circle, color: 'text-pink-300', size: 18, delay: 0.9, top: '66%', left: '95%', duration: 6 },
];

/**
 * Sahifa fonida sekin suzib yuruvchi yorqin shakllar (dekoratsiya).
 */
export default function FloatingShapes() {
  const shapes = useMemo(() => SHAPES, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {shapes.map((s, i) => {
        const Icon = s.Icon;
        return (
          <div
            key={i}
            className="absolute animate-float-soft opacity-40"
            style={{
              top: s.top,
              left: s.left,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          >
            <Icon size={s.size} className={s.color} />
          </div>
        );
      })}
    </div>
  );
}