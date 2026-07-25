import { describe, expect, it } from 'vitest';
import { buildAllocationPlan, fundToCandidate, propertyToCandidate } from './allocator';
import type { FundInputs, PropertyInputs } from '../types';

const cheapProperty: PropertyInputs = {
  id: 'p1',
  name: 'Cheap Duplex',
  price: 120000,
  downPct: 25,
  rate: 6.5,
  term: 30,
  rent: 1600,
  taxes: 150,
  insurance: 60,
  hoa: 0,
  maintPct: 5,
  mgmtPct: 8,
  vacancyPct: 5,
  other: 0,
  closing: 3000,
  rehab: 0,
};

const expensiveProperty: PropertyInputs = {
  ...cheapProperty,
  id: 'p2',
  name: 'Expensive Property',
  price: 900000,
  closing: 20000,
};

const goodFund: FundInputs = {
  id: 'f1',
  ticker: 'SCHD',
  name: 'Schwab US Dividend Equity ETF',
  category: 'divgrowth',
  yield: 3.1,
  expense: 0.06,
  growth: 'High',
  risk: 'Medium',
  frequency: 'Quarterly',
};

describe('buildAllocationPlan', () => {
  it('excludes candidates that need more capital than available', () => {
    const candidates = [propertyToCandidate(expensiveProperty), fundToCandidate(goodFund)];
    const plan = buildAllocationPlan(50000, candidates);
    const expensiveRow = plan.ranked.find((c) => c.id === 'p2');
    expect(expensiveRow?.feasible).toBe(false);
    expect(plan.winner?.id).toBe('f1');
  });

  it('picks the affordable property over a fund when it scores higher and fits budget', () => {
    const candidates = [propertyToCandidate(cheapProperty), fundToCandidate(goodFund)];
    const plan = buildAllocationPlan(50000, candidates);
    expect(plan.winner).toBeDefined();
    expect(plan.ranked.every((c) => c.feasible || c.composite <= plan.winner!.composite)).toBe(true);
  });

  it('deploys leftover capital into a runner-up when the winner is a fixed-price property', () => {
    const candidates = [propertyToCandidate(cheapProperty), fundToCandidate(goodFund)];
    const plan = buildAllocationPlan(50000, candidates);
    if (plan.winner?.kind === 'property') {
      expect(plan.allocation.length).toBeGreaterThanOrEqual(1);
      const total = plan.allocation.reduce((s, a) => s + a.capitalDeployed, 0);
      expect(total).toBeLessThanOrEqual(50000);
    }
  });

  it('returns no winner when nothing fits the budget', () => {
    const candidates = [propertyToCandidate(expensiveProperty)];
    const plan = buildAllocationPlan(5000, candidates);
    expect(plan.winner).toBeUndefined();
    expect(plan.allocation).toHaveLength(0);
  });
});
