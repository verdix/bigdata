import { useState } from 'react';
import Hero from './components/Hero';
import TabNav, { type TabKey } from './components/TabNav';
import HowItWorksRE from './components/realestate/HowItWorksRE';
import PropertyFinder from './components/realestate/PropertyFinder';
import PropertiesSection from './components/realestate/PropertiesSection';
import HowItWorksFunds from './components/funds/HowItWorksFunds';
import FundsGrid from './components/funds/FundsGrid';

function App() {
  const [tab, setTab] = useState<TabKey>('realestate');

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <TabNav active={tab} onChange={setTab} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
        {tab === 'realestate' ? (
          <>
            <HowItWorksRE />
            <PropertyFinder />
            <PropertiesSection />
          </>
        ) : (
          <>
            <HowItWorksFunds />
            <FundsGrid />
          </>
        )}
      </main>

      <footer className="border-t border-line bg-card">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-gray leading-relaxed">
          CIS is a decision-support tool, not financial or investment advice. Real estate scoring
          reflects common long-term-rental underwriting conventions (cap rate, cash-on-cash
          return, DSCR, the 1% rule, break-even ratio). Fund yields, expense ratios, and
          risk/growth classifications are approximate as of mid-2026 and will drift — always
          verify current data on the fund provider&apos;s site before investing. Property finder
          links open third-party listing sites (Zillow, Realtor.com) in a new tab; CIS
          doesn&apos;t control or vouch for their listings. Nothing here is a recommendation to
          buy or sell any specific property, ETF, or mutual fund.
        </div>
      </footer>
    </div>
  );
}

export default App;
