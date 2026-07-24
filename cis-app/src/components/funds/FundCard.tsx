import type { FundInputs } from '../../types';
import { computeFundScore } from '../../lib/scoring';
import { fmtPct } from '../../lib/format';
import { CATEGORY_LABELS } from '../../data/fundData';
import GradePill from '../GradePill';

const GRADE_BLOCK: Record<string, string> = {
  A: 'bg-green-bg border-green',
  B: 'bg-blue-bg border-blue',
  C: 'bg-amber-bg border-amber',
  D: 'bg-red-bg border-red',
  F: 'bg-red-bg border-red',
};

interface FundCardProps {
  fund: FundInputs;
  onRemove?: (id: string) => void;
}

export default function FundCard({ fund, onRemove }: FundCardProps) {
  const score = computeFundScore(fund);

  return (
    <div className="bg-card border border-line rounded-xl p-5">
      <div className="flex items-start justify-between mb-1">
        <div>
          <div className="font-bold text-ink">{fund.ticker}</div>
          <div className="text-xs text-gray">{fund.name}</div>
        </div>
        {fund.custom && onRemove && (
          <button
            onClick={() => onRemove(fund.id)}
            className="text-red text-xs font-semibold hover:underline cursor-pointer"
          >
            Remove
          </button>
        )}
      </div>
      <div className="text-xs text-gray mb-4">
        {CATEGORY_LABELS[fund.category]} · {fund.frequency}
      </div>

      <div className={`rounded-lg border p-4 ${GRADE_BLOCK[score.grade]}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-ink">{score.composite.toFixed(1)}</div>
            <div className="text-xs text-gray">{score.verdict}</div>
          </div>
          <GradePill grade={score.grade} />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <span className="text-gray">Yield</span>
          <span className="text-right font-medium">{fmtPct(fund.yield)}</span>
          <span className="text-gray">Expense Ratio</span>
          <span className="text-right font-medium">{fmtPct(fund.expense, 2)}</span>
          <span className="text-gray">Growth Potential</span>
          <span className="text-right font-medium">{fund.growth}</span>
          <span className="text-gray">Risk</span>
          <span className="text-right font-medium">{fund.risk}</span>
        </div>
        {fund.navErosionRisk && (
          <p className="text-xs text-amber mt-3">
            ⚠ Options-income strategy — high headline yield can come with NAV erosion over time.
          </p>
        )}
      </div>
    </div>
  );
}
