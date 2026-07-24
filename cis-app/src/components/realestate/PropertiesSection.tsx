import { useState } from 'react';
import type { PropertyInputs } from '../../types';
import { computeMetrics } from '../../lib/scoring';
import { exportToCsv } from '../../lib/csv';
import { fmtMoney, fmtPct } from '../../lib/format';
import PropertyCard from './PropertyCard';
import Leaderboard from '../Leaderboard';

let nextId = 1;
function blankProperty(name: string): PropertyInputs {
  return {
    id: `prop-${nextId++}`,
    name,
    price: 250000,
    downPct: 20,
    rate: 7,
    term: 30,
    rent: 2200,
    taxes: 300,
    insurance: 100,
    hoa: 0,
    maintPct: 5,
    mgmtPct: 8,
    vacancyPct: 5,
    other: 0,
    closing: 6000,
    rehab: 0,
  };
}

export default function PropertiesSection() {
  const [properties, setProperties] = useState<PropertyInputs[]>(() => [
    blankProperty('Property 1'),
    blankProperty('Property 2'),
  ]);

  function updateProperty(id: string, patch: Partial<PropertyInputs>) {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function removeProperty(id: string) {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  }

  function addProperty() {
    setProperties((prev) => [...prev, blankProperty(`Property ${prev.length + 1}`)]);
  }

  function handleExport() {
    const rows = properties.map((p) => {
      const m = computeMetrics(p);
      return {
        Name: p.name,
        Price: p.price,
        'Cap Rate': fmtPct(m.capRate),
        'Cash-on-Cash': fmtPct(m.coc),
        DSCR: m.dscr.toFixed(2),
        '1% Rule': fmtPct(m.onePct),
        GRM: m.grm.toFixed(1),
        'Break-Even': fmtPct(m.breakEven),
        'Monthly Cash Flow': fmtMoney(m.cashFlowMonthly),
        Score: m.composite.toFixed(1),
        Grade: m.grade,
      };
    });
    exportToCsv(
      rows,
      ['Name', 'Price', 'Cap Rate', 'Cash-on-Cash', 'DSCR', '1% Rule', 'GRM', 'Break-Even', 'Monthly Cash Flow', 'Score', 'Grade'],
      'cis-properties.csv',
    );
  }

  const rankedRows = properties.map((p) => ({ property: p, metrics: computeMetrics(p) }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-navy text-lg">Your Properties</h2>
        <div className="flex gap-2">
          <button
            onClick={addProperty}
            className="bg-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-navy-2 cursor-pointer"
          >
            + Add Property
          </button>
          <button
            onClick={handleExport}
            className="border border-line text-ink text-sm font-semibold px-4 py-2 rounded-lg hover:bg-bg cursor-pointer"
          >
            Export CSV
          </button>
        </div>
      </div>

      <Leaderboard
        title="Property Leaderboard"
        rows={rankedRows}
        getId={(r) => r.property.id}
        getName={(r) => r.property.name}
        getComposite={(r) => r.metrics.composite}
        getGrade={(r) => r.metrics.grade}
        columns={[
          { header: 'Cap Rate', render: (r) => fmtPct(r.metrics.capRate), align: 'right' },
          { header: 'CoC', render: (r) => fmtPct(r.metrics.coc), align: 'right' },
          { header: 'DSCR', render: (r) => r.metrics.dscr.toFixed(2), align: 'right' },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-5">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} onChange={updateProperty} onRemove={removeProperty} />
        ))}
      </div>
    </div>
  );
}
