import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Coins, Star, Trophy, CheckCircle2, RotateCcw, Languages, Hash, Globe2,
  Atom, BookOpen, Lightbulb, PartyPopper, Medal, Heart,
} from 'lucide-react';
import { listLessons, completeLesson } from '../services/api';
import { useUser } from '../hooks/useUser';
import useStreak from '../hooks/useStreak';
import Sound from '../utils/sound';
import Confetti from '../components/Confetti';

const CATEGORIES = [
  { key: 'alphabet', label: 'Alifbo', Icon: Languages, color: 'border-candy-purple', bg: 'bg-soft-purple/40' },
  { key: 'numbers', label: 'Raqamlar', Icon: Hash, color: 'border-candy-blue', bg: 'bg-soft-sky/40' },
  { key: 'english', label: 'Ingliz tili', Icon: Globe2, color: 'border-candy-pink', bg: 'bg-soft-pink/40' },
  { key: 'stem', label: 'STEM', Icon: Atom, color: 'border-candy-green', bg: 'bg-soft-mint/40' },
];

// Interaktiv mini-quz
const MINI_QUIZ = {
  alphabet: [
    { q: '"A" harfi qaysi so\'zda bor?', options: ['Anor', 'Bola', 'Kitob', 'Suv'], answer: 0 },
    { q: '"B" harfi qaysi so\'zda bor?', options: ['Olma', 'Bola', 'Tosh', 'Gul'], answer: 1 },
    { q: '"K" harfi qaysi so\'zda bor?', options: ['Olma', 'Bola', 'Kitob', 'Suv'], answer: 2 },
  ],
  numbers: [
    { q: '2 + 3 nechiga teng?', options: ['3', '4', '5', '6'], answer: 2 },
    { q: '10 - 4 nechiga teng?', options: ['5', '6', '7', '8'], answer: 1 },
    { q: '5 + 5 nechiga teng?', options: ['9', '10', '11', '12'], answer: 1 },
  ],
  english: [
    { q: '"Do\'st" inglizchada qanday?', options: ['Friend', 'Mother', 'School', 'Apple'], answer: 0 },
    { q: '"Suv" inglizchada qanday?', options: ['Milk', 'Water', 'Juice', 'Tea'], answer: 1 },
    { q: '"Mushuk" inglizchada qanday?', options: ['Dog', 'Cat', 'Bird', 'Fish'], answer: 1 },
  ],
  stem: [
    { q: 'Qaysi biri sayyora?', options: ['Merkuriy', 'Yulduz', 'Oy', 'Quyosh'], answer: 0 },
    { q: 'Uchburchak nechta burchagiga ega?', options: ['2', '3', '4', '5'], answer: 1 },
    { q: 'Qaysi biri eng katta?', options: ['Kichik', 'O\'rta', 'Katta', 'Juda kichik'], answer: 2 },
  ],
};

const LESSON_SEEDS = {
  alphabet: ['A va B harflari bilan tanishuv', 'Alifbo bo\'ylab sayohat', 'Harflar olami'],
  numbers: ['1 dan 10 gacha sanash', 'Raqamlar bilan ma\'no', 'Qo\'shishni o\'rganamiz'],
  english: ['Ilk inglizcha so\'zlar', 'Ranglar inglizchada', 'Hayvonlar olami'],
  stem: ['Asosiy shakllar', 'Sayyoralar tabiati', 'Ob-havo va fasllar'],
};

export default function LessonsPage() {
  const { user, setUser } = useUser();
  const { markStudyDay } = useStreak();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('alphabet');
  const [activeLesson, setActiveLesson] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confettiFire, setConfettiFire] = useState(null);
  const startedAtRef = useRef(null);

  const loadLessons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listLessons();
      setData(res);
    } catch {
      setError("Darslarni yuklab bo'lmadi. Backend ishga tushganini tekshiring.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  const categoryLessons = data?.grouped?.[activeCategory] || [];

  const startLesson = (lesson) => {
    Sound.select();
    const quiz = MINI_QUIZ[activeCategory] || MINI_QUIZ.alphabet;
    startedAtRef.current = Date.now();
    setActiveLesson(lesson);
    setAnswers(Array(quiz.length).fill(null));
    setResult(null);
    setError('');
  };

  const answerQuestion = (index, value) => {
    const quiz = MINI_QUIZ[activeCategory] || MINI_QUIZ.alphabet;
    const correct = quiz[index].answer === value;
    Sound.answer(correct);
    setAnswers((a) => {
      const next = [...a];
      next[index] = value;
      return next;
    });
  };

  const finishLesson = async () => {
    if (submitting) return;
    const quiz = MINI_QUIZ[activeCategory] || MINI_QUIZ.alphabet;
    const correct = quiz.filter((q, i) => answers[i] === q.answer).length;
    const score = Math.round((correct / quiz.length) * 100);

    setError('');
    setSubmitting(true);
    try {
      const timeSpent = startedAtRef.current
        ? Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000))
        : 60;
      const res = await completeLesson({
        user_id: user.id,
        lesson_id: activeLesson.id,
        score,
        time_spent_seconds: timeSpent,
      });
      setResult({ ...res, score });
      // Balansni yangilash
      if (res.data) {
        setUser((u) => ({
          ...u,
          coins_balance: res.data.coins_balance,
          stars_count: res.data.stars_count,
        }));
      }
      markStudyDay();
      if (res.already_completed) {
        Sound.pop();
      } else if (score >= 70) {
        Sound.fanfare();
        setConfettiFire((f) => (f || 0) + 1);
      } else {
        Sound.success();
      }
    } catch (err) {
      Sound.error();
      const message =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        'Backendga bog\'lanib bo\'lmadi. Backend (`npm run dev`) ishga tushganini va bazaga ulanganini tekshiring.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const retryLesson = () => {
    Sound.click();
    startedAtRef.current = Date.now();
    setAnswers(Array((MINI_QUIZ[activeCategory] || MINI_QUIZ.alphabet).length).fill(null));
    setResult(null);
    setError('');
  };

  // ---- Quiz ko'rinishi ----
  if (activeLesson) {
    const quiz = MINI_QUIZ[activeCategory] || MINI_QUIZ.alphabet;
    const allAnswered = answers.every((a) => a !== null);
    const answeredCount = answers.filter((a) => a !== null).length;

    return (
      <section className="relative animate-pop-in">
        <Confetti fire={confettiFire} />

        <button
          onClick={() => {
            Sound.click();
            setActiveLesson(null);
          }}
          className="mb-2 inline-flex items-center gap-1 text-sm font-bold text-slate-400 transition hover:text-candy-purple"
        >
          <ArrowLeft size={16} /> Darslarga qaytish
        </button>
        <h1 className="mb-1 text-2xl font-extrabold text-candy-purple">{activeLesson.title}</h1>
        <p className="mb-6 flex items-center gap-1.5 text-slate-500">
          Mukofot:{' '}
          <span className="inline-flex items-center gap-1 font-bold text-amber-500">
            <Coins size={16} />
            {activeLesson.rewards_coins}
          </span>
        </p>

        <div className="glass-card space-y-5 p-4 sm:p-6">
          {quiz.map((q, i) => (
            <div key={i}>
              <p className="mb-2 text-lg font-bold text-slate-700">
                {i + 1}. {q.q}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => answerQuestion(i, oi)}
                    className={`rounded-2xl border-2 p-3 text-base font-bold transition active:translate-y-0.5 sm:p-4 sm:text-lg ${
                      answers[i] === oi
                        ? 'border-candy-purple bg-soft-purple/50 text-candy-purple shadow-soft'
                        : 'border-white bg-white text-slate-600 hover:scale-[1.02] hover:border-soft-purple'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Progress: savollar */}
          <div className="flex items-center gap-1.5">
            {quiz.map((_, i) => (
              <span
                key={i}
                className={`h-2.5 flex-1 rounded-full transition-colors duration-300 ${
                  answers[i] !== null ? 'bg-candy-green' : 'bg-slate-200'
                }`}
              />
            ))}
            <span className="pl-2 text-xs font-bold text-slate-400">
              {answeredCount}/{quiz.length}
            </span>
          </div>

          {error && (
            <p className="animate-shake rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          {!result ? (
            <button
              onClick={finishLesson}
              disabled={!allAnswered || submitting}
              className="btn-candy btn-glow w-full bg-candy-green text-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trophy size={20} />
              {submitting ? (
                <>
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-[3px] border-white/40 border-t-white" />
                  Yakunlanmoqda...
                </>
              ) : !allAnswered ? (
                `Barcha savollarni javoblang (${answeredCount}/${quiz.length})`
              ) : (
                'Darsni yakunlash'
              )}
            </button>
          ) : (
            <div className="rounded-2xl bg-soft-yellow/60 p-5 text-center animate-pop-in-long">
              {!result.already_completed && result.score >= 70 && (
                <p className="mx-auto -mt-10 mb-2 w-fit rounded-full bg-white px-4 py-2 text-sm font-extrabold text-candy-purple shadow-candy animate-tada">
                  <PartyPopper size={16} className="inline" /> Super!
                </p>
              )}
              <p className="text-2xl font-extrabold text-amber-700">
                {result.score >= 70 ? 'Ajoyib natija!' : result.score >= 50 ? 'Yaxshi urinish!' : 'Davom eting!'}
              </p>
              <p className="mt-1 font-bold text-slate-600">
                <Medal size={18} className="inline text-amber-500" /> Natija: {result.score} ball
              </p>
              {result.already_completed ? (
                <p className="mt-2 text-slate-500">Bu dars avval tugatilgan edi.</p>
              ) : (
                <p className="mt-2 flex items-center justify-center gap-2 font-bold text-amber-700">
                  <span className="inline-flex items-center gap-1">
                    <Coins size={16} /> +{result.data?.earned_coins}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star size={16} className="fill-purple-500 text-purple-500" /> +{result.data?.earned_stars}
                  </span>
                </p>
              )}
              <div className="mt-4 flex justify-center gap-2">
                <button onClick={retryLesson} className="btn-candy bg-candy-blue">
                  <RotateCcw size={16} /> Qayta urinish
                </button>
                <button
                  onClick={() => {
                    setActiveLesson(null);
                    loadLessons();
                  }}
                  className="btn-candy bg-candy-purple"
                >
                  <CheckCircle2 size={16} /> Ro'yxatga qaytish
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ---- Darslar ro'yxati ----
  return (
    <section className="animate-pop-in">
      <Link
        to="/"
        className="mb-2 inline-flex items-center gap-1 text-sm font-bold text-slate-400 transition hover:text-candy-blue"
        onClick={Sound.click}
      >
        <ArrowLeft size={16} /> Bosh sahifa
      </Link>
      <h1 className="flex items-center gap-2 text-2xl font-extrabold text-candy-blue sm:text-3xl">
        <BookOpen size={28} /> Darslar kutubxonasi
      </h1>
      <p className="mb-6 text-slate-500">Kategoriya tanla va darsni boshlash!</p>

      {error && !data && (
        <p className="mb-4 animate-shake rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-500">
          {error}
        </p>
      )}

      {/* Kategoriya tablar */}
      <div className="-mx-3 mb-6 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              Sound.select();
              setActiveCategory(cat.key);
            }}
            className={`inline-flex shrink-0 items-center gap-2 rounded-2xl border-b-4 px-3.5 py-2 text-base font-extrabold transition sm:px-5 sm:py-3 sm:text-lg ${
              activeCategory === cat.key
                ? `${cat.bg} ${cat.color} text-slate-800`
                : 'border-transparent bg-white/70 text-slate-400 hover:text-slate-600'
            }`}
          >
            <cat.Icon size={20} /> {cat.label}
          </button>
        ))}
      </div>

      {/* Darslar grid */}
      {loading ? (
        <div className="glass-card flex items-center justify-center p-8 text-slate-400">
          <Heart size={20} className="animate-pulse text-pink-400" /> Darslar yuklanmoqda...
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(categoryLessons.length ? categoryLessons : LESSON_SEEDS[activeCategory] || []).map(
            (lesson, i) => {
              const isSeed = lesson.title && !lesson.id;
              const displayLesson = lesson.id ? lesson : { ...lesson, id: `seed-${i}` };
              const cat = CATEGORIES.find((c) => c.key === activeCategory);
              return (
                <button
                  key={displayLesson.title}
                  onClick={() => {
                    if (isSeed) return;
                    startLesson(lesson);
                  }}
                  className={`play-card glass-card group animate-stagger ${cat?.bg}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div
                      className={`rounded-2xl bg-gradient-to-br p-2.5 text-white shadow-soft transition group-hover:scale-110 ${
                        cat?.key === 'alphabet'
                          ? 'from-candy-purple to-purple-400'
                          : cat?.key === 'numbers'
                            ? 'from-candy-blue to-sky-400'
                            : cat?.key === 'english'
                              ? 'from-candy-pink to-rose-400'
                              : 'from-candy-green to-emerald-400'
                      }`}
                    >
                      {cat && <cat.Icon size={22} />}
                    </div>
                    <span className="pill bg-soft-yellow text-amber-700">
                      <Coins size={14} /> {lesson.rewards_coins}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800">{lesson.title}</h3>
                  <p className="mt-2 text-sm font-bold text-candy-purple transition group-hover:tracking-wide">
                    {isSeed ? "Serverda yo'q — seed qiling" : 'Darsni boshlash'}
                    <span className="inline-flex opacity-0 transition group-hover:ml-1 group-hover:opacity-100">
                      <ArrowRight size={16} />
                    </span>
                  </p>
                </button>
              );
            }
          )}
        </div>
      )}

      <div className="glass-card mt-6 flex items-center gap-3 bg-soft-mint/50 p-4">
        <Lightbulb size={20} className="shrink-0 text-amber-400" />
        <p className="text-sm text-slate-600">
          <b>Maslahat:</b> Serverda <code className="rounded bg-white px-1">npm run db:seed</code>{' '}
          ishga tushirilsa, barcha darslar avtomatik paydo bo'ladi! Tanga va yulduzlar har bir
          dars tugagach beriladi.
        </p>
      </div>
    </section>
  );
}