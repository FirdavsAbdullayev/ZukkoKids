import {
  Rocket, Star, Ghost, Crown, Flower2, Bird, Rainbow, Smile, PawPrint,
} from 'lucide-react';

/**
 * Avatar variantlari: emoji o'rniga yorqin gradiyent + Lucide ikon.
 * avatar_url sifatida ikonning kaliti saqlanadi.
 */
export const AVATAR_OPTIONS = [
  { key: 'rocket', Icon: Rocket, gradient: 'from-candy-purple to-purple-400', label: 'Raketa' },
  { key: 'star', Icon: Star, gradient: 'from-amber-400 to-orange-400', label: 'Yulduz' },
  { key: 'ghost', Icon: Ghost, gradient: 'from-slate-400 to-slate-500', label: 'Arvoh' },
  { key: 'crown', Icon: Crown, gradient: 'from-yellow-400 to-amber-500', label: 'Toj' },
  { key: 'flower', Icon: Flower2, gradient: 'from-pink-400 to-rose-400', label: 'Gul' },
  { key: 'bird', Icon: Bird, gradient: 'from-sky-400 to-cyan-400', label: 'Qush' },
  { key: 'rainbow', Icon: Rainbow, gradient: 'from-fuchsia-400 to-purple-400', label: 'Kamalak' },
  { key: 'smile', Icon: Smile, gradient: 'from-green-400 to-emerald-400', label: 'Tabassum' },
  { key: 'paw', Icon: PawPrint, gradient: 'from-orange-400 to-amber-600', label: 'Panja' },
];

const AVATAR_MAP = Object.fromEntries(AVATAR_OPTIONS.map((a) => [a.key, a]));
const DEFAULT = AVATAR_OPTIONS[0];

/**
 * Berilgan kalit bo'yicha avatar ikonini ko'rsatadi.
 * Noma'lum kalit (eski emoji avatar) bo'lsa, default raketa ko'rsatiladi.
 */
export default function Avatar({ url, size = 44, className = '' }) {
  const avatar = AVATAR_MAP[url] || DEFAULT;
  const Icon = avatar.Icon;

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-soft ${avatar.gradient} ${className}`}
      style={{ width: size, height: size }}
      aria-label={avatar.label}
    >
      <Icon size={size * 0.55} className="drop-shadow" />
    </div>
  );
}