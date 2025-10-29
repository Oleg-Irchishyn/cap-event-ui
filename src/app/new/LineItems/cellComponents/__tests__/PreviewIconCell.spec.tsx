import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PreviewIconCell from '../PreviewIconCell';
import { ICellRendererParams } from 'ag-grid-community';
import { LineItemTypes } from '@/app/new/LineItems/const';

jest.mock('@/app/components/Tooltip', () => {
  return function MockTooltip({ showTooltip, testId }: { showTooltip: boolean; testId: string }) {
    return <div data-testid={testId} data-show-tooltip={showTooltip} />;
  };
});

jest.mock('@/stores', () => ({
  entityDatesStore: {
    getEntityDueDate: jest.fn(),
  },
}));

import { entityDatesStore } from '@/stores';

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

describe('PreviewIconCell', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render for group level rows', () => {
    (entityDatesStore.getEntityDueDate as jest.Mock).mockReturnValue(new Date());
    const props = {
      data: baseRow,
      colDef: { cellEditorParams: { level: LineItemTypes.group, entityKey: 'e1' } },
    } as unknown as ICellRendererParams;

    render(<PreviewIconCell {...props} />);
    expect(screen.queryByTestId('preview-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('preview-icon-tooltip')).not.toBeInTheDocument();
  });

  it('is enabled when required fields are populated and due date is valid', () => {
    (entityDatesStore.getEntityDueDate as jest.Mock).mockReturnValue(new Date());
    const props = {
      data: baseRow,
      colDef: { cellEditorParams: { level: LineItemTypes.entity, entityKey: 'e1' } },
    } as unknown as ICellRendererParams;

    render(<PreviewIconCell {...props} />);
    const btn = screen.getByTestId('preview-icon');
    expect(btn).toHaveAttribute('data-is-disabled', 'false');
  });

  it('is disabled and shows tooltip on hover when due date is invalid', () => {
    (entityDatesStore.getEntityDueDate as jest.Mock).mockReturnValue(null);
    const props = {
      data: baseRow,
      colDef: { cellEditorParams: { level: LineItemTypes.entity, entityKey: 'e1' } },
    } as unknown as ICellRendererParams;

    render(<PreviewIconCell {...props} />);
    const btn = screen.getByTestId('preview-icon');
    expect(btn).toHaveAttribute('data-is-disabled', 'true');

    const tooltip = screen.getByTestId('preview-icon-tooltip');
    const wrapper = tooltip.parentElement!;

    fireEvent.mouseEnter(wrapper);
    expect(tooltip).toHaveAttribute('data-show-tooltip', 'true');

    fireEvent.mouseLeave(wrapper);
    expect(tooltip).toHaveAttribute('data-show-tooltip', 'false');
  });
});
