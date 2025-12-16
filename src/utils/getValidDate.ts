export const getValidDate = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === 'string') {
    // Parse date strings like 'YYYY-MM-DD' as local dates, not UTC
    // This prevents timezone-related issues when parsing date-only strings
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      // Parse as local date to avoid UTC interpretation
      const [year, month, day] = value.split('-').map(Number);
      const parsed = new Date(year, month - 1, day);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    // For other date string formats, use standard Date parsing
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};
