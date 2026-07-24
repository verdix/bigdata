export type TabKey = 'realestate' | 'funds';

interface TabNavProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'realestate', label: 'Real Estate' },
  { key: 'funds', label: 'ETFs & Mutual Funds' },
];

export default function TabNav({ active, onChange }: TabNavProps) {
  return (
    <nav className="bg-card border-b border-line sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-5 py-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              active === tab.key
                ? 'border-gold text-navy'
                : 'border-transparent text-gray hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
