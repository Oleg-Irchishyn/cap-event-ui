import { getAllocationPreviewColumnDefs } from '@/utils/getAllocationPreviewColumnDefs';
import {
  INVESTOR_ID_HEADER,
  INVESTOR_NAME_HEADER,
  INVESTOR_CLASS_ID_HEADER,
  INVESTOR_ADDITIONAL_TYPE_HEADER,
  ALLOCATED_AMOUNT_HEADER,
  MANAGEMENT_FEE_HEADER,
  MANAGEMENT_FEE_PERCENT_HEADER,
  COMMITMENT_HEADER,
  INVESTOR_ID_FIELD,
  INVESTOR_NAME_FIELD,
  INVESTOR_CLASS_ID_FIELD,
  INVESTOR_ADDITIONAL_TYPE_FIELD,
  ALLOCATED_AMOUNT_FIELD,
  MANAGEMENT_FEE_PERCENT_FIELD,
  MANAGEMENT_FEE_FIELD,
  EMPTY_INVESTOR_CLASS_ID_FIELD_VALUE,
  EMPTY_INVESTOR_ADDITIONAL_TYPE_FIELD_VALUE,
  UNFUNDED,
  INVESTED_CAPITAL,
} from '@/const/allocationPreview';

describe('getAllocationPreviewColumnDefs', () => {
  it('returns 6 columns with correct headers/fields when allocationBasis is not Management Fee', () => {
    const fieldName = UNFUNDED;
    const cols = getAllocationPreviewColumnDefs(fieldName, INVESTED_CAPITAL);
    expect(cols).toHaveLength(6);

    // 1) Investor ID
    expect(cols[0].headerName).toBe(INVESTOR_ID_HEADER);
    expect(cols[0].field).toBe(INVESTOR_ID_FIELD);
    expect(cols[0].sortable).toBe(true);
    expect(cols[0].sort).toBe('asc');

    // 2) Investor Name
    expect(cols[1].headerName).toBe(INVESTOR_NAME_HEADER);
    expect(cols[1].field).toBe(INVESTOR_NAME_FIELD);
    expect(cols[1].sortable).toBe(true);

    // 3) Investor Type I
    expect(cols[2].headerName).toBe(INVESTOR_CLASS_ID_HEADER);
    expect(cols[2].field).toBe(INVESTOR_CLASS_ID_FIELD);
    expect(cols[2].sortable).toBe(false);

    // 4) Investor Type II
    expect(cols[3].headerName).toBe(INVESTOR_ADDITIONAL_TYPE_HEADER);
    expect(cols[3].field).toBe(INVESTOR_ADDITIONAL_TYPE_FIELD);
    expect(cols[3].sortable).toBe(false);

    // 5) Dynamic column uses passed in fieldName and allocationBasis label
    expect(cols[4].headerName).toBe(INVESTED_CAPITAL);
    expect(cols[4].field).toBe(fieldName);

    // 6) Allocated Amount
    expect(cols[5].headerName).toBe(ALLOCATED_AMOUNT_HEADER);
    expect(cols[5].field).toBe(ALLOCATED_AMOUNT_FIELD);
    expect(cols[5].sortable).toBe(false);
  });

  it('inserts Management Fee columns when allocationBasis is Management Fee', () => {
    const fieldName = UNFUNDED;
    const cols = getAllocationPreviewColumnDefs(fieldName, MANAGEMENT_FEE_HEADER);
    expect(cols).toHaveLength(8);

    // Dynamic column label becomes Commitment when allocationBasis is Management Fee
    expect(cols[4].headerName).toBe(COMMITMENT_HEADER);
    expect(cols[4].field).toBe(fieldName);

    // Inserted columns after dynamic column
    expect(cols[5].headerName).toBe(MANAGEMENT_FEE_PERCENT_HEADER);
    expect(cols[5].field).toBe(MANAGEMENT_FEE_PERCENT_FIELD);

    expect(cols[6].headerName).toBe(MANAGEMENT_FEE_HEADER);
    expect(cols[6].field).toBe(MANAGEMENT_FEE_FIELD);

    // Allocated Amount remains last
    expect(cols[7].headerName).toBe(ALLOCATED_AMOUNT_HEADER);
  });

  it('Investor Type II valueGetter returns "-" when empty/whitespace/undefined', () => {
    const cols = getAllocationPreviewColumnDefs(UNFUNDED, INVESTED_CAPITAL);
    const valueGetter = cols[3].valueGetter as (p: {
      data: { additionalInvestorType?: string };
      node?: { rowPinned?: boolean };
    }) => string;

    expect(valueGetter({ data: { additionalInvestorType: 'Type B' } })).toBe('Type B');
    expect(valueGetter({ data: { additionalInvestorType: '' } })).toBe(
      EMPTY_INVESTOR_ADDITIONAL_TYPE_FIELD_VALUE,
    );
    expect(valueGetter({ data: { additionalInvestorType: '   ' } })).toBe(
      EMPTY_INVESTOR_ADDITIONAL_TYPE_FIELD_VALUE,
    );
    expect(valueGetter({ data: { additionalInvestorType: undefined } })).toBe(
      EMPTY_INVESTOR_ADDITIONAL_TYPE_FIELD_VALUE,
    );
    expect(valueGetter({ data: {} as { additionalInvestorType?: string } })).toBe(
      EMPTY_INVESTOR_ADDITIONAL_TYPE_FIELD_VALUE,
    );

    // Pinned rows return empty string regardless
    expect(valueGetter({ data: { additionalInvestorType: '' }, node: { rowPinned: true } })).toBe(
      '',
    );
  });

  it('Investor Type I valueGetter returns configured empty value when empty', () => {
    const cols = getAllocationPreviewColumnDefs(UNFUNDED, INVESTED_CAPITAL);
    const valueGetter = cols[2].valueGetter as (p: {
      data: { classID?: string };
      node?: { rowPinned?: boolean };
    }) => string;
    expect(valueGetter({ data: { classID: 'Type A' } })).toBe('Type A');
    expect(valueGetter({ data: { classID: '' } })).toBe(EMPTY_INVESTOR_CLASS_ID_FIELD_VALUE);
    expect(valueGetter({ data: { classID: '   ' } })).toBe(EMPTY_INVESTOR_CLASS_ID_FIELD_VALUE);
    expect(valueGetter({ data: { classID: undefined } })).toBe(EMPTY_INVESTOR_CLASS_ID_FIELD_VALUE);
    expect(valueGetter({ data: {} as { classID?: string } })).toBe(
      EMPTY_INVESTOR_CLASS_ID_FIELD_VALUE,
    );

    // Pinned rows return empty string regardless
    expect(valueGetter({ data: { classID: '' }, node: { rowPinned: true } })).toBe('');
  });

  it('Dynamic amount column valueGetter formats via formatAmount', () => {
    const fieldName = UNFUNDED;
    const cols = getAllocationPreviewColumnDefs(fieldName, INVESTED_CAPITAL);
    const valueGetter = cols[4].valueGetter as (p: {
      data: { [key: string]: number | undefined };
    }) => string;

    expect(valueGetter({ data: { [fieldName]: 250000 } })).toBe('250,000.00');
    expect(valueGetter({ data: { [fieldName]: -100000 } })).toBe('(100,000.00)');
    expect(valueGetter({ data: { [fieldName]: 0 } })).toBe('0.00');
    expect(valueGetter({ data: { [fieldName]: undefined } })).toBe('-');
    expect(valueGetter({ data: {} as Record<string, number | undefined> })).toBe('-');
  });

  it('Allocated Amount valueGetter respects trType inversion and formats', () => {
    const cols = getAllocationPreviewColumnDefs(UNFUNDED, INVESTED_CAPITAL);
    const allocatedCol = cols.find((c) => c.headerName === ALLOCATED_AMOUNT_HEADER)!;
    const valueGetter = allocatedCol.valueGetter as (p: {
      data: { allocatedAmount?: number; trType?: number };
    }) => string;

    // Normal positive
    expect(valueGetter({ data: { allocatedAmount: 1234.5, trType: 1 } })).toBe('1,234.50');
    // Inverted by trType === -1
    expect(valueGetter({ data: { allocatedAmount: 100, trType: -1 } })).toBe('(100.00)');
    // Zero
    expect(valueGetter({ data: { allocatedAmount: 0, trType: 1 } })).toBe('0.00');
    // Undefined
    expect(valueGetter({ data: { allocatedAmount: undefined } })).toBe('-');
  });

  it('Investor ID and Name default to "-" when missing; pinned name empty string', () => {
    const cols = getAllocationPreviewColumnDefs(UNFUNDED, INVESTED_CAPITAL);
    const idGetter = cols[0].valueGetter as (p: { data: { customerId?: string } }) => string;
    const nameGetter = cols[1].valueGetter as (p: {
      data: { customerName?: string };
      node?: { rowPinned?: boolean };
    }) => string;

    expect(idGetter({ data: { customerId: undefined } })).toBe('-');
    expect(nameGetter({ data: { customerName: undefined } })).toBe('-');

    // Pinned row shows empty for name
    expect(nameGetter({ data: { customerName: undefined }, node: { rowPinned: true } })).toBe('');
  });

  it('Management Fee columns valueGetter behaviors', () => {
    const cols = getAllocationPreviewColumnDefs(UNFUNDED, MANAGEMENT_FEE_HEADER);
    const mfPercentGetter = cols[5].valueGetter as (p: {
      data: { managementFeePercentage?: string };
      node?: { rowPinned?: boolean };
    }) => string;
    const mfGetter = cols[6].valueGetter as (p: { data: { managementFee?: number } }) => string;

    expect(mfPercentGetter({ data: { managementFeePercentage: '2.00%' } })).toBe('2.00%');
    expect(mfPercentGetter({ data: { managementFeePercentage: undefined } })).toBe('-');
    expect(
      mfPercentGetter({ data: { managementFeePercentage: '' }, node: { rowPinned: true } }),
    ).toBe('');

    expect(mfGetter({ data: { managementFee: 5000 } })).toBe('5,000.00');
    expect(mfGetter({ data: { managementFee: -300 } })).toBe('(300.00)');
    expect(mfGetter({ data: { managementFee: 0 } })).toBe('0.00');
    expect(mfGetter({ data: { managementFee: undefined } })).toBe('-');
  });
});
