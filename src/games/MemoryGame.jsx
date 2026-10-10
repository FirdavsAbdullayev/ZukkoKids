import { useEffect, useRef, useState } from 'react';
import {
  Apple, Dog, Rocket, Star, Cake, Rainbow, Cat, Pizza, Bird, Music, Flower2, Fish, Sparkles,
} from 'lucide-react';
import Sound from '../utils/sound';

const POOL = [
  { key: 'apple', Icon: Apple, color: 'text-rose-500' },
  { key: 'dog', Icon: Dog, color: 'text-amber-600' },
  { key: 'rocket', Icon: Rocket, color: 'text-candy-purple' },
  { key: 'star', Icon: Star, color: 'text-amber-400' },
  { key: 'cake', Icon: Cake, color: 'text-candy-pink' },
  { key: 'rainbow', Icon: Rainbow, color: 'text-fuchsia-500' },
  { key: 'cat', Icon: Cat, color: 'text-orange-500' },
  { key: 'pizza', Icon: Pizza, color: 'text-amber-500' },
  { key: 'bird', Icon: Bird, color: 'text-sky-500' },
  { key: 'music', Icon: Music, color: 'text-candy-blue' },
  { key: 'flower', Icon: Flower2, color: 'text-pink-500' },
  { key: 'fish', Icon: Fish, color: 'text-cyan-500' },
];

function buildDeck() {
  const chosen = [...POOL].sort(() => Math.random() - 0.5).slice(0, 6);
  const deck = [...chosen, ...chosen]
    .map((item, i) => ({ id: i, ...item }))
    .sort(() => Math.random() - 0.5);
  return deck;
}

/**
 * Xotira kartalari: 6 juft ikonni topish.
 * OnFinish: barcha juftlar topilganda 100 - (urilgan urinishlar - 6) * 5.
 */
export default function MemoryGame({ onFinish }) {
  const [deck, setDeck] = useState(buildDeck);
  const [flipped, setFlipped] = useState([]); // hozir ochiq kartalar id'si
  const [matched, setMatched] = useState(new Set());
  const [lock, setLock] = useState(false);
  const attemptsRef = useRef(0);
  const doneRef = useRef(false);

  const tryFinish = (matchedSet) => {
    if (matchedSet.size === 6 && !doneRef.current) {
      doneRef.current = true;
      const attempts = attemptsRef.current;
      const score = Math.max(50, Math.min(100, 100 - (attempts - 6) * 5));
      setTimeout(() => onFinish(score), 400);
    }
  };

  useEffect(() => {
    tryFinish(matched);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  const flip = (card) => {
    if (lock || flipped.length >= 2 || matched.has(card.id) || flipped.includes(card.id)) return;
    const next = [...flipped, card.id];
    setFlipped(next);
    Sound.select();

    if (next.length === 2) {
      const [a, b] = next.map((id) => deck.find((c) => c.id === id));
      attemptsRef.current += 1;
      if (a.key === b.key) {
        Sound.answer(true);
        const newMatched = new Set(matched);
        newMatched.add(a.id);
        newMatched.add(b.id);
        setLock(true);
        setTimeout(() => {
          setMatched(newMatched);
          setFlipped([]);
          setLock(false);
          tryFinish(newMatched);
        }, 350);
      } else {
        Sound.answer(false);
        setLock(true);
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 750);
      }
    }
  };

  return (
    <div>
      <p className="mb-4 text-center font-semibold text-slate-500">
        Juft kartalarni toping — hammasi ochilganda o'yin tugaydi!
      </p>
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2.5 sm:gap-3">
        {deck.map((card) => {
          const isUp = flipped.includes(card.id) || matched.has(card.id);
          const isMatched = matched.has(card.id);
          const Card = card.Icon;
          return (
            <button
              key={card.id}
              onClick={() => flip(card)}
              className={`flex aspect-square items-center justify-center rounded-2xl border-2 transition-all duration-200 ${
                isMatched
                  ? 'border-candy-green bg-soft-mint shadow-candy'
                  : isUp
                    ? 'border-candy-blue bg-white shadow-candy'
                    : 'border-white/70 bg-gradient-to-br from-candy-purple to-purple-400 shadow-soft hover:scale-105 active:scale-95'
              }`}
            >
              {isUp ? (
                <Card size={34} className={card.color} />
              ) : (
                <Sparkles size={26} className="text-white/70" />
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-5 text-center text-sm font-bold text-slate-400">
        Topilgan juft: {matched.size / 2} / 6
      </p>
    </div>
  );
}