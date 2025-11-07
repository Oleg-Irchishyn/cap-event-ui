export const defineColumnForAllocationPreview = (allocationBasis: string) => {
  const allocationBasisValue = allocationBasis.toLocaleLowerCase();

  if (allocationBasisValue === 'unfunded') return 'unfunded';
  if (allocationBasisValue.includes('contribution')) return 'investedCapital';
  return 'commitment';
};
