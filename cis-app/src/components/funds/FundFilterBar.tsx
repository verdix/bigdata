import type { FundCategory, Level } from '../../types';
import { CATEGORY_LABELS } from '../../data/fundData';

export interface FundFilters {
  minYield: number;
  maxExpense: number;
  risk: 'All' | Level;
  categories: FundCategory[];
}

interface FundFilterBarProps {
  filters: FundFilters;
  onChange: (filters: FundFilters) => void;
}

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as FundCategory[];

export default function FundFilterBar({ filters, onChange }: FundFilterBarProps) {
  function toggleCategory(cat: FundCategory) {
    const has = filters.categories.includes(cat);
    onChange({
      ...filters,
      categories: has ? filters.categories.filter((c) => c !== cat) : [...filters.categories, cat],
    });
  }

  return (
    <div className="bg-card border border-line rounded-xl p-5">
      <h3 className="font-semibold text-navy mb-4">Filter Funds</h3>
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <label className="text-xs text-gray">
          Min Yield (%)
          <input
            type="number"
            className="mt-1 w-full border border-line rounded-lg px-2 py-1.5 text-sm text-ink"
            value={filters.minYield}
            onChange={(e) => onChange({ ...filters, minYield: Number(e.target.value) })}
          />
        </label>
        <label className="text-xs text-gray">
          Max Expense Ratio (%)
          <input
            type="number"
            step="0.01"
            className="mt-1 w-full border border-line rounded-lg px-2 py-1.5 text-sm text-ink"
            value={filters.maxExpense}
            onChange={(e) => onChange({ ...filters, maxExpense: Number(e.target.value) })}
          />
        </label>
        <label className="text-xs text-gray">
          Risk Tolerance
          <select
            className="mt-1 w-full border border-line rounded-lg px-2 py-1.5 text-sm text-ink"
            value={filters.risk}
            onChange={(e) => onChange({ ...filters, risk: e.target.value as FundFilters['risk'] })}
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
      </div>
      <div>
        <span className="text-xs text-gray block mb-2">Categories (none checked = all)</span>
        <div className="flex flex-wrap gap-3">
          {ALL_CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-1.5 text-xs text-ink">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {CATEGORY_LABELS[cat]}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
