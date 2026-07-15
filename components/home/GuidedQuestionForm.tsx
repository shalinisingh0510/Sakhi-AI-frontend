"use client";

import { FormEvent, useMemo, useState } from "react";

type GuidedQuestionFormProps = {
  languages: string[];
};

type FormState = {
  name: string;
  language: string;
  topic: string;
  question: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const topicOptions = [
  "First period",
  "Menstrual hygiene",
  "Puberty changes",
  "Nutrition",
  "Mental wellbeing",
  "Emergency awareness",
];

const initialState: FormState = {
  name: "",
  language: "English",
  topic: "",
  question: "",
};

export function GuidedQuestionForm({ languages }: GuidedQuestionFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<FormState | null>(null);

  const helperText = useMemo(() => {
    if (submitted) {
      return "Thanks. We will use this information to prepare a gentle, relevant response flow.";
    }
    return "Tell us what you want to learn so the experience can guide you with care.";
  }, [submitted]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.topic) {
      nextErrors.topic = "Please choose a topic.";
    }

    if (!form.question.trim()) {
      nextErrors.question = "Please write at least one question.";
    } else if (form.question.trim().length < 20) {
      nextErrors.question = "Please add a little more detail so we can help better.";
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(null);
      return;
    }

    setSubmitted(form);
    setForm((current) => ({
      ...current,
      topic: "",
      question: "",
    }));
  };

  return (
    <div className="rounded-[2rem] border border-peach/70 bg-white/90 p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4 border-b border-berry/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-moss">Guided form</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">Start with a gentle question.</h3>
        </div>
        <span className="rounded-full bg-lavender/80 px-3 py-1 text-xs font-semibold text-berry">
          Private preview
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-ink/70">{helperText}</p>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-ink">
            Your name
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Optional"
              className="rounded-2xl border border-berry/15 bg-cream px-4 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-rose focus:ring-2 focus:ring-rose/20"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ink">
            Preferred language
            <select
              value={form.language}
              onChange={(event) => updateField("language", event.target.value)}
              className="rounded-2xl border border-berry/15 bg-cream px-4 py-3 text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/20"
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Topic
          <select
            value={form.topic}
            onChange={(event) => updateField("topic", event.target.value)}
            aria-invalid={Boolean(errors.topic)}
            className="rounded-2xl border border-berry/15 bg-cream px-4 py-3 text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/20"
          >
            <option value="">Choose a topic</option>
            {topicOptions.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          {errors.topic ? <span className="text-sm text-rose">{errors.topic}</span> : null}
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Your question
          <textarea
            value={form.question}
            onChange={(event) => updateField("question", event.target.value)}
            rows={5}
            aria-invalid={Boolean(errors.question)}
            placeholder="For example: I want to understand the first signs of my period and what to keep ready."
            className="rounded-[1.5rem] border border-berry/15 bg-cream px-4 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-rose focus:ring-2 focus:ring-rose/20"
          />
          {errors.question ? <span className="text-sm text-rose">{errors.question}</span> : null}
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose to-berry px-5 py-3 text-sm font-semibold text-cream transition hover:from-berry hover:to-rose"
        >
          Save question preview
        </button>
      </form>

      {submitted ? (
        <div className="mt-6 rounded-[1.5rem] border border-mint/60 bg-mint/45 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-moss">Saved preview</p>
          <p className="mt-3 text-sm leading-7 text-ink/70">
            <span className="font-semibold text-ink">Language:</span> {submitted.language}
            <br />
            <span className="font-semibold text-ink">Topic:</span> {submitted.topic}
            <br />
            <span className="font-semibold text-ink">Question:</span> {submitted.question}
          </p>
        </div>
      ) : null}
    </div>
  );
}
