const TRUST_ITEMS = ['Free to use', 'No signup required', 'Runs entirely in your browser'];

export default function Hero() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-navy to-navy-2 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(#c9a13b 1px, transparent 1px), linear-gradient(90deg, #c9a13b 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="text-sm tracking-[0.2em] uppercase text-gold font-semibold mb-3">
          CIS · Cash Flow Investment System
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
          Find your best cash-flowing investment,
          <br className="hidden md:block" /> backed by the numbers.
        </h1>
        <p className="max-w-2xl text-slate-300 leading-relaxed text-base md:text-lg mb-6">
          One consistent, numbers-first scoring framework for rental properties and income
          funds. Enter real numbers, get a weighted 0–100 score, and rank every candidate side
          by side.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {TRUST_ITEMS.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
