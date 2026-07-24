function slugify(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, '-');
}

export function buildZillowUrl(city: string, state: string): string {
  const slug = `${slugify(city)}-${state.trim().toLowerCase()}`;
  return `https://www.zillow.com/homes/for_sale/${slug}_rb/`;
}

export function buildRealtorUrl(
  city: string,
  state: string,
  minBeds?: number,
  minPrice?: number,
  maxPrice?: number,
): string {
  const citySlug = city.trim().replace(/\s+/g, '-');
  let url = `https://www.realtor.com/realestateandhomes-search/${citySlug}_${state.trim().toUpperCase()}`;
  if (minBeds) url += `/beds-${minBeds}`;
  if (minPrice && maxPrice) url += `/price-${minPrice}-${maxPrice}`;
  return url;
}
