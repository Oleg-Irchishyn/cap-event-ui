import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ICellRendererParams } from 'ag-grid-community';

import DuplicateRowCell from '../DuplicateRowCell';
import { LineItemTypes } from '@/app/new/LineItems/const';

jest.mock('@/app/components/Tooltip', () => {
  return function MockTooltip({ showTooltip, testId }: { showTooltip: boolean; testId: string }) {
    return <div data-testid={testId} data-show-tooltip={showTooltip} />;
  };
});

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    hasMultipleEntitiesChosen: false,
  },
}));

import { capEventSettingsStore } from '@/stores';

const nonEmptyRow = {
  id: 'row-1',
  amount: 1000,
  capitalCategory: 'Cat',
  callDistributionReason: 'Reason',
  defaultDescription: 'Desc',
  insideCommitment: 'Yes',
  investment: 'Inv',
  allocationBasis: 'Basis',
};

const emptyRow = {
  id: 'row-2',
  amount: 0,
  capitalCategory: '',
  callDistributionReason: '',
  defaultDescription: '',
  insideCommitment: '',
  investment: '',
  allocationBasis: '',
};

describe('DuplicateRowCell', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(capEventSettingsStore, 'hasMultipleEntitiesChosen', {
      get: () => false,
    });
  });

  it('renders only for fund group when multiple entities are selected', () => {
    Object.defineProperty(capEventSettingsStore, 'hasMultipleEntitiesChosen', {
      get: () => true,
    });

    const entityProps = {
      data: nonEmptyRow,
      colDef: { cellEditorParams: { level: LineItemTypes.entity } },
    } as unknown as ICellRendererParams;

    const { unmount } = render(<DuplicateRowCell {...entityProps} />);
    expect(screen.queryByTestId('duplicate-row-icon')).not.toBeInTheDocument();
    unmount();

    const groupProps = {
      data: nonEmptyRow,
      colDef: { cellEditorParams: { level: LineItemTypes.group } },
    } as unknown as ICellRendererParams;

    render(<DuplicateRowCell {...groupProps} />);
    const btn = screen.getByTestId('duplicate-row-icon');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('data-is-disabled', 'false');
  });

  it('renders for entity and disabled for group when a single entity is selected', () => {
    Object.defineProperty(capEventSettingsStore, 'hasMultipleEntitiesChosen', {
      get: () => false,
    });

    const entityProps = {
      data: emptyRow,
      colDef: { cellEditorParams: { level: LineItemTypes.entity } },
    } as unknown as ICellRendererParams;

    const { unmount } = render(<DuplicateRowCell {...entityProps} />);
    const entityBtn = screen.getByTestId('duplicate-row-icon');
    expect(entityBtn).toHaveAttribute('data-is-disabled', 'true');
    unmount();

    const groupProps = {
      data: emptyRow,
      colDef: { cellEditorParams: { level: LineItemTypes.group } },
    } as unknown as ICellRendererParams;

    render(<DuplicateRowCell {...groupProps} />);
    const groupBtn = screen.getByTestId('duplicate-row-icon');
    expect(groupBtn).toHaveAttribute('data-is-disabled', 'true');
  });

  it('shows tooltip on hover only when enabled', () => {
    Object.defineProperty(capEventSettingsStore, 'hasMultipleEntitiesChosen', {
      get: () => false,
    });

    const entityProps = {
      data: nonEmptyRow,
      colDef: { cellEditorParams: { level: LineItemTypes.entity } },
    } as unknown as ICellRendererParams;

    render(<DuplicateRowCell {...entityProps} />);
    const btn = screen.getByTestId('duplicate-row-icon');
    expect(btn).toHaveAttribute('data-is-disabled', 'false');

    const tooltip = screen.getByTestId('duplicate-row-icon-tooltip');
    const wrapper = tooltip.parentElement!; // DuplicateRowWrapper

    fireEvent.mouseEnter(wrapper);
    expect(tooltip).toHaveAttribute('data-show-tooltip', 'true');

    fireEvent.mouseLeave(wrapper);
    expect(tooltip).toHaveAttribute('data-show-tooltip', 'false');
  });
});
