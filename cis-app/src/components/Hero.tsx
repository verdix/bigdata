export type TabKey = 'allocator' | 'realestate' | 'funds';

interface HeroProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'allocator', label: 'Portfolio Allocator', icon: '🧮' },
  { key: 'realestate', label: 'Real Estate', icon: '🏠' },
  { key: 'funds', label: 'ETFs & Mutual Funds', icon: '📈' },
];

export default function Hero({ active, onChange }: HeroProps) {
  return (
    <header className="bg-gradient-to-br from-navy to-navy-2 text-white text-center">
      <div className="max-w-3xl mx-auto px-6 py-14">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
          Cash Flow Investment <span className="text-gold">System</span>{' '}
          <span className="text-slate-300 text-2xl md:text-3xl font-semibold">(CIS)</span>
        </h1>
        <p className="text-slate-300 leading-relaxed mb-8">
          One consistent, numbers-first scoring framework for finding your best cash-flowing
          investment — whether it&apos;s a rental property or an income fund. Enter real numbers,
          get a weighted 0–100 score, and rank every candidate side by side.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`px-6 py-3 rounded-lg font-bold text-sm transition-colors cursor-pointer border ${
                active === tab.key
                  ? 'bg-gold border-gold text-navy'
                  : 'bg-white/10 border-white/25 text-slate-100 hover:bg-white/20'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
