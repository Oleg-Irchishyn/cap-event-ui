import {
  getPreviewScreenColumnDefs,
  getTopGridColumnDefs,
  TruncatedThreeLineHeader,
} from '@/utils/getPreviewScreenColumnDefs';
import {
  ENTITY_ID_HEADER,
  ENTITY_NAME_HEADER,
  INVESTOR_ID_HEADER,
  INVESTOR_NAME_HEADER,
  INVESTOR_TYPE_I_HEADER,
  INVESTOR_TYPE_II_HEADER,
  TOTAL_AMOUNT_DUE_HEADER,
  TOTAL_CAPITAL_COMMITMENT_HEADER,
  AMOUNT_FIELD,
  COMMITMENT_FIELD,
  ENTITY_ID_FIELD,
  ENTITY_NAME_FIELD,
  INVESTOR_ID_FIELD,
  INVESTOR_NAME_FIELD,
  INVESTOR_TYPE_I_FIELD,
  INVESTOR_TYPE_II_FIELD,
  EMPTY_INVESTOR_TYPE_ONE_VALUE,
  EMPTY_INVESTOR_TYPE_TWO_VALUE,
} from '@/const/previewScreen';
import type { LineItemRow } from '@/app/new/LineItems/types';

describe('getPreviewScreenColumnDefs', () => {
  it('returns 8 columns with correct headers/fields and default multi-sort', () => {
    const cols = getPreviewScreenColumnDefs();
    expect(cols).toHaveLength(6);

    expect(cols[0].headerName).toBe(ENTITY_ID_HEADER);
    expect(cols[0].field).toBe(ENTITY_ID_FIELD);
    expect(cols[0].sortable).toBe(true);
    expect(cols[0].sort).toBe('asc');
    expect(cols[0].sortIndex).toBe(0);

    expect(cols[1].headerName).toBe(ENTITY_NAME_HEADER);
    expect(cols[1].field).toBe(ENTITY_NAME_FIELD);
    expect(cols[1].sortable).toBe(true);

    expect(cols[2].headerName).toBe(INVESTOR_ID_HEADER);
    expect(cols[2].field).toBe(INVESTOR_ID_FIELD);
    expect(cols[2].sortable).toBe(true);
    expect(cols[2].sort).toBe('asc');
    expect(cols[2].sortIndex).toBe(1);

    expect(cols[3].headerName).toBe(INVESTOR_NAME_HEADER);
    expect(cols[3].field).toBe(INVESTOR_NAME_FIELD);
    expect(cols[3].sortable).toBe(true);

    expect(cols[4].headerName).toBe(INVESTOR_TYPE_I_HEADER);
    expect(cols[4].field).toBe(INVESTOR_TYPE_I_FIELD);
    expect(cols[4].sortable).toBe(true);

    expect(cols[5].headerName).toBe(INVESTOR_TYPE_II_HEADER);
    expect(cols[5].field).toBe(INVESTOR_TYPE_II_FIELD);
    expect(cols[5].sortable).toBe(true);
  });

  it('Investor Type I valueGetter returns configured empty value when empty', () => {
    const cols = getPreviewScreenColumnDefs();
    const valueGetter = cols[4].valueGetter as (p: { data: { classID?: string } }) => string;
    expect(valueGetter({ data: { classID: 'Type A' } })).toBe('Type A');
    expect(valueGetter({ data: { classID: '' } })).toBe(EMPTY_INVESTOR_TYPE_ONE_VALUE);
    expect(valueGetter({ data: { classID: '   ' } })).toBe(EMPTY_INVESTOR_TYPE_ONE_VALUE);
    expect(valueGetter({ data: { classID: undefined } })).toBe(EMPTY_INVESTOR_TYPE_ONE_VALUE);
    expect(valueGetter({ data: {} })).toBe(EMPTY_INVESTOR_TYPE_ONE_VALUE);
  });

  it('Investor Type II valueGetter returns configured empty value when empty', () => {
    const cols = getPreviewScreenColumnDefs();
    const valueGetter = cols[5].valueGetter as (p: {
      data: { additionalInvestorType?: string };
    }) => string;
    expect(valueGetter({ data: { additionalInvestorType: 'Type B' } })).toBe('Type B');
    expect(valueGetter({ data: { additionalInvestorType: '' } })).toBe(
      EMPTY_INVESTOR_TYPE_TWO_VALUE,
    );
    expect(valueGetter({ data: { additionalInvestorType: '   ' } })).toBe(
      EMPTY_INVESTOR_TYPE_TWO_VALUE,
    );
    expect(valueGetter({ data: { additionalInvestorType: undefined } })).toBe(
      EMPTY_INVESTOR_TYPE_TWO_VALUE,
    );
    expect(valueGetter({ data: {} })).toBe(EMPTY_INVESTOR_TYPE_TWO_VALUE);
  });
});

describe('getTopGridColumnDefs', () => {
  const lineItems: [
    string,
    Array<{
      id: string;
      defaultDescription: string;
      callDistributionReason: string;
      investment: { name: string };
    }>,
  ][] = [
    [
      'Entity 1',
      [
        {
          id: 'li-1',
          defaultDescription: 'Desc 1',
          callDistributionReason: 'Reason 1',
          investment: { name: 'Investment 1' },
        },
      ],
    ],
    [
      'Entity 2',
      [
        {
          id: 'li-2',
          defaultDescription: 'Desc 2',
          callDistributionReason: 'Reason 2',
          investment: { name: 'Investment 2' },
        },
      ],
    ],
  ];

  it('builds combined columns, dynamic top columns per line item, and total columns', () => {
    const cols = getTopGridColumnDefs(lineItems as unknown as [string, LineItemRow[]][], false);

    expect(cols.length).toBe(8);

    expect(cols[0].headerName).toBe('General Info');
    expect(cols[0].field).toBe('generalInfo');
    expect(cols[1].headerName).toBe('Titles');
    expect(cols[1].field).toBe('lineItemsFields');

    const dynLi1Alloc = cols.find((c) => c.colId === 'li-1-allocation');
    const dynLi1Title = cols.find((c) => c.colId === 'li-1-lineItem');
    expect(dynLi1Alloc?.field).toBe('li-1-allocation');
    expect(dynLi1Title?.field).toBe('li-1');

    const dynLi2Alloc = cols.find((c) => c.colId === 'li-2-allocation');
    const dynLi2Title = cols.find((c) => c.colId === 'li-2-lineItem');
    expect(dynLi2Alloc?.field).toBe('li-2-allocation');
    expect(dynLi2Title?.field).toBe('li-2');

    const lastTwo = cols.slice(-2);
    expect(lastTwo[0].headerName).toBe(TOTAL_CAPITAL_COMMITMENT_HEADER);
    expect(lastTwo[0].field).toBe(COMMITMENT_FIELD);
    expect(lastTwo[1].headerName).toBe(TOTAL_AMOUNT_DUE_HEADER);
    expect(lastTwo[1].field).toBe(AMOUNT_FIELD);
  });

  it('sets loading renderers when isLoading is true', () => {
    const cols = getTopGridColumnDefs(lineItems as unknown as [string, LineItemRow[]][], true);
    expect(cols[0].cellRenderer).toBeDefined();
    expect(cols[1].cellRenderer).toBeDefined();
  });
});

describe('getDynamicColumnsDefs and TruncatedThreeLineHeader', () => {
  const lineItems: [string, LineItemRow[]][] = [
    [
      'Entity 1',
      [
        {
          id: 'li-1',
          defaultDescription: 'Test Description',
          callDistributionReason: 'Test Reason',
          investment: { name: 'Test Investment' },
          allocationBasis: 'Capital Commitment',
          isMfLineItem: false,
        } as LineItemRow,
      ],
    ],
  ];

  it('sets TruncatedThreeLineHeader as headerComponent for line item columns', () => {
    const cols = getTopGridColumnDefs(lineItems, false);

    const lineItemColumn = cols.find((c) => c.colId === 'li-1-lineItem');

    expect(lineItemColumn).toBeDefined();
    expect(lineItemColumn?.headerComponent).toBe(TruncatedThreeLineHeader);
  });

  it('passes correct headerComponentParams to TruncatedThreeLineHeader', () => {
    const cols = getTopGridColumnDefs(lineItems, false);

    const lineItemColumn = cols.find((c) => c.colId === 'li-1-lineItem');

    expect(lineItemColumn?.headerComponentParams).toEqual({
      defaultDescription: 'Test Description',
      callDistributionReason: 'Test Reason',
      investmentTitle: 'Test Investment',
    });
  });

  it('handles investment as string in headerComponentParams', () => {
    const lineItemsWithStringInvestment: [string, LineItemRow[]][] = [
      [
        'Entity 1',
        [
          {
            id: 'li-2',
            defaultDescription: 'Desc',
            callDistributionReason: 'Reason',
            investment: 'String Investment Name',
            allocationBasis: 'Capital Commitment',
            isMfLineItem: false,
          } as LineItemRow,
        ],
      ],
    ];

    const cols = getTopGridColumnDefs(lineItemsWithStringInvestment, false);
    const lineItemColumn = cols.find((c) => c.colId === 'li-2-lineItem');

    expect(lineItemColumn?.headerComponentParams?.investmentTitle).toBe('String Investment Name');
  });
});
