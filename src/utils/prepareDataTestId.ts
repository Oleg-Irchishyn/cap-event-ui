export const prepareDataTestId = (prefix = '', name = '', suffix = '') =>
  [prefix, name, suffix].join(' ').trim().replace(/\s+/g, '-').replace(/\n/g, '');
