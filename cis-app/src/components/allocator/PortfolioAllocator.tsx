import { useMemo, useState } from 'react';
import type { FundInputs, PropertyInputs } from '../../types';
import { buildAllocationPlan, fundToCandidate, propertyToCandidate } from '../../lib/allocator';
import { fmtMoney, fmtPct } from '../../lib/format';
import GradePill from '../GradePill';

interface PortfolioAllocatorProps {
  properties: PropertyInputs[];
  funds: FundInputs[];
}

const GRADE_BLOCK: Record<string, string> = {
  A: 'bg-green-bg border-green',
  B: 'bg-blue-bg border-blue',
  C: 'bg-amber-bg border-amber',
  D: 'bg-red-bg border-red',
  F: 'bg-red-bg border-red',
};

export default function PortfolioAllocator({ properties, funds }: PortfolioAllocatorProps) {
  const [capitalInput, setCapitalInput] = useState('50000');
  const capital = Math.max(0, Number(capitalInput) || 0);

  const candidates = useMemo(
    () => [...properties.map(propertyToCandidate), ...funds.map(fundToCandidate)],
    [properties, funds],
  );

  const plan = useMemo(() => buildAllocationPlan(capital, candidates), [capital, candidates]);

  return (
    <div className="space-y-6">
      <div className="bg-card border border-line rounded-xl shadow-sm p-5">
        <h2 className="font-semibold text-navy text-lg mb-1">Portfolio Allocator</h2>
        <p className="text-sm text-gray mb-4">
          Every property from the Real Estate tab and every fund from the ETFs &amp; Mutual
          Funds tab, ranked on the same 0–100 scale and matched against how much you actually
          have to invest — so you get one answer, not two separate calculators.
        </p>
        <label className="text-xs text-gray block max-w-xs">
          Investable capital
          <div className="mt-1 flex items-center border border-line rounded-lg px-3 py-2">
            <span className="text-gray text-sm mr-1">$</span>
            <input
              type="number"
              className="w-full text-sm text-ink outline-none"
              value={capitalInput}
              onChange={(e) => setCapitalInput(e.target.value)}
            />
          </div>
        </label>
      </div>

      {!plan.winner ? (
        <div className="bg-amber-bg border border-amber/30 rounded-xl p-5 text-sm text-ink">
          Nothing in your Real Estate or Funds tabs fits within {fmtMoney(capital, 0)} yet. Add a
          property or fund, or increase your capital amount, to see a recommendation.
        </div>
      ) : (
        <>
          <div className={`rounded-xl border-2 p-6 shadow-sm ${GRADE_BLOCK[plan.winner.grade]}`}>
            <div className="text-xs uppercase tracking-widest text-gray font-semibold mb-2">
              For {fmtMoney(capital, 0)}, your best cash-flow pick is
            </div>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-ink">{plan.winner.name}</div>
                <div className="text-sm text-gray">{plan.winner.subtitle}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-3xl font-bold text-ink">{plan.winner.composite.toFixed(1)}</div>
                  <div className="text-xs text-gray">{plan.winner.verdict}</div>
                </div>
                <GradePill grade={plan.winner.grade} />
              </div>
            </div>
            <ul className="space-y-1.5 mb-4">
              {plan.winner.whyBullets.map((b) => (
                <li key={b} className="text-sm text-ink flex gap-2">
                  <span className="text-gold">→</span> {b}
                </li>
              ))}
            </ul>
            {plan.winner.flags.length > 0 && (
              <ul className="space-y-1 mb-2">
                {plan.winner.flags.map((f) => (
                  <li key={f} className="text-xs text-red">
                    ⚠ {f}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-card border border-line rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-navy mb-4">Suggested allocation of your {fmtMoney(capital, 0)}</h3>
            <div className="space-y-3 mb-4">
              {plan.allocation.map((slice) => (
                <div
                  key={slice.candidate.id}
                  className="flex items-center justify-between border border-line rounded-lg p-3"
                >
                  <div>
                    <div className="font-medium text-sm text-ink">{slice.candidate.name}</div>
                    <div className="text-xs text-gray">{slice.candidate.subtitle}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm text-ink">{fmtMoney(slice.capitalDeployed, 0)}</div>
                    <div className="text-xs text-green">{fmtMoney(slice.annualCashFlow, 0)}/yr</div>
                  </div>
                </div>
              ))}
              {plan.uninvestedCapital > 1 && (
                <div className="flex items-center justify-between border border-dashed border-line rounded-lg p-3 text-gray">
                  <div className="text-sm">Uninvested (below minimum to add another position)</div>
                  <div className="font-semibold text-sm">{fmtMoney(plan.uninvestedCapital, 0)}</div>
                </div>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-line">
              <div>
                <div className="text-xs text-gray">Total projected annual cash flow</div>
                <div className="text-xl font-bold text-green">{fmtMoney(plan.totalAnnualCashFlow, 0)}</div>
              </div>
              <div>
                <div className="text-xs text-gray">Blended cash yield</div>
                <div className="text-xl font-bold text-ink">{fmtPct(plan.blendedYieldPct)}</div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-line rounded-xl shadow-sm overflow-hidden">
            <h3 className="font-semibold text-navy px-5 pt-5 pb-3">
              Every candidate, ranked ({plan.ranked.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray border-y border-line">
                    <th className="px-4 py-2 font-medium">#</th>
                    <th className="px-4 py-2 font-medium">Name</th>
                    <th className="px-4 py-2 font-medium">Type</th>
                    <th className="px-4 py-2 font-medium text-right">Capital Needed</th>
                    <th className="px-4 py-2 font-medium text-right">Score</th>
                    <th className="px-4 py-2 font-medium text-center">Grade</th>
                    <th className="px-4 py-2 font-medium text-center">Fits Budget?</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.ranked.map((c, i) => (
                    <tr key={c.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 font-semibold text-gray">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                      <td className="px-4 py-3 text-gray capitalize">{c.kind === 'property' ? 'Real Estate' : 'Fund'}</td>
                      <td className="px-4 py-3 text-right">
                        {c.flexible ? 'Any amount' : fmtMoney(c.capitalRequired, 0)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-navy">{c.composite.toFixed(1)}</td>
                      <td className="px-4 py-3 text-center">
                        <GradePill grade={c.grade} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {c.feasible ? (
                          <span className="text-green text-xs font-semibold">Yes</span>
                        ) : (
                          <span className="text-red text-xs font-semibold">
                            Needs {fmtMoney(c.capitalRequired - capital, 0)} more
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
