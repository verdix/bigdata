import type { FundInputs, FundScore, Level, PropertyInputs, PropertyMetrics } from '../types';

export function interp(x: number, pts: [number, number][]): number {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    if (x >= x0 && x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return pts[pts.length - 1][1];
}

// ---------- Real Estate ----------

export const RE_CURVES = {
  coc: [[-100, 0], [0, 15], [4, 45], [8, 75], [12, 95], [20, 100]] as [number, number][],
  cap: [[0, 0], [3, 30], [5, 55], [7, 80], [9, 95], [12, 100]] as [number, number][],
  dscr: [[0, 0], [1.0, 40], [1.25, 70], [1.5, 90], [1.75, 100]] as [number, number][],
  onePct: [[0, 0], [0.5, 30], [0.7, 55], [0.8, 70], [1.0, 90], [1.2, 100]] as [number, number][],
  safety: [[50, 100], [65, 90], [75, 75], [85, 55], [95, 30], [110, 0]] as [number, number][], // breakeven ratio, lower is better
};

export const RE_WEIGHTS = { coc: 0.35, cap: 0.2, dscr: 0.15, onePct: 0.15, safety: 0.15 };

function calcMortgage(loan: number, annualRatePct: number, years: number): number {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (n <= 0) return 0;
  if (r === 0) return loan / n;
  const pow = Math.pow(1 + r, n);
  return (loan * r * pow) / (pow - 1);
}

export function computeMetrics(v: PropertyInputs): PropertyMetrics {
  const down = v.price * (v.downPct / 100);
  const loan = v.price - down;
  const pi = calcMortgage(loan, v.rate, v.term);

  const vacancyLoss = v.rent * (v.vacancyPct / 100);
  const maint = v.rent * (v.maintPct / 100);
  const mgmt = v.rent * (v.mgmtPct / 100);
  const opex = v.taxes + v.insurance + v.hoa + maint + mgmt + v.other;

  const egi = v.rent - vacancyLoss; // effective gross income
  const noiMonthly = egi - opex; // NOI excludes debt service
  const noiAnnual = noiMonthly * 12;
  const annualDebtService = pi * 12;

  const cashFlowMonthly = noiMonthly - pi;
  const cashFlowAnnual = cashFlowMonthly * 12;
  const cashInvested = down + v.closing + v.rehab;

  const capRate = v.price > 0 ? (noiAnnual / v.price) * 100 : 0;
  const coc = cashInvested > 0 ? (cashFlowAnnual / cashInvested) * 100 : 0;
  const dscr = annualDebtService > 0 ? noiAnnual / annualDebtService : 0;
  const onePct = v.price > 0 ? (v.rent / v.price) * 100 : 0;
  const grm = v.rent * 12 > 0 ? v.price / (v.rent * 12) : 0;
  const breakEven = egi > 0 ? ((opex + annualDebtService / 12) / egi) * 100 : 999;

  let composite =
    RE_WEIGHTS.coc * interp(coc, RE_CURVES.coc) +
    RE_WEIGHTS.cap * interp(capRate, RE_CURVES.cap) +
    RE_WEIGHTS.dscr * interp(dscr, RE_CURVES.dscr) +
    RE_WEIGHTS.onePct * interp(onePct, RE_CURVES.onePct) +
    RE_WEIGHTS.safety * interp(breakEven, RE_CURVES.safety);

  const flags: string[] = [];
  if (cashFlowMonthly < 0) {
    composite = Math.min(composite, 30);
    flags.push('Negative monthly cash flow');
  }
  if (dscr < 1.0 && cashFlowMonthly >= 0) {
    composite = Math.min(composite, 50);
    flags.push('DSCR below 1.0 — may not qualify for financing');
  }
  if (breakEven > 95) flags.push('Thin margin — little cushion for vacancy or repairs');

  composite = Math.max(0, Math.min(100, composite));

  const grade =
    composite >= 85 ? 'A' : composite >= 70 ? 'B' : composite >= 55 ? 'C' : composite >= 40 ? 'D' : 'F';
  const verdict = { A: 'Strong Buy', B: 'Buy', C: 'Consider', D: 'Marginal', F: 'Pass' }[grade];

  return {
    capRate,
    coc,
    dscr,
    onePct,
    grm,
    breakEven,
    cashFlowMonthly,
    cashFlowAnnual,
    cashInvested,
    noiAnnual,
    composite,
    grade,
    verdict,
    flags,
  };
}

// ---------- Funds ----------

export const FUND_CURVES = {
  yieldC: [[0, 0], [2, 30], [4, 55], [6, 75], [8, 88], [10, 96], [14, 100]] as [number, number][],
  expenseC: [[0, 100], [0.1, 95], [0.2, 85], [0.35, 70], [0.5, 55], [0.65, 40], [1.0, 15]] as [
    number,
    number,
  ][], // lower expense = higher score
};

const GROWTH_SCORE: Record<Level, number> = { Low: 30, Medium: 65, High: 100 };
const RISK_SCORE: Record<Level, number> = { Low: 100, Medium: 65, High: 30 }; // lower risk = higher score

export const FUND_WEIGHTS = { yield: 0.45, expense: 0.2, growth: 0.2, risk: 0.15 };

export function computeFundScore(f: FundInputs): FundScore {
  const yieldScore = interp(f.yield, FUND_CURVES.yieldC);
  const expenseScore = interp(f.expense, FUND_CURVES.expenseC);
  const growthScore = GROWTH_SCORE[f.growth];
  const riskScore = RISK_SCORE[f.risk];

  let composite =
    FUND_WEIGHTS.yield * yieldScore +
    FUND_WEIGHTS.expense * expenseScore +
    FUND_WEIGHTS.growth * growthScore +
    FUND_WEIGHTS.risk * riskScore;

  composite = Math.max(0, Math.min(100, composite));

  const grade =
    composite >= 85 ? 'A' : composite >= 70 ? 'B' : composite >= 55 ? 'C' : composite >= 40 ? 'D' : 'F';
  const verdict = {
    A: 'Strong Income Pick',
    B: 'Solid Income Holding',
    C: 'Worth Considering',
    D: 'Marginal',
    F: 'Yield-Trap Risk',
  }[grade];

  return { yieldScore, expenseScore, growthScore, riskScore, composite, grade, verdict };
}
