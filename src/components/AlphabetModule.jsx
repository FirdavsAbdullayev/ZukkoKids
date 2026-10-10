import { useMemo, useState, useCallback } from 'react';
import { Volume2, Play, ArrowLeft, Languages, MessageCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sound from '../utils/sound';

const UZ_LATIN_ALPHABET = [
  'A', 'B', 'D', 'E', 'F', 'G', 'G\'', 'H', 'I', 'J', 'K',
  'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
  'X', 'Y', 'Z', 'O\'', 'CH', 'SH',
];

const LETTER_WORDS = {
  A: 'Anor', B: 'Bola', D: 'Daraxt', E: 'Eshik', F: 'Foyiz', G: 'Gul',
  "G'": "G'oz", H: 'Hovli', I: 'Ilon', J: 'Juda', K: 'Kitob',
  L: 'Limon', M: 'Maktab', N: 'Nok', O: 'Oy', P: 'Pul', Q: 'Qalam',
  R: 'Rasm', S: 'Suv', T: 'Tosh', U: 'Uy', V: 'Vatan', X: 'Xat',
  Y: 'Yulduz', Z: 'Zebra', "O'": "O'rik", CH: 'Choy', SH: 'Shakar',
};

// Pastel ranglar turli harflar uchun
const CARD_COLORS = [
  'bg-soft-yellow', 'bg-soft-sky', 'bg-soft-mint', 'bg-soft-purple', 'bg-soft-pink', 'bg-soft-orange',
];

export default function AlphabetModule() {
  const [activeLetter, setActiveLetter] = useState(null);
  const [spokenLetter, setSpokenLetter] = useState(null);
  const [supported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);

  const speak = useCallback(
    (text, rate = 0.8) => {
      if (!supported) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'uz-UZ';
      utterance.rate = rate;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    },
    [supported]
  );

  const handleSpeakLetter = useCallback(
    (letter) => {
      Sound.select();
      setActiveLetter(letter);
      setSpokenLetter(letter);
      speak(letter === "G'" ? "G'" : letter === "O'" ? "O'" : letter === 'CH' ? 'CH' : letter === 'SH' ? 'SH' : letter);
    },
    [speak]
  );

  const handleSpeakWord = (letter) => {
    const word = LETTER_WORDS[letter];
    if (!word) return;
    Sound.pop();
    setSpokenLetter(letter);
    speak(word, 0.7);
  };

  const activeWord = useMemo(() => (activeLetter ? LETTER_WORDS[activeLetter] : null), [activeLetter]);

  return (
    <section className="animate-pop-in">
      {/* Sarlavha va orqaga */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to="/"
            className="mb-2 inline-flex items-center gap-1 text-sm font-bold text-slate-400 transition hover:text-candy-purple"
            onClick={Sound.click}
          >
            <ArrowLeft size={16} /> Bosh sahifa
          </Link>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-candy-purple sm:text-3xl">
            <Languages size={28} /> Alfavit bilan tanishamiz
          </h1>
          <p className="mt-1 flex items-center gap-1 text-slate-500">
            Harfni bos — talaffuzini eshit!
            <MessageCircle size={15} className="text-purple-300" />
          </p>
        </div>
      </div>

      {/* Tanlangan harf paneli */}
      {activeLetter && (
        <div className="glass-card mb-6 flex flex-col items-center gap-4 bg-gradient-to-r from-soft-purple/70 to-soft-sky/70 p-5 text-center animate-pop-in sm:flex-row sm:gap-6 sm:p-6 sm:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white text-5xl font-extrabold text-candy-purple shadow-candy animate-wiggle sm:h-24 sm:w-24 sm:text-6xl">
            {activeLetter}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-extrabold text-slate-800 sm:text-2xl">
              {activeWord || 'Bu harfni o\'rganamiz!'}
            </h3>
            <p className="text-slate-500">
              "{activeLetter}" harfi "{activeWord}" so'zida bordir!
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              <button
                onClick={() => handleSpeakLetter(activeLetter)}
                className="btn-candy bg-candy-purple"
              >
                <Volume2 size={18} /> Harfni eshitish
              </button>
              <button
                onClick={() => handleSpeakWord(activeLetter)}
                className="btn-candy bg-candy-blue"
              >
                <Play size={18} /> So'zni eshitish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Harf grid */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-7">
          {UZ_LATIN_ALPHABET.map((letter, i) => {
            const color = CARD_COLORS[i % CARD_COLORS.length];
            const isActive = letter === activeLetter || letter === spokenLetter;
            return (
              <button
                key={letter}
                onClick={() => handleSpeakLetter(letter)}
                className={`flex aspect-square flex-col items-center justify-center rounded-2xl border-2 text-2xl font-extrabold transition-all duration-150 hover:scale-105 hover:shadow-soft sm:text-3xl ${
                  isActive
                    ? 'border-candy-purple bg-white text-candy-purple ring-4 ring-candy-purple/30'
                    : `${color} border-white/70 text-slate-700`
                }`}
                aria-label={`${letter} harfi`}
              >
                {letter}
                <span className="mt-1 hidden text-[10px] font-semibold text-slate-500 sm:block">
                  {LETTER_WORDS[letter]?.slice(0, 6)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {!supported && (
        <p className="mt-4 flex animate-shake items-center gap-2 rounded-xl bg-soft-orange/60 p-3 text-sm font-semibold text-amber-700">
          <AlertTriangle size={18} />
          Brauzeringiz ovozli talaffuzni qo'llab-quvvatlamaydi. Harflar vizual ko'rinishda.
        </p>
      )}
    </section>
  );
}