export function fmtMoney(n: number, decimals = 0): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtPct(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}
