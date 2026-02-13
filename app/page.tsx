"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { questions } from "@/data/questions";
import { gifts, GiftInfo } from "@/data/gifts";

const ANSWER_OPTIONS = [
  { value: 3, label: "Much", detail: "Strongly true of me" },
  { value: 2, label: "Some", detail: "Often true of me" },
  { value: 1, label: "Little", detail: "Sometimes true of me" },
  { value: 0, label: "None", detail: "Not true of me" },
];

const normalize = (value: string) => value.replace(/[^a-z0-9]/gi, "").toLowerCase();

const aliasMap: Record<string, string> = {
  creativecomm: "Creative Communication",
  exhortation: "Exhortation/Encouragement",
  helps: "Helps/Service",
  intercession: "Intercession/Prayer",
  interpretation: "Interpretation of Tongues",
  shepherd: "Shepherd/Pastor",
};

const normalizedGiftLookup: Record<string, GiftInfo> = {};
gifts.forEach((gift) => {
  normalizedGiftLookup[normalize(gift.name)] = gift;
});

const aliasLookup: Record<string, string> = {};
Object.entries(aliasMap).forEach(([key, target]) => {
  aliasLookup[key] = normalize(target);
});

const getGiftInfo = (name?: string) => {
  if (!name) return undefined;
  const normalized = normalize(name);
  return normalizedGiftLookup[normalized] ?? normalizedGiftLookup[aliasLookup[normalized]];
};

/* ------------------------------------------------------------------ */
/*  Memoized question card                                             */
/* ------------------------------------------------------------------ */

interface QuestionCardProps {
  question: (typeof questions)[number];
  index: number;
  currentValue: number | undefined;
  onSelect: (questionId: string, value: number) => void;
}

const QuestionCard = memo(function QuestionCard({
  question,
  index,
  currentValue,
  onSelect,
}: QuestionCardProps) {
  return (
    <article className="rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex items-baseline gap-3">
        <span className="text-xs font-medium tabular-nums text-stone-400 shrink-0">
          {index + 1} / {questions.length}
        </span>
        <p className="text-base font-medium text-stone-800">{question.prompt}</p>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        {ANSWER_OPTIONS.map((option) => {
          const isActive = currentValue === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(question.id, option.value)}
              className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                isActive
                  ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                  : "border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300 hover:bg-stone-100"
              }`}
            >
              <span className="text-lg font-semibold">{option.value}</span>
              <span className="ml-2 text-sm">{option.label}</span>
              <p className="mt-0.5 text-xs text-stone-400">{option.detail}</p>
            </button>
          );
        })}
      </div>
    </article>
  );
});

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "spiritual-gifts-answers";

function loadSavedAnswers(): Record<string, number> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export default function Page() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  // Restore saved answers after hydration (avoids server/client mismatch)
  useEffect(() => {
    const saved = loadSavedAnswers();
    if (Object.keys(saved).length > 0) {
      setAnswers(saved);
    }
  }, []);

  // Persist answers to localStorage on every change
  useEffect(() => {
    try {
      if (Object.keys(answers).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch { /* localStorage unavailable */ }
  }, [answers]);

  const answeredCount = Object.keys(answers).length;
  const completion = Math.round((answeredCount / questions.length) * 100);
  const isComplete = answeredCount === questions.length;

  const scores = useMemo(() => {
    return questions.reduce<Record<string, number>>((acc, question) => {
      const value = answers[question.id];
      if (value != null) {
        acc[question.gift] = (acc[question.gift] ?? 0) + value;
      }
      return acc;
    }, {});
  }, [answers]);

  const sortedGifts = useMemo(() => {
    return Object.entries(scores)
      .map(([gift, score]) => ({ gift, score }))
      .sort((a, b) => b.score - a.score);
  }, [scores]);

  const topGiftEntry = sortedGifts[0];
  const topGift = getGiftInfo(topGiftEntry?.gift);

  const handleSelect = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setSubmitted(false);
  }, []);

  const handleSubmit = () => {
    if (isComplete) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-stone-400">
            Willow Church
          </p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            Spiritual Gifts Survey
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone-500">
            Answer each statement honestly. When you&rsquo;re finished, we&rsquo;ll show you the
            spiritual gift that best matches your responses.
          </p>
        </header>

        {/* Progress */}
        <section className="sticky top-0 z-10 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-stone-700">
                {answeredCount} of {questions.length} answered
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={!isComplete}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
              >
                See my result
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-indigo-500 transition-[width]"
              style={{ width: `${completion}%` }}
            />
          </div>
        </section>

        {/* Questions (virtualized) */}
        <section>
          <Virtuoso
            useWindowScroll
            totalCount={questions.length}
            overscan={200}
            itemContent={(index) => {
              const question = questions[index];
              return (
                <div className="pb-4">
                  <QuestionCard
                    question={question}
                    index={index}
                    currentValue={answers[question.id]}
                    onSelect={handleSelect}
                  />
                </div>
              );
            }}
          />
        </section>

        {/* Result */}
        {submitted && topGift && (
          <section className="rounded-xl border border-indigo-200 bg-indigo-50 p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-indigo-500">
              Your top gift
            </p>
            <h2 className="mt-2 text-2xl font-bold text-stone-900">{topGift.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">{topGift.description}</p>
            {topGift.references && (
              <p className="mt-4 text-sm text-stone-500">
                <span className="font-medium">Scripture:</span> {topGift.references}
              </p>
            )}
            <p className="mt-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
              Score: {topGiftEntry?.score ?? 0}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
