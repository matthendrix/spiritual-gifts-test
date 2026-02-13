"use client";

import { useMemo, useState } from "react";
import { questions } from "@/data/questions";
import { gifts, GiftInfo } from "@/data/gifts";

const ANSWER_OPTIONS = [
  { value: 3, label: "Much", detail: "Forcefully true of me" },
  { value: 2, label: "Some", detail: "Often hits the mark" },
  { value: 1, label: "Little", detail: "Sometimes I notice this" },
  { value: 0, label: "None", detail: "Not a natural pattern" },
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

export default function Page() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

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

  const handleSelect = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setSubmitted(false);
  };

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
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-10 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-900/80 backdrop-blur">
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Willow Church · Spiritual Gift Survey</p>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">Discover your top spiritual gift</h1>
          <p className="mx-auto max-w-3xl text-base text-slate-300">
            Answer each statement honestly and the experience will highlight the single gift that resonates most with your
            calling. You can refresh and retake whenever you like.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Progress</p>
              <p className="text-lg font-semibold text-white">{completion}% answered</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!isComplete}
                className="rounded-full border border-sky-500 bg-sky-500 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-slate-900 transition hover:border-sky-300 hover:bg-sky-300 disabled:cursor-not-allowed disabled:border-slate-600 disabled:bg-slate-700 disabled:text-slate-400"
              >
                Reveal my gift
              </button>
              <button
                onClick={handleReset}
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-white transition hover:border-white/40"
              >
                Start over
              </button>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-[width]"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.4em] text-slate-500">
            {answeredCount} of {questions.length} statements answered
          </p>
        </section>

        <section className="space-y-6">
          {questions.map((question, index) => {
            const currentValue = answers[question.id];
            return (
              <article
                key={question.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900 to-slate-950 p-5 shadow-lg shadow-sky-900/20"
              >
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.35em] text-slate-500">
                  <span>Gift {question.gift}</span>
                  <span>#{index + 1}</span>
                </div>
                <p className="mt-3 text-lg font-semibold text-white">{question.prompt}</p>
                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  {ANSWER_OPTIONS.map((option) => {
                    const isActive = currentValue === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => handleSelect(question.id, option.value)}
                        className={`flex flex-col gap-1 rounded-2xl border px-3 py-4 text-left transition ${
                          isActive
                            ? "border-sky-400 bg-white/5 text-white shadow-[0_0_30px_rgba(14,165,233,0.25)]"
                            : "border-white/5 bg-slate-900/60 text-slate-300 hover:border-sky-500/80 hover:bg-slate-900"
                        }`}
                      >
                        <span className="text-2xl font-semibold">{option.value}</span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{option.label}</span>
                        <span className="text-[0.65rem] leading-tight uppercase tracking-[0.2em] text-slate-500">{option.detail}</span>
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>

        {submitted && topGift && (
          <section className="rounded-3xl border border-emerald-400/60 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-emerald-900/40">
            <p className="text-xs uppercase tracking-[0.5em] text-emerald-300">Result</p>
            <h2 className="mt-2 text-4xl font-semibold text-white">{topGift.name}</h2>
            <p className="mt-3 text-base text-slate-200">{topGift.description}</p>
            {topGift.references && (
              <p className="mt-4 text-sm uppercase tracking-[0.35em] text-slate-400">
                Scripture: {topGift.references}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-emerald-300/50 bg-emerald-300/10 px-4 py-1 text-xs uppercase tracking-[0.4em] text-emerald-200">
                Score {topGiftEntry?.score ?? 0}
              </span>
              <span className="rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.4em] text-white">
                Based on real statements
              </span>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
