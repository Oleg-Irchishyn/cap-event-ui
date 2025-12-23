export function formatPercents(percents: number) {
  // 1      -> 1.00%
  // 1.5    -> 1.50%
  // 2.5555 -> 2.5555%
  if (!percents) return '-';

  const str = String(percents);

  if (str.includes('.')) {
    const [, decimals] = str.split('.');

    if (decimals.length > 2) {
      return `${percents}%`;
    }
  }

  return `${percents.toFixed(2)}%`;
}
