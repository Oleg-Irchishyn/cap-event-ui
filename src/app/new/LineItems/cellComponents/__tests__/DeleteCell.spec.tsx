import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteCell from '../DeleteCell';
import { ICellRendererParams } from 'ag-grid-community';
import { LineItemTypes } from '@/app/new/LineItems/const';

type Row = {
  id: string;
  amount: number;
  capitalCategory: string;
  callDistributionReason: string;
  defaultDescription: string;
  insideCommitment: string;
  investment: string;
  allocationBasis: string;
  inheritedId?: string;
};

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    fundGroupsLineItem: [] as Row[],
    entitiesLineItem: new Map<string, Row[]>(),
    setFundGroupsLineItem: jest.fn(),
    setEntitiesLineItem: jest.fn(),
  },
}));

import { capEventSettingsStore } from '@/stores';

const baseRow = {
  id: 'row-1',
  amount: 1000,
  capitalCategory: 'Cat',
  callDistributionReason: 'Reason',
  defaultDescription: 'Desc',
  insideCommitment: 'Yes',
  investment: 'Inv',
  allocationBasis: 'Basis',
};

describe('DeleteCell', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capEventSettingsStore.fundGroupsLineItem = [];
    capEventSettingsStore.entitiesLineItem = new Map();
  });

  it('does not render when row is inherited', () => {
    const props = {
      data: { ...baseRow, inheritedId: 'inherited-1' },
      colDef: { cellEditorParams: { level: LineItemTypes.entity, entityKey: 'e1' } },
    } as unknown as ICellRendererParams;

    render(<DeleteCell {...props} />);
    expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();
  });

  it('disables delete for empty single group row', () => {
    const emptyRow = {
      ...baseRow,
      amount: 0,
      capitalCategory: '',
      callDistributionReason: '',
      defaultDescription: '',
      insideCommitment: '',
      investment: '',
      allocationBasis: '',
    };

    capEventSettingsStore.fundGroupsLineItem = [emptyRow];

    const props = {
      data: emptyRow,
      colDef: { cellEditorParams: { level: LineItemTypes.group } },
    } as unknown as ICellRendererParams;

    render(<DeleteCell {...props} />);
    const btn = screen.getByTestId('delete-icon');
    expect(btn).toHaveAttribute('data-is-disabled', 'true');
  });

  it('deletes entity row when multiple rows exist', () => {
    const row1 = { ...baseRow, id: 'r1' };
    const row2 = { ...baseRow, id: 'r2' };
    const entityKey = 'e1';

    capEventSettingsStore.entitiesLineItem.set(entityKey, [row1, row2]);

    const props = {
      data: row1,
      colDef: { cellEditorParams: { level: LineItemTypes.entity, entityKey } },
    } as unknown as ICellRendererParams;

    render(<DeleteCell {...props} />);
    const btn = screen.getByTestId('delete-icon');
    expect(btn).toHaveAttribute('data-is-disabled', 'false');

    fireEvent.click(btn);

    expect(capEventSettingsStore.setEntitiesLineItem).toHaveBeenCalledWith(entityKey, [row2]);
  });
});
