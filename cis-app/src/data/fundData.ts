import type { FundInputs } from '../types';

export const FUND_DATA: Omit<FundInputs, 'id' | 'custom'>[] = [
  { ticker: 'SCHD', name: 'Schwab US Dividend Equity ETF', category: 'divgrowth', yield: 3.1, expense: 0.06, growth: 'High', risk: 'Medium', frequency: 'Quarterly' },
  { ticker: 'VYM', name: 'Vanguard High Dividend Yield ETF', category: 'divgrowth', yield: 2.4, expense: 0.06, growth: 'High', risk: 'Medium', frequency: 'Quarterly' },
  { ticker: 'DGRO', name: 'iShares Core Dividend Growth ETF', category: 'divgrowth', yield: 1.7, expense: 0.08, growth: 'High', risk: 'Medium', frequency: 'Quarterly' },
  { ticker: 'VIG', name: 'Vanguard Dividend Appreciation ETF', category: 'divgrowth', yield: 1.7, expense: 0.06, growth: 'High', risk: 'Medium', frequency: 'Quarterly' },
  { ticker: 'HDV', name: 'iShares Core High Dividend ETF', category: 'divgrowth', yield: 3.3, expense: 0.08, growth: 'Medium', risk: 'Medium', frequency: 'Quarterly' },
  { ticker: 'DVY', name: 'iShares Select Dividend ETF', category: 'divgrowth', yield: 4.2, expense: 0.07, growth: 'Medium', risk: 'Medium', frequency: 'Quarterly' },
  { ticker: 'SPYD', name: 'SPDR Portfolio S&P 500 High Dividend ETF', category: 'divgrowth', yield: 4.1, expense: 0.07, growth: 'Low', risk: 'Medium', frequency: 'Quarterly' },
  { ticker: 'JEPI', name: 'JPMorgan Equity Premium Income ETF', category: 'covered', yield: 8.2, expense: 0.35, growth: 'Low', risk: 'Medium', frequency: 'Monthly', navErosionRisk: true },
  { ticker: 'JEPQ', name: 'JPMorgan Nasdaq Equity Premium Income ETF', category: 'covered', yield: 10.6, expense: 0.35, growth: 'Low', risk: 'High', frequency: 'Monthly', navErosionRisk: true },
  { ticker: 'QYLD', name: 'Global X Nasdaq 100 Covered Call ETF', category: 'covered', yield: 12.0, expense: 0.6, growth: 'Low', risk: 'High', frequency: 'Monthly', navErosionRisk: true },
  { ticker: 'XYLD', name: 'Global X S&P 500 Covered Call ETF', category: 'covered', yield: 10.2, expense: 0.6, growth: 'Low', risk: 'High', frequency: 'Monthly', navErosionRisk: true },
  { ticker: 'DIVO', name: 'Amplify CWP Enhanced Dividend Income ETF', category: 'covered', yield: 4.8, expense: 0.56, growth: 'Medium', risk: 'Medium', frequency: 'Monthly', navErosionRisk: true },
  { ticker: 'VNQ', name: 'Vanguard Real Estate ETF', category: 'reit', yield: 3.4, expense: 0.12, growth: 'Medium', risk: 'Medium', frequency: 'Quarterly' },
  { ticker: 'SCHH', name: 'Schwab US REIT ETF', category: 'reit', yield: 2.8, expense: 0.07, growth: 'Medium', risk: 'Medium', frequency: 'Quarterly' },
  { ticker: 'BND', name: 'Vanguard Total Bond Market ETF', category: 'bond', yield: 4.1, expense: 0.03, growth: 'Low', risk: 'Low', frequency: 'Monthly' },
  { ticker: 'AGG', name: 'iShares Core US Aggregate Bond ETF', category: 'bond', yield: 4.0, expense: 0.03, growth: 'Low', risk: 'Low', frequency: 'Monthly' },
  { ticker: 'HYG', name: 'iShares iBoxx High Yield Corporate Bond ETF', category: 'bond', yield: 5.9, expense: 0.49, growth: 'Low', risk: 'Medium', frequency: 'Monthly' },
  { ticker: 'PFF', name: 'iShares Preferred & Income Securities ETF', category: 'bond', yield: 6.3, expense: 0.46, growth: 'Low', risk: 'Medium', frequency: 'Monthly' },
  { ticker: 'VYMI', name: 'Vanguard International High Div Yield ETF', category: 'intl', yield: 4.0, expense: 0.07, growth: 'Medium', risk: 'Medium', frequency: 'Quarterly' },
  { ticker: 'IDV', name: 'iShares International Select Dividend ETF', category: 'intl', yield: 5.4, expense: 0.49, growth: 'Medium', risk: 'Medium', frequency: 'Quarterly' },
  { ticker: 'VWINX', name: 'Vanguard Wellesley Income Fund', category: 'balanced', yield: 3.5, expense: 0.22, growth: 'Medium', risk: 'Low', frequency: 'Quarterly' },
  { ticker: 'VDIGX', name: 'Vanguard Dividend Growth Fund', category: 'balanced', yield: 1.7, expense: 0.29, growth: 'High', risk: 'Medium', frequency: 'Quarterly' },
];

export const CATEGORY_LABELS: Record<string, string> = {
  divgrowth: 'Dividend Growth',
  covered: 'Covered Call / High Income',
  reit: 'REIT',
  bond: 'Bond / Fixed Income',
  intl: 'International Dividend',
  balanced: 'Balanced Mutual Fund',
};
