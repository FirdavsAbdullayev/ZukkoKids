import { useMemo, useState } from 'react';
import Sound from '../utils/sound';

const TOTAL = 6;

function makeQuestion() {
  const a = 1 + Math.floor(Math.random() * 9);
  const b = 1 + Math.floor(Math.random() * 9);
  const useMinus = Math.random() < 0.4;
  let first;
  let second;
  let operand;
  let answerValue;
  if (useMinus) {
    first = a + b;
    second = a;
    operand = '-';
    answerValue = first - second;
  } else {
    first = a;
    second = b;
    operand = '+';
    answerValue = first + second;
  }
  const opts = new Set([answerValue]);
  while (opts.size < 4) {
    let cand = answerValue + (Math.floor(Math.random() * 9) - 4);
    if (cand < 0) cand = 0;
    opts.add(cand);
  }
  return {
    text: `${first} ${operand} ${second} = ?`,
    answer: answerValue,
    options: [...opts].sort(() => Math.random() - 0.5),
  };
}

/**
 * Raqamlar ovi: 6 ta misol, onFinish = to'g'ri javoblar / 6 * 100.
 */
export default function NumberHuntGame({ onFinish }) {
  const [qIndex, setQIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const questions = useMemo(() => Array.from({ length: TOTAL }, makeQuestion), []);
  const q = questions[qIndex];

  const pick = (val) => {
    if (picked !== null) return;
    setPicked(val);
    if (val === q.answer) {
      Sound.answer(true);
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setFeedback('right');
      setTimeout(() => goNext(newCorrect), 450);
    } else {
      Sound.answer(false);
      setFeedback('wrong');
      setTimeout(() => goNext(correct), 700);
    }
  };

  const goNext = (newCorrect) => {
    if (qIndex >= TOTAL - 1) {
      onFinish((newCorrect / TOTAL) * 100);
      return;
    }
    setQIndex((i) => i + 1);
    setPicked(null);
    setFeedback(null);
  };

  return (
    <div>
      <p className="mb-4 text-center font-semibold text-slate-500">
        Misol yech va to'g'ri javobni tanla!
      </p>
      <p className="mb-2 text-center text-sm font-bold text-amber-600">Savol {qIndex + 1} / {TOTAL}</p>

      <div className={`mx-auto max-w-sm rounded-3xl border-2 p-6 text-center transition ${
        feedback === 'right' ? 'border-candy-green bg-soft-mint/60' :
        feedback === 'wrong' ? 'border-rose-300 bg-rose-50' :
        'border-soft-purple bg-white'
      }`}>
        <p className="text-4xl font-extrabold text-slate-800">{q?.text}</p>
      </div>

      <div className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-3">
        {q?.options.map((opt) => (
          <button
            key={opt}
            onClick={() => pick(opt)}
            className={`rounded-2xl border-2 bg-white p-4 text-2xl font-extrabold shadow-soft transition active:scale-95 ${
              picked === opt && feedback === 'right'
                ? 'border-candy-green text-candy-green'
                : picked === opt && feedback === 'wrong'
                  ? 'animate-shake border-rose-300 text-rose-500'
                  : 'border-soft-purple text-slate-700 hover:border-candy-purple'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <p className="mt-4 text-center text-sm font-bold text-slate-400">
        To'g'ri javoblar: {correct} / {TOTAL}
      </p>
    </div>
  );
}