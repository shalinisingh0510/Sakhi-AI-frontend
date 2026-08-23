import { useTranslations } from "next-intl";

interface Props {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MOODS = [
  { code: "HAPPY", icon: "😊" },
  { code: "CALM", icon: "😌" },
  { code: "NEUTRAL", icon: "😐" },
  { code: "SAD", icon: "😔" },
  { code: "IRRITATED", icon: "😠" },
  { code: "ANXIOUS", icon: "😰" },
  { code: "STRESSED", icon: "😫" },
  { code: "LOW", icon: "📉" },
  { code: "ENERGETIC", icon: "🤩" },
];

export function MoodSelector({ value, onChange, disabled }: Props) {
  const t = useTranslations("Wellness.mood");

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-ink">{t("question")}</h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {MOODS.map((mood) => {
          const isSelected = value === mood.code;
          return (
            <button
              key={mood.code}
              type="button"
              disabled={disabled}
              onClick={() => onChange(mood.code)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-colors ${
                isSelected 
                  ? "bg-peach border-berry text-berry" 
                  : "bg-white border-peach/50 text-ink/70 hover:bg-peach/10"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="text-2xl mb-1" aria-hidden="true">{mood.icon}</span>
              <span className="text-xs font-medium text-center leading-tight">
                {t(`options.${mood.code}`)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
