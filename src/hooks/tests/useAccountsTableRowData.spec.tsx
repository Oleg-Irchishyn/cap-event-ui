import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import useAccountsTableRowData from '@/hooks/useAccountsTableRowData';
import { LineItemRow } from '@/app/new/LineItems/types';
import { LineItemTypes } from '@/app/new/LineItems/const';

const TestComponent = ({ rows }: { level?: string; rows?: LineItemRow[] }) => {
  const data = useAccountsTableRowData(rows);
  return <div data-testid="out">{JSON.stringify(data)}</div>;
};

describe('useAccountsTableRowData', () => {
  it('returns rows with total row appended for any level', () => {
    const rows = [
      {
        id: '1',
        amount: 10,
        investment: { id: '131231', name: 'jsgfjshf' },
        allocationBasis: '',
        capitalCategory: 'Cat',
        callDistributionReason: '',
        defaultDescription: '',
        insideCommitment: '',
      } as LineItemRow,
    ];

    render(<TestComponent level={LineItemTypes.group} rows={rows} />);
    const result = JSON.parse(screen.getByTestId('out').textContent || '[]');
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[result.length - 1].id).toBe('total-row');
    expect(result[result.length - 1].amount).toBe(10);
  });

  it('total is empty when there is no amount', () => {
    const rows = [
      {
        id: '1',
        amount: 0,
        investment: { id: '131231', name: 'jsgfjshf' },
        allocationBasis: '',
        capitalCategory: 'Cat',
        callDistributionReason: '',
        defaultDescription: '',
        insideCommitment: '',
      } as LineItemRow,
    ];

    render(<TestComponent level={LineItemTypes.entity} rows={rows} />);
    const result = JSON.parse(screen.getByTestId('out').textContent || '[]');

    expect(result).toHaveLength(2);
    expect(result[1].amount).toBe('');
  });

  it('total is number when there is amount', () => {
    const rows = [
      {
        id: '1',
        amount: 100,
        investment: { id: '131231', name: 'jsgfjshf' },
        allocationBasis: '',
        capitalCategory: 'Cat',
        callDistributionReason: '',
        defaultDescription: '',
        insideCommitment: '',
      } as LineItemRow,
    ];

    render(<TestComponent level={LineItemTypes.entity} rows={rows} />);
    const result = JSON.parse(screen.getByTestId('out').textContent || '[]');

    expect(result).toHaveLength(2);
    expect(result[1].amount).toBe(100);
  });

  it('total is 0 when amount sum equals 0', () => {
    const rows = [
      {
        id: '1',
        amount: 100,
        investment: { id: '131231', name: 'jsgfjshf' },
        allocationBasis: '',
        capitalCategory: 'Cat',
        callDistributionReason: '',
        defaultDescription: '',
        insideCommitment: '',
      } as LineItemRow,
      {
        id: '1',
        amount: -100,
        investment: { id: '131231', name: 'jsgfjshf' },
        allocationBasis: '',
        capitalCategory: 'Cat',
        callDistributionReason: '',
        defaultDescription: '',
        insideCommitment: '',
      } as LineItemRow,
    ];

    render(<TestComponent level={LineItemTypes.entity} rows={rows} />);
    const result = JSON.parse(screen.getByTestId('out').textContent || '[]');

    expect(result).toHaveLength(3);
    expect(result[2].amount).toBe(0);
  });

  it('appends total row with Net Contributions for positive total on entity level', () => {
    const rows = [
      {
        id: 'a',
        amount: 100,
        investment: { id: '131231', name: 'jsgfjshf' },
        allocationBasis: '',
        capitalCategory: 'Cat',
        callDistributionReason: '',
        defaultDescription: '',
        insideCommitment: '',
      } as LineItemRow,
      {
        id: 'b',
        amount: 50,
        investment: { id: '131231', name: 'jsgfjshf' },
        allocationBasis: '',
        capitalCategory: 'Cat',
        callDistributionReason: '',
        defaultDescription: '',
        insideCommitment: '',
      } as LineItemRow,
    ];

    render(<TestComponent level={LineItemTypes.entity} rows={rows} />);
    const result = JSON.parse(screen.getByTestId('out').textContent || '[]');
    expect(result).toHaveLength(3);
    const totalRow = result[result.length - 1];
    expect(totalRow.id).toBe('total-row');
    expect(totalRow.amount).toBe(150);
    expect(totalRow.capitalCategory).toBe('Net Contributions');
    expect(totalRow.isTotalRow).toBe(true);
  });

  it('filters out existing total row and sets Net Distributions for negative total', () => {
    const rows = [
      {
        id: 'x',
        amount: -200,
        investment: {},
        allocationBasis: '',
        capitalCategory: 'Cat',
        callDistributionReason: '',
        defaultDescription: '',
        insideCommitment: '',
      } as LineItemRow,
      {
        id: 'total-row',
        amount: 999,
        investment: '',
        allocationBasis: '',
        capitalCategory: 'Old',
        callDistributionReason: '',
        defaultDescription: '',
        insideCommitment: '',
        isTotalRow: true as unknown as undefined,
      } as unknown as LineItemRow,
    ];

    render(<TestComponent level={LineItemTypes.entity} rows={rows} />);
    const result = JSON.parse(screen.getByTestId('out').textContent || '[]');
    expect(result).toHaveLength(2);
    const totalRow = result[result.length - 1];
    expect(totalRow.id).toBe('total-row');
    expect(totalRow.amount).toBe(-200);
    expect(totalRow.capitalCategory).toBe('Net Distributions');
  });
});
