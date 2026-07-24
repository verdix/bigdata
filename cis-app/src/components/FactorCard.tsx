export interface Factor {
  label: string;
  weightPct: number;
  description: string;
}

export default function FactorCard({ factors, title }: { factors: Factor[]; title: string }) {
  return (
    <div className="bg-card border border-line rounded-xl p-5">
      <h3 className="font-semibold text-navy mb-4">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {factors.map((f) => (
          <div key={f.label} className="border border-line rounded-lg p-4">
            <div className="flex items-baseline justify-between mb-1">
              <span className="font-semibold text-sm text-ink">{f.label}</span>
              <span className="text-gold font-bold text-sm">{f.weightPct}%</span>
            </div>
            <p className="text-xs text-gray leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
