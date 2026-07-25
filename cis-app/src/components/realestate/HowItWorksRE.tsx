import FactorCard, { type Factor } from '../FactorCard';

const FACTORS: Factor[] = [
  { label: 'Cash-on-Cash Return', weightPct: 35, description: 'Annual cash flow ÷ total cash invested — the return on the actual dollars you put in.' },
  { label: 'Cap Rate', weightPct: 20, description: 'Net operating income ÷ purchase price — a financing-independent measure of return.' },
  { label: 'DSCR', weightPct: 15, description: 'Net operating income ÷ annual debt service — how comfortably rent covers the mortgage.' },
  { label: '1% Rule', weightPct: 15, description: 'Monthly rent as a percentage of price — a quick screen for rent-to-price strength.' },
  { label: 'Break-Even Margin', weightPct: 15, description: 'Share of income needed to cover all expenses and debt service — lower means more cushion.' },
];

export default function HowItWorksRE() {
  return <FactorCard title="How the Cash Flow Score is built" factors={FACTORS} />;
}
