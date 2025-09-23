import { getDistributionColumnDefs } from '@/utils/getDistributionColumnDefs';

describe('getDistributionColumnDefs', () => {
  it('returns 5 columns with correct headers/fields and default sort on Investor', () => {
    const cols = getDistributionColumnDefs();
    expect(cols).toHaveLength(5);

    expect(cols[0].headerName).toBe('Investor Name');
    expect(cols[0].field).toBe('investor');
    expect(cols[0].sortable).toBe(true);
    expect(cols[0].sort).toBe('asc');

    expect(cols[1].headerName).toBe('Entity Name');
    expect(cols[1].field).toBe('entity');
    expect(cols[1].sortable).toBe(true);

    expect(cols[2].headerName).toBe('Description');
    expect(cols[2].field).toBe('description');
    expect(cols[2].sortable).toBe(false);

    expect(cols[3].headerName).toBe('Investment');
    expect(cols[3].field).toBe('investment');
    expect(cols[3].sortable).toBe(false);

    expect(cols[4].headerName).toBe('Amount');
    expect(cols[4].field).toBe('allocatedAmount');
    expect(cols[4].sortable).toBe(true);
  });

  it('Entity Name valueGetter concatenates entityId and entityName', () => {
    const cols = getDistributionColumnDefs();
    const valueGetter = cols[1].valueGetter as (p: {
      data: { entityId?: string; entityName?: string };
    }) => string;
    const res = valueGetter({
      data: { entityId: 'CUST001', entityName: 'ABC Pension Fund LLC' },
    });
    expect(res).toBe('CUST001 - ABC Pension Fund LLC');
  });

  it('Amount valueFormatter formats numbers and returns empty for non-number', () => {
    const cols = getDistributionColumnDefs();
    const valueFormatter = cols[4].valueFormatter as (p: { value?: unknown }) => string;
    expect(valueFormatter({ value: 250000 })).toBe('250,000');
    expect(valueFormatter({ value: undefined })).toBe('');
  });
});
