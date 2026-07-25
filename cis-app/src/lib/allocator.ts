import type { FundInputs, PropertyInputs } from '../types';
import {
  FUND_WEIGHTS,
  RE_CURVES,
  RE_WEIGHTS,
  computeFundScore,
  computeMetrics,
  interp,
} from './scoring';
import { fmtMoney, fmtPct } from './format';

export type CandidateKind = 'property' | 'fund';

export interface AllocationCandidate {
  id: string;
  kind: CandidateKind;
  name: string;
  subtitle: string;
  composite: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  verdict: string;
  /** Minimum cash needed to take this position at all. */
  capitalRequired: number;
  /** true = capital can be partially deployed (funds); false = all-or-nothing (a specific property). */
  flexible: boolean;
  /** Projected annual cash flow in dollars for a given amount of capital deployed into this candidate. */
  annualCashFlowAt: (capitalDeployed: number) => number;
  /** Annual cash yield on the capital required, for display. */
  yieldPct: number;
  whyBullets: string[];
  flags: string[];
}

function explainProperty(v: PropertyInputs): string[] {
  const m = computeMetrics(v);
  const contributions = [
    { label: 'Cash-on-Cash Return', weighted: RE_WEIGHTS.coc * interp(m.coc, RE_CURVES.coc), detail: `${fmtPct(m.coc)} cash-on-cash return` },
    { label: 'Cap Rate', weighted: RE_WEIGHTS.cap * interp(m.capRate, RE_CURVES.cap), detail: `${fmtPct(m.capRate)} cap rate` },
    { label: 'DSCR', weighted: RE_WEIGHTS.dscr * interp(m.dscr, RE_CURVES.dscr), detail: `${m.dscr.toFixed(2)}x debt service coverage` },
    { label: '1% Rule', weighted: RE_WEIGHTS.onePct * interp(m.onePct, RE_CURVES.onePct), detail: `${fmtPct(m.onePct)} rent-to-price ratio` },
    { label: 'Break-Even Margin', weighted: RE_WEIGHTS.safety * interp(m.breakEven, RE_CURVES.safety), detail: `${fmtPct(m.breakEven)} break-even ratio` },
  ];
  const sorted = [...contributions].sort((a, b) => b.weighted - a.weighted);
  const bullets: string[] = [];
  bullets.push(`Strongest factor: ${sorted[0].label} (${sorted[0].detail}).`);
  const weakest = sorted[sorted.length - 1];
  if (weakest.weighted < 10) {
    bullets.push(`Weakest factor: ${weakest.label} (${weakest.detail}) — this is what's holding the score back.`);
  }
  bullets.push(`Projected monthly cash flow: ${fmtMoney(m.cashFlowMonthly)}.`);
  return bullets;
}

function explainFund(f: FundInputs): string[] {
  const s = computeFundScore(f);
  const contributions = [
    { label: 'Yield', weighted: FUND_WEIGHTS.yield * s.yieldScore, detail: `${fmtPct(f.yield)} distribution yield` },
    { label: 'Expense Ratio', weighted: FUND_WEIGHTS.expense * s.expenseScore, detail: `${fmtPct(f.expense, 2)} expense ratio` },
    { label: 'Growth Potential', weighted: FUND_WEIGHTS.growth * s.growthScore, detail: `${f.growth.toLowerCase()} growth potential` },
    { label: 'Risk Level', weighted: FUND_WEIGHTS.risk * s.riskScore, detail: `${f.risk.toLowerCase()} risk` },
  ];
  const sorted = [...contributions].sort((a, b) => b.weighted - a.weighted);
  const bullets: string[] = [];
  bullets.push(`Strongest factor: ${sorted[0].label} (${sorted[0].detail}).`);
  const weakest = sorted[sorted.length - 1];
  if (weakest.weighted < 10) {
    bullets.push(`Weakest factor: ${weakest.label} (${weakest.detail}) — this is what's holding the score back.`);
  }
  if (f.navErosionRisk) {
    bullets.push('Options-income strategy — high yield can come with NAV erosion over time.');
  }
  return bullets;
}

export function propertyToCandidate(p: PropertyInputs): AllocationCandidate {
  const m = computeMetrics(p);
  return {
    id: p.id,
    kind: 'property',
    name: p.name || 'Untitled property',
    subtitle: `${fmtMoney(p.price, 0)} purchase price · ${fmtPct(p.rate)} rate`,
    composite: m.composite,
    grade: m.grade,
    verdict: m.verdict,
    capitalRequired: m.cashInvested,
    flexible: false,
    annualCashFlowAt: () => m.cashFlowAnnual,
    yieldPct: m.cashInvested > 0 ? (m.cashFlowAnnual / m.cashInvested) * 100 : 0,
    whyBullets: explainProperty(p),
    flags: m.flags,
  };
}

export function fundToCandidate(f: FundInputs): AllocationCandidate {
  const s = computeFundScore(f);
  return {
    id: f.id,
    kind: 'fund',
    name: `${f.ticker} — ${f.name}`,
    subtitle: `${fmtPct(f.yield)} yield · ${f.risk} risk`,
    composite: s.composite,
    grade: s.grade,
    verdict: s.verdict,
    capitalRequired: 0,
    flexible: true,
    annualCashFlowAt: (capitalDeployed: number) => capitalDeployed * (f.yield / 100),
    yieldPct: f.yield,
    whyBullets: explainFund(f),
    flags: f.navErosionRisk ? ['Options-income strategy — possible NAV erosion over time'] : [],
  };
}

export interface AllocationSlice {
  candidate: AllocationCandidate;
  capitalDeployed: number;
  annualCashFlow: number;
}

export interface AllocationPlan {
  capital: number;
  /** All candidates, feasible or not, ranked by composite score descending. */
  ranked: (AllocationCandidate & { feasible: boolean })[];
  /** The single best candidate that fits within the given capital. Undefined if nothing fits. */
  winner?: AllocationCandidate;
  /** Suggested allocation of the full capital: winner plus (optionally) a second slice for leftover cash. */
  allocation: AllocationSlice[];
  totalAnnualCashFlow: number;
  blendedYieldPct: number;
  uninvestedCapital: number;
}

export function buildAllocationPlan(capital: number, candidates: AllocationCandidate[]): AllocationPlan {
  const ranked = [...candidates]
    .map((c) => ({ ...c, feasible: c.capitalRequired <= capital }))
    .sort((a, b) => b.composite - a.composite);

  const winner = ranked.find((c) => c.feasible);

  const allocation: AllocationSlice[] = [];
  let uninvestedCapital = capital;

  if (winner) {
    const deployed = winner.flexible ? capital : winner.capitalRequired;
    allocation.push({ candidate: winner, capitalDeployed: deployed, annualCashFlow: winner.annualCashFlowAt(deployed) });
    uninvestedCapital = capital - deployed;

    // If the winner didn't use all the capital (a fixed-price property, typically),
    // suggest deploying the rest into the next-best candidate that fits the remainder.
    if (uninvestedCapital > 1000) {
      const runnerUp = ranked.find((c) => c.id !== winner.id && c.capitalRequired <= uninvestedCapital);
      if (runnerUp) {
        const runnerDeployed = runnerUp.flexible ? uninvestedCapital : runnerUp.capitalRequired;
        allocation.push({
          candidate: runnerUp,
          capitalDeployed: runnerDeployed,
          annualCashFlow: runnerUp.annualCashFlowAt(runnerDeployed),
        });
        uninvestedCapital -= runnerDeployed;
      }
    }
  }

  const totalAnnualCashFlow = allocation.reduce((sum, slice) => sum + slice.annualCashFlow, 0);
  const deployedCapital = capital - uninvestedCapital;
  const blendedYieldPct = deployedCapital > 0 ? (totalAnnualCashFlow / deployedCapital) * 100 : 0;

  return { capital, ranked, winner, allocation, totalAnnualCashFlow, blendedYieldPct, uninvestedCapital };
}
