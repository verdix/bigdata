import { useMemo, useState } from 'react';
import type { FundInputs } from '../../types';
import { FUND_DATA, CATEGORY_LABELS } from '../../data/fundData';
import { computeFundScore } from '../../lib/scoring';
import { fmtPct } from '../../lib/format';
import { exportToCsv } from '../../lib/csv';
import FundFilterBar, { type FundFilters } from './FundFilterBar';
import FundCard from './FundCard';
import CustomFundForm from './CustomFundForm';
import Leaderboard from '../Leaderboard';

let nextId = 1;
const BASE_FUNDS: FundInputs[] = FUND_DATA.map((f) => ({ ...f, id: `fund-${nextId++}` }));

const DEFAULT_FILTERS: FundFilters = {
  minYield: 0,
  maxExpense: 100,
  risk: 'All',
  categories: [],
};

export default function FundsGrid() {
  const [customFunds, setCustomFunds] = useState<FundInputs[]>([]);
  const [filters, setFilters] = useState<FundFilters>(DEFAULT_FILTERS);

  const allFunds = useMemo(() => [...BASE_FUNDS, ...customFunds], [customFunds]);

  const filtered = useMemo(() => {
    return allFunds.filter((f) => {
      if (f.yield < filters.minYield) return false;
      if (f.expense > filters.maxExpense) return false;
      if (filters.risk !== 'All' && f.risk !== filters.risk) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(f.category)) return false;
      return true;
    });
  }, [allFunds, filters]);

  function removeCustomFund(id: string) {
    setCustomFunds((prev) => prev.filter((f) => f.id !== id));
  }

  function handleExport() {
    const rows = filtered.map((f) => {
      const s = computeFundScore(f);
      return {
        Ticker: f.ticker,
        Name: f.name,
        Category: CATEGORY_LABELS[f.category],
        Yield: fmtPct(f.yield),
        Expense: fmtPct(f.expense, 2),
        Growth: f.growth,
        Risk: f.risk,
        Score: s.composite.toFixed(1),
        Grade: s.grade,
      };
    });
    exportToCsv(
      rows,
      ['Ticker', 'Name', 'Category', 'Yield', 'Expense', 'Growth', 'Risk', 'Score', 'Grade'],
      'cis-funds.csv',
    );
  }

  return (
    <div className="space-y-6">
      <FundFilterBar filters={filters} onChange={setFilters} />

      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-navy text-lg">Fund Leaderboard</h2>
        <button
          onClick={handleExport}
          className="border border-line text-ink text-sm font-semibold px-4 py-2 rounded-lg hover:bg-bg cursor-pointer"
        >
          Export CSV
        </button>
      </div>

      <Leaderboard
        title="Income Score Ranking"
        rows={filtered}
        getId={(f) => f.id}
        getName={(f) => `${f.ticker} — ${f.name}`}
        getComposite={(f) => computeFundScore(f).composite}
        getGrade={(f) => computeFundScore(f).grade}
        columns={[
          { header: 'Yield', render: (f) => fmtPct(f.yield), align: 'right' },
          { header: 'Expense', render: (f) => fmtPct(f.expense, 2), align: 'right' },
          { header: 'Risk', render: (f) => f.risk, align: 'center' },
        ]}
      />

      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-5">
        {filtered.map((f) => (
          <FundCard key={f.id} fund={f} onRemove={removeCustomFund} />
        ))}
      </div>

      <CustomFundForm onAdd={(fund) => setCustomFunds((prev) => [...prev, fund])} />
    </div>
  );
}
