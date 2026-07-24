import { useState, type FormEvent } from 'react';
import type { FundCategory, FundInputs, Level } from '../../types';
import { CATEGORY_LABELS } from '../../data/fundData';

interface CustomFundFormProps {
  onAdd: (fund: FundInputs) => void;
}

let nextId = 1;

export default function CustomFundForm({ onAdd }: CustomFundFormProps) {
  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FundCategory>('divgrowth');
  const [yieldPct, setYieldPct] = useState('');
  const [expense, setExpense] = useState('');
  const [growth, setGrowth] = useState<Level>('Medium');
  const [risk, setRisk] = useState<Level>('Medium');
  const [frequency, setFrequency] = useState<'Monthly' | 'Quarterly'>('Quarterly');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ticker.trim() || !name.trim()) return;
    onAdd({
      id: `custom-${nextId++}`,
      ticker: ticker.trim().toUpperCase(),
      name: name.trim(),
      category,
      yield: Number(yieldPct) || 0,
      expense: Number(expense) || 0,
      growth,
      risk,
      frequency,
      custom: true,
    });
    setTicker('');
    setName('');
    setYieldPct('');
    setExpense('');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-line rounded-xl shadow-sm p-5">
      <h3 className="font-semibold text-navy mb-4">Add a Custom Fund</h3>
      <div className="grid sm:grid-cols-4 gap-3 mb-3">
        <input
          className="border border-line rounded-lg px-3 py-2 text-sm"
          placeholder="Ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
        />
        <input
          className="border border-line rounded-lg px-3 py-2 text-sm sm:col-span-2"
          placeholder="Fund name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="border border-line rounded-lg px-3 py-2 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value as FundCategory)}
        >
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid sm:grid-cols-4 gap-3 mb-4">
        <input
          className="border border-line rounded-lg px-3 py-2 text-sm"
          placeholder="Yield %"
          type="number"
          value={yieldPct}
          onChange={(e) => setYieldPct(e.target.value)}
        />
        <input
          className="border border-line rounded-lg px-3 py-2 text-sm"
          placeholder="Expense %"
          type="number"
          step="0.01"
          value={expense}
          onChange={(e) => setExpense(e.target.value)}
        />
        <select
          className="border border-line rounded-lg px-3 py-2 text-sm"
          value={growth}
          onChange={(e) => setGrowth(e.target.value as Level)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select
          className="border border-line rounded-lg px-3 py-2 text-sm"
          value={risk}
          onChange={(e) => setRisk(e.target.value as Level)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <select
          className="border border-line rounded-lg px-3 py-2 text-sm"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as 'Monthly' | 'Quarterly')}
        >
          <option>Monthly</option>
          <option>Quarterly</option>
        </select>
        <button
          type="submit"
          className="bg-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-navy-2 cursor-pointer"
        >
          Add Fund
        </button>
      </div>
    </form>
  );
}
