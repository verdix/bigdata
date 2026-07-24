import { useState } from 'react';
import { buildRealtorUrl, buildZillowUrl } from '../../lib/deepLinks';

export default function PropertyFinder() {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBeds, setMinBeds] = useState('');
  const [error, setError] = useState('');

  function openLinks() {
    if (!city.trim() || !state.trim()) {
      setError('Enter a city and state to search.');
      return;
    }
    setError('');
    const beds = minBeds ? Number(minBeds) : undefined;
    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;

    window.open(buildZillowUrl(city, state), '_blank');
    window.open(buildRealtorUrl(city, state, beds, min, max), '_blank');
  }

  return (
    <div className="bg-card border border-line rounded-xl p-5">
      <h3 className="font-semibold text-navy mb-1">Find properties in your town</h3>
      <p className="text-xs text-gray mb-4">
        Opens Zillow and Realtor.com search results for the location and filters below in new
        tabs.
      </p>
      <div className="grid sm:grid-cols-5 gap-3 mb-3">
        <input
          className="border border-line rounded-lg px-3 py-2 text-sm sm:col-span-2"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          className="border border-line rounded-lg px-3 py-2 text-sm"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          maxLength={2}
        />
        <input
          className="border border-line rounded-lg px-3 py-2 text-sm"
          placeholder="Min price"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          className="border border-line rounded-lg px-3 py-2 text-sm"
          placeholder="Max price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          className="border border-line rounded-lg px-3 py-2 text-sm w-28"
          placeholder="Min beds"
          type="number"
          value={minBeds}
          onChange={(e) => setMinBeds(e.target.value)}
        />
        <button
          onClick={openLinks}
          className="bg-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-navy-2 cursor-pointer"
        >
          Search Zillow &amp; Realtor.com
        </button>
      </div>
      {error && <p className="text-red text-xs mt-2">{error}</p>}
    </div>
  );
}
