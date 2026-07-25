import { useState } from 'react';
import Hero, { type TabKey } from './components/Hero';
import PortfolioAllocator from './components/allocator/PortfolioAllocator';
import HowItWorksRE from './components/realestate/HowItWorksRE';
import PropertyFinder from './components/realestate/PropertyFinder';
import PropertiesSection from './components/realestate/PropertiesSection';
import HowItWorksFunds from './components/funds/HowItWorksFunds';
import FundsGrid from './components/funds/FundsGrid';
import type { FundInputs, PropertyInputs } from './types';
import { blankProperty } from './lib/propertyDefaults';
import { BASE_FUNDS } from './data/fundData';

function App() {
  const [tab, setTab] = useState<TabKey>('allocator');

  const [properties, setProperties] = useState<PropertyInputs[]>(() => [
    blankProperty('Property 1'),
    blankProperty('Property 2'),
  ]);
  const [customFunds, setCustomFunds] = useState<FundInputs[]>([]);

  function updateProperty(id: string, patch: Partial<PropertyInputs>) {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }
  function removeProperty(id: string) {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  }
  function addProperty() {
    setProperties((prev) => [...prev, blankProperty(`Property ${prev.length + 1}`)]);
  }

  function addCustomFund(fund: FundInputs) {
    setCustomFunds((prev) => [...prev, fund]);
  }
  function removeCustomFund(id: string) {
    setCustomFunds((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Hero active={tab} onChange={setTab} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
        {tab === 'allocator' && (
          <PortfolioAllocator properties={properties} funds={[...BASE_FUNDS, ...customFunds]} />
        )}
        {tab === 'realestate' && (
          <>
            <HowItWorksRE />
            <PropertyFinder />
            <PropertiesSection
              properties={properties}
              onUpdate={updateProperty}
              onRemove={removeProperty}
              onAdd={addProperty}
            />
          </>
        )}
        {tab === 'funds' && (
          <>
            <HowItWorksFunds />
            <FundsGrid
              customFunds={customFunds}
              onAddCustomFund={addCustomFund}
              onRemoveCustomFund={removeCustomFund}
            />
          </>
        )}
      </main>

      <footer className="border-t border-line bg-card">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm tracking-[0.2em] uppercase text-gold font-bold">CIS</span>
            <span className="text-sm text-gray">Cash Flow Investment System</span>
          </div>
          <p className="text-xs text-gray leading-relaxed">
            CIS is a decision-support tool, not financial or investment advice. Real estate
            scoring reflects common long-term-rental underwriting conventions (cap rate,
            cash-on-cash return, DSCR, the 1% rule, break-even ratio). Fund yields, expense
            ratios, and risk/growth classifications are approximate as of mid-2026 and will drift
            — always verify current data on the fund provider&apos;s site before investing.
            Property finder links open third-party listing sites (Zillow, Realtor.com) in a new
            tab; CIS doesn&apos;t control or vouch for their listings. Nothing here is a
            recommendation to buy or sell any specific property, ETF, or mutual fund.
          </p>
          <p className="text-xs text-gray mt-4">&copy; {new Date().getFullYear()} CIS.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
