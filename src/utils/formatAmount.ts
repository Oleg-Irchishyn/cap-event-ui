export const formatAmount = (amount: number) => {
  if (amount === 0) return '0.00';
  if (!amount) return '-';

  const formattedAmount = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return amount < 0 ? `(${formattedAmount})` : formattedAmount;
};
