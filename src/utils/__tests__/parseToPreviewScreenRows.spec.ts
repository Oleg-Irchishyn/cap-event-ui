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
            account: { defaultDescription: 'Account Desc' },
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

    const allocation = [{ lineItemId: 'mockId', entityId: 'E1', response: [{}] }];

    const rows = parseToPreviewScreenRows(input as unknown, allocation);
    expect(rows).toHaveLength(1);

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
      'mockId-allocatedAmount': '-',
      'mockId-commitment': '-',
      'mockId-investedCapital': '-',
      'mockId-unfunded': '-',
      lineItemId: 'mockId',
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
    expect(rows).toHaveLength(0);
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
    expect(rows).toHaveLength(1);
    expect(rows[0].isAggregated).toBe(true);
  });
});
