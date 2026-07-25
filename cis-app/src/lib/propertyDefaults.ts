import type { PropertyInputs } from '../types';

let nextId = 1;

export function blankProperty(name: string): PropertyInputs {
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
