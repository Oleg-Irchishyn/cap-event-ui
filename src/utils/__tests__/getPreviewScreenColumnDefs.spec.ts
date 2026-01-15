import { getPreviewScreenColumnDefs } from '@/utils/getPreviewScreenColumnDefs';
import {
  ENTITY_ID_HEADER,
  ENTITY_NAME_HEADER,
  INVESTOR_ID_HEADER,
  INVESTOR_NAME_HEADER,
  INVESTOR_TYPE_I_HEADER,
  INVESTOR_TYPE_II_HEADER,
  ENTITY_ID_FIELD,
  ENTITY_NAME_FIELD,
  INVESTOR_ID_FIELD,
  INVESTOR_NAME_FIELD,
  INVESTOR_TYPE_I_FIELD,
  INVESTOR_TYPE_II_FIELD,
  EMPTY_INVESTOR_TYPE_ONE_VALUE,
  EMPTY_INVESTOR_TYPE_TWO_VALUE,
} from '@/const/previewScreen';

describe('getPreviewScreenColumnDefs', () => {
  it('returns 8 columns with correct headers/fields and default multi-sort', () => {
    const cols = getPreviewScreenColumnDefs();
    expect(cols).toHaveLength(6);

    // 1) Entity ID
    expect(cols[0].headerName).toBe(ENTITY_ID_HEADER);
    expect(cols[0].field).toBe(ENTITY_ID_FIELD);
    expect(cols[0].sortable).toBe(true);
    expect(cols[0].sort).toBe('asc');
    expect(cols[0].sortIndex).toBe(0);

    // 2) Entity Name
    expect(cols[1].headerName).toBe(ENTITY_NAME_HEADER);
    expect(cols[1].field).toBe(ENTITY_NAME_FIELD);
    expect(cols[1].sortable).toBe(true);

    // 3) Investor ID
    expect(cols[2].headerName).toBe(INVESTOR_ID_HEADER);
    expect(cols[2].field).toBe(INVESTOR_ID_FIELD);
    expect(cols[2].sortable).toBe(true);
    expect(cols[2].sort).toBe('asc');
    expect(cols[2].sortIndex).toBe(1);

    // 4) Investor Name
    expect(cols[3].headerName).toBe(INVESTOR_NAME_HEADER);
    expect(cols[3].field).toBe(INVESTOR_NAME_FIELD);
    expect(cols[3].sortable).toBe(true);

    // 5) Investor Type I
    expect(cols[4].headerName).toBe(INVESTOR_TYPE_I_HEADER);
    expect(cols[4].field).toBe(INVESTOR_TYPE_I_FIELD);
    expect(cols[4].sortable).toBe(true);

    // 6) Investor Type II
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
