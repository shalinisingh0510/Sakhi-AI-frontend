type StatCardProps = {
  value: string;
  label: string;
};

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-soft">
      <p className="text-3xl font-semibold text-berry">{value}</p>
      <p className="mt-2 text-sm uppercase tracking-[0.2em] text-ink/55">{label}</p>
    </div>
  );
}
