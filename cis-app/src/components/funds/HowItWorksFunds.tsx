import FactorCard, { type Factor } from '../FactorCard';

const FACTORS: Factor[] = [
  { label: 'Yield', weightPct: 45, description: 'Current distribution yield — the core driver of near-term cash flow.' },
  { label: 'Expense Ratio', weightPct: 20, description: 'Annual fund fee — lower expenses mean more of the yield reaches you.' },
  { label: 'Growth Potential', weightPct: 20, description: 'Qualitative outlook for distribution and price growth over time.' },
  { label: 'Risk Level', weightPct: 15, description: 'Qualitative volatility/drawdown risk relative to other income funds.' },
];

export default function HowItWorksFunds() {
  return (
    <div className="space-y-3">
      <FactorCard title="How the Income Score is built" factors={FACTORS} />
      <div className="bg-amber-bg border border-amber/30 rounded-xl p-4 text-sm text-ink">
        <strong className="text-amber">Note:</strong> A high Income Score means strong,
        relatively durable cash flow for an income-focused investor — it is not a prediction of
        total return. High-yield strategies (like covered-call ETFs) can score well here for cash
        flow while lagging a low-yield growth fund on long-term total return. Covered-call funds
        are also flagged for NAV erosion risk below — the option premium they collect doesn&apos;t
        fully offset the upside they give away, which can erode share price over time even while
        the distribution stays high. Use the &quot;Conservative / Retirement&quot; filter preset to
        screen these out.
      </div>
    </div>
  );
}
