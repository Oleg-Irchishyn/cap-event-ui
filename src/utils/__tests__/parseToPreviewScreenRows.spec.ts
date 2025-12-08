import { parseToPreviewScreenRows } from '@/utils/parseToPreviewScreenRows';

describe('parseToPreviewScreenRows', () => {
  test('returns empty array for non-array input', () => {
    expect(parseToPreviewScreenRows(null as unknown as [])).toEqual([]);
    expect(parseToPreviewScreenRows(undefined as unknown as [])).toEqual([]);
    expect(parseToPreviewScreenRows({} as unknown as [])).toEqual([]);
  });

  test('maps entries to DistributionRow with composed id and fallbacks', () => {
    const input = [
      {
        entity: { id: 'E1', name: 'Entity One' },
        plInvestorEntries: [
          {
            customerId: 'C1',
            investor: 'INV1',
            allocatedAmount: 100,
            isAggregated: true,
            account: { description: 'Account Desc' },
            investment: { title: 'Investment T', name: 'Investment N' },
          },
          {
            customerId: 'C2',
            investor: '',
            allocatedAmount: undefined,
            isAggregated: false,
            account: null,
            investment: null,
          },
        ],
      },
    ];

    const rows = parseToPreviewScreenRows(input as unknown);
    expect(rows).toHaveLength(2);

    expect(rows[0]).toEqual({
      id: 'E1-0-C1-INV1-0',
      investor: 'INV1',
      investorId: 'C1',
      investorName: '',
      classID: '',
      additionalInvestorType: '',
      entityId: 'E1',
      entityName: 'Entity One',
      description: 'Account Desc',
      investmentTitle: 'Investment T',
      investmentName: 'Investment N',
      dataPoints: undefined,
      commitment: 0,
      allocatedAmount: 100,
      isAggregated: true,
    });

    expect(rows[1]).toEqual({
      id: 'E1-0-C2--1',
      investor: '',
      investorId: 'C2',
      investorName: '',
      classID: '',
      additionalInvestorType: '',
      entityId: 'E1',
      entityName: 'Entity One',
      description: '',
      investmentTitle: '',
      investmentName: '',
      dataPoints: undefined,
      commitment: 0,
      allocatedAmount: 0,
      isAggregated: false,
    });
  });

  test('handles missing nested fields gracefully', () => {
    const input = [
      {
        entity: undefined,
        plInvestorEntries: [
          {
            customerId: undefined,
            investor: undefined,
            allocatedAmount: undefined,
            isAggregated: undefined,
            account: undefined,
            investment: undefined,
          },
        ],
      },
    ];

    const rows = parseToPreviewScreenRows(input as unknown);
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe('-0---0');
    expect(rows[0].investor).toBe('');
    expect(rows[0].investorId).toBe('');
    expect(rows[0].investorName).toBe('');
    expect(rows[0].classID).toBe('');
    expect(rows[0].additionalInvestorType).toBe('');
    expect(rows[0].entityId).toBe('');
    expect(rows[0].entityName).toBe('');
    expect(rows[0].description).toBe('');
    expect(rows[0].investmentTitle).toBe('');
    expect(rows[0].investmentName).toBe('');
    expect(rows[0].dataPoints).toBe(undefined);
    expect(rows[0].allocatedAmount).toBe(0);
    expect(rows[0].isAggregated).toBe(false);
  });

  test('handles isAggregated field correctly', () => {
    const input = [
      {
        entity: { id: 'E1', name: 'Entity One' },
        plInvestorEntries: [
          {
            customerId: 'C1',
            investor: 'INV1',
            allocatedAmount: 100,
            isAggregated: true,
            account: { description: 'Account Desc' },
            investment: { title: 'Investment T', name: 'Investment N' },
          },
          {
            customerId: 'C2',
            investor: 'INV2',
            allocatedAmount: 200,
            isAggregated: false,
            account: { description: 'Account Desc' },
            investment: { title: 'Investment T', name: 'Investment N' },
          },
          {
            customerId: 'C3',
            investor: 'INV3',
            allocatedAmount: 300,
            account: { description: 'Account Desc' },
            investment: { title: 'Investment T', name: 'Investment N' },
          }, // missing isAggregated
        ],
      },
    ];

    const rows = parseToPreviewScreenRows(input as unknown);
    expect(rows).toHaveLength(3);
    expect(rows[0].isAggregated).toBe(true);
    expect(rows[1].isAggregated).toBe(false);
    expect(rows[2].isAggregated).toBe(false); // defaults to false when missing
  });
});
