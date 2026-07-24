export interface PropertyInputs {
  id: string;
  name: string;
  price: number;
  downPct: number;
  rate: number; // annual interest rate %
  term: number; // years
  rent: number; // monthly gross rent
  taxes: number; // monthly
  insurance: number; // monthly
  hoa: number; // monthly
  maintPct: number; // % of rent
  mgmtPct: number; // % of rent
  vacancyPct: number; // % of rent
  other: number; // monthly, misc
  closing: number; // one-time
  rehab: number; // one-time
}

export interface PropertyMetrics {
  capRate: number;
  coc: number;
  dscr: number;
  onePct: number;
  grm: number;
  breakEven: number;
  cashFlowMonthly: number;
  cashFlowAnnual: number;
  cashInvested: number;
  noiAnnual: number;
  composite: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  verdict: string;
  flags: string[];
}

export type FundCategory = 'divgrowth' | 'covered' | 'reit' | 'bond' | 'intl' | 'balanced';

export type Level = 'Low' | 'Medium' | 'High';

export interface FundInputs {
  id: string;
  ticker: string;
  name: string;
  category: FundCategory;
  yield: number; // %
  expense: number; // %
  growth: Level;
  risk: Level;
  frequency: 'Monthly' | 'Quarterly';
  custom?: boolean;
  navErosionRisk?: boolean; // options-income strategy (e.g. covered calls) that can bleed NAV over time
}

export interface FundScore {
  yieldScore: number;
  expenseScore: number;
  growthScore: number;
  riskScore: number;
  composite: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  verdict: string;
}
