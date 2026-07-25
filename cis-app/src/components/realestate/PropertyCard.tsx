import { computeMetrics } from '../../lib/scoring';
import { fmtMoney, fmtPct } from '../../lib/format';
import type { PropertyInputs } from '../../types';
import GradePill from '../GradePill';

interface FieldDef {
  key: keyof PropertyInputs;
  label: string;
  suffix?: string;
}

const FIELDS: FieldDef[] = [
  { key: 'price', label: 'Purchase Price', suffix: '$' },
  { key: 'downPct', label: 'Down Payment', suffix: '%' },
  { key: 'rate', label: 'Interest Rate', suffix: '%' },
  { key: 'term', label: 'Loan Term', suffix: 'yrs' },
  { key: 'rent', label: 'Monthly Rent', suffix: '$' },
  { key: 'taxes', label: 'Monthly Taxes', suffix: '$' },
  { key: 'insurance', label: 'Monthly Insurance', suffix: '$' },
  { key: 'hoa', label: 'Monthly HOA', suffix: '$' },
  { key: 'maintPct', label: 'Maintenance', suffix: '% of rent' },
  { key: 'mgmtPct', label: 'Management', suffix: '% of rent' },
  { key: 'vacancyPct', label: 'Vacancy', suffix: '% of rent' },
  { key: 'other', label: 'Other Monthly', suffix: '$' },
  { key: 'closing', label: 'Closing Costs', suffix: '$' },
  { key: 'rehab', label: 'Rehab Budget', suffix: '$' },
];

const GRADE_BLOCK: Record<string, string> = {
  A: 'bg-green-bg border-green',
  B: 'bg-blue-bg border-blue',
  C: 'bg-amber-bg border-amber',
  D: 'bg-red-bg border-red',
  F: 'bg-red-bg border-red',
};

interface PropertyCardProps {
  property: PropertyInputs;
  onChange: (id: string, patch: Partial<PropertyInputs>) => void;
  onRemove: (id: string) => void;
}

export default function PropertyCard({ property, onChange, onRemove }: PropertyCardProps) {
  const metrics = computeMetrics(property);

  return (
    <div className="bg-card border border-line rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4 gap-3">
        <input
          className="font-semibold text-ink text-base border-b border-transparent hover:border-line focus:border-gold outline-none flex-1 min-w-0"
          value={property.name}
          onChange={(e) => onChange(property.id, { name: e.target.value })}
          placeholder="Property nickname"
        />
        <button
          onClick={() => onRemove(property.id)}
          className="text-red text-xs font-semibold hover:underline shrink-0 cursor-pointer"
        >
          Remove
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {FIELDS.map((f) => (
          <label key={f.key} className="text-xs text-gray">
            {f.label}
            <input
              type="number"
              className="mt-1 w-full border border-line rounded-lg px-2 py-1.5 text-sm text-ink"
              value={property[f.key] as number}
              onChange={(e) =>
                onChange(property.id, { [f.key]: Number(e.target.value) } as Partial<PropertyInputs>)
              }
            />
          </label>
        ))}
      </div>

      <div className={`rounded-lg border p-4 ${GRADE_BLOCK[metrics.grade]}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-ink">{metrics.composite.toFixed(1)}</div>
            <div className="text-xs text-gray">{metrics.verdict}</div>
          </div>
          <GradePill grade={metrics.grade} />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <span className="text-gray">Cap Rate</span>
          <span className="text-right font-medium">{fmtPct(metrics.capRate)}</span>
          <span className="text-gray">Cash-on-Cash</span>
          <span className="text-right font-medium">{fmtPct(metrics.coc)}</span>
          <span className="text-gray">DSCR</span>
          <span className="text-right font-medium">{metrics.dscr.toFixed(2)}</span>
          <span className="text-gray">1% Rule</span>
          <span className="text-right font-medium">{fmtPct(metrics.onePct)}</span>
          <span className="text-gray">GRM</span>
          <span className="text-right font-medium">{metrics.grm.toFixed(1)}</span>
          <span className="text-gray">Break-Even Ratio</span>
          <span className="text-right font-medium">{fmtPct(metrics.breakEven)}</span>
          <span className="text-gray">Monthly Cash Flow</span>
          <span className={`text-right font-semibold ${metrics.cashFlowMonthly < 0 ? 'text-red' : 'text-green'}`}>
            {fmtMoney(metrics.cashFlowMonthly)}
          </span>
        </div>
        {metrics.flags.length > 0 && (
          <ul className="mt-3 space-y-1">
            {metrics.flags.map((flag) => (
              <li key={flag} className="text-xs text-red">
                ⚠ {flag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
