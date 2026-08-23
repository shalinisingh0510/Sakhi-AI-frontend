import { useTranslations } from "next-intl";

interface Props {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ENERGIES = [
  { code: "VERY_LOW", icon: "🔋", label: "Very Low" },
  { code: "LOW", icon: "🪫", label: "Low" },
  { code: "MEDIUM", icon: "⚡", label: "Medium" },
  { code: "HIGH", icon: "✨", label: "High" },
  { code: "VERY_HIGH", icon: "🔥", label: "Very High" },
];

export function EnergySelector({ value, onChange, disabled }: Props) {
  const t = useTranslations("Wellness.energy");

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-ink">{t("question")}</h3>
      <div className="flex flex-wrap gap-2">
        {ENERGIES.map((energy) => {
          const isSelected = value === energy.code;
          return (
            <button
              key={energy.code}
              type="button"
              disabled={disabled}
              onClick={() => onChange(energy.code)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                isSelected 
                  ? "bg-blue-100 border-blue-300 text-blue-800" 
                  : "bg-white border-peach/50 text-ink/70 hover:bg-peach/10"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span aria-hidden="true">{energy.icon}</span>
              <span className="text-sm font-medium">
                {t(`options.${energy.code}`)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
