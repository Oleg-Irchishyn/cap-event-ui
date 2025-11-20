import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ActionsCell } from '../ActionsCell';
import { ICellRendererParams } from 'ag-grid-community';
import { LineItemTypes } from '@/app/new/LineItems/const';
import { capEventSettingsStore, entityDatesStore } from '@/stores';

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    hasMultipleEntitiesChosen: false,
    entitiesSelectedCountSnapshot: null,
    fundEntities: [],
    fundGroupsLineItem: [],
    entitiesLineItem: new Map(),
    setFundGroupsLineItem: jest.fn(),
    setEntitiesLineItem: jest.fn(),
  },
  entityDatesStore: {
    getEntityDueDate: jest.fn(),
    getEntityDueDateInputValidity: jest.fn(),
  },
}));

jest.mock('@/app/components/Tooltip', () => {
  return function MockTooltip({ showTooltip, tooltipMessage, testId }: unknown) {
    return (
      <div data-testid={testId} data-show-tooltip={showTooltip}>
        {tooltipMessage}
      </div>
    );
  };
});

describe('ActionsCell', () => {
  const mockProps: ICellRendererParams = {
    data: {
      id: 'test-row-1',
      amount: 1000,
      capitalCategory: 'Test Category',
      callDistributionReason: 'Test Reason',
      defaultDescription: 'Test Description',
      insideCommitment: 'Yes',
      investment: 'Test Investment',
      allocationBasis: 'Test Basis',
      inheritedFundGroupLineItemId: undefined,
    },
    colDef: {
      cellEditorParams: {
        entityKey: 'test-entity',
        level: LineItemTypes.entity,
      },
    },
  } as ICellRendererParams;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(capEventSettingsStore, 'hasMultipleEntitiesChosen', {
      get: () => false,
    });
    capEventSettingsStore.entitiesSelectedCountSnapshot = null;
    capEventSettingsStore.fundEntities = [];
    capEventSettingsStore.fundGroupsLineItem = [];
    capEventSettingsStore.entitiesLineItem = new Map();
    jest.spyOn(entityDatesStore, 'getEntityDueDate').mockReturnValue(new Date());
    jest.spyOn(entityDatesStore, 'getEntityDueDateInputValidity').mockReturnValue(true);
  });

  describe('Rendering', () => {
    it('should render delete button for non-inherited rows', () => {
      render(<ActionsCell {...mockProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3); // Preview + Duplicate + Delete buttons
    });

    it('should not render delete button for inherited rows', () => {
      const propsWithInherited = {
        ...mockProps,
        data: { ...mockProps.data, inheritedFundGroupLineItemId: 'inherited-123' },
      };
      render(<ActionsCell {...propsWithInherited} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2); // Preview + Duplicate buttons
      expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();
    });

    it('should render preview button for entity level rows', () => {
      render(<ActionsCell {...mockProps} />);
      const previewButton = screen.getByTestId('preview-icon-tooltip');
      expect(previewButton).toBeInTheDocument();
      expect(previewButton).toHaveAttribute('data-show-tooltip', 'false');
    });

    it('should not render preview button for group level rows', () => {
      const groupProps = {
        ...mockProps,
        colDef: {
          cellEditorParams: {
            entityKey: 'test-entity',
            level: LineItemTypes.group,
          },
        },
      };
      render(<ActionsCell {...groupProps} />);
      const previewButton = screen.queryByTestId('preview-icon-tooltip');
      expect(previewButton).not.toBeInTheDocument();
    });
  });

  describe('Delete Button Functionality', () => {
    it('should be enabled when row is not empty', () => {
      render(<ActionsCell {...mockProps} />);
      const buttons = screen.getAllByRole('button');
      const deleteButton = buttons.find(
        (button) => button.getAttribute('data-is-disabled') === 'false',
      );
      expect(deleteButton).toBeInTheDocument();
    });

    it('should be disabled when row is empty and it is the only group row', () => {
      const emptyRowProps = {
        ...mockProps,
        data: {
          ...mockProps.data,
          amount: 0,
          capitalCategory: '',
          callDistributionReason: '',
          defaultDescription: '',
          insideCommitment: '',
          investment: '',
          allocationBasis: '',
        },
        colDef: {
          cellEditorParams: {
            entityKey: 'test-entity',
            level: LineItemTypes.group,
          },
        },
      };

      capEventSettingsStore.fundGroupsLineItem = [emptyRowProps.data];

      render(<ActionsCell {...emptyRowProps} />);
      const buttons = screen.getAllByRole('button');
      const deleteButton = buttons.find(
        (button) => button.getAttribute('data-is-disabled') === 'true',
      );
      expect(deleteButton).toBeInTheDocument();
    });

    it('should be disabled when row is empty and it is the only entity row', () => {
      const emptyRowProps = {
        ...mockProps,
        data: {
          ...mockProps.data,
          amount: 0,
          capitalCategory: '',
          callDistributionReason: '',
          defaultDescription: '',
          insideCommitment: '',
          investment: '',
          allocationBasis: '',
        },
      };

      capEventSettingsStore.entitiesLineItem.set('test-entity', [emptyRowProps.data]);

      render(<ActionsCell {...emptyRowProps} />);
      const buttons = screen.getAllByRole('button');
      const deleteButton = buttons.find(
        (button) => button.getAttribute('data-is-disabled') === 'true',
      );
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe('Preview Button Functionality', () => {
    it('should be enabled when all required fields are populated', () => {
      render(<ActionsCell {...mockProps} />);
      const buttons = screen.getAllByRole('button');
      const previewButton = buttons.find(
        (button) => button.getAttribute('data-is-disabled') === 'false',
      );
      expect(previewButton).toBeInTheDocument();
    });

    it('should be disabled when required fields are missing', () => {
      const incompleteRowProps = {
        ...mockProps,
        data: {
          ...mockProps.data,
          capitalCategory: '',
        },
      };

      render(<ActionsCell {...incompleteRowProps} />);
      const buttons = screen.getAllByRole('button');
      const previewButton = buttons.find(
        (button) => button.getAttribute('data-is-disabled') === 'true',
      );
      expect(previewButton).toBeInTheDocument();
    });

    it('should be disabled when amount is zero', () => {
      const zeroAmountProps = {
        ...mockProps,
        data: {
          ...mockProps.data,
          amount: 0,
        },
      };

      render(<ActionsCell {...zeroAmountProps} />);
      const buttons = screen.getAllByRole('button');
      const previewButton = buttons.find(
        (button) => button.getAttribute('data-is-disabled') === 'true',
      );
      expect(previewButton).toBeInTheDocument();
    });

    it('should be disabled when entity due date is not a valid date', () => {
      jest.spyOn(entityDatesStore, 'getEntityDueDate').mockReturnValue(null);

      render(<ActionsCell {...mockProps} />);
      const buttons = screen.getAllByRole('button');
      const previewButton = buttons.find(
        (button) => button.getAttribute('data-is-disabled') === 'true',
      );
      expect(previewButton).toBeInTheDocument();
    });

    it('should show tooltip on hover when disabled', () => {
      const incompleteRowProps = {
        ...mockProps,
        data: {
          ...mockProps.data,
          capitalCategory: '',
        },
      };

      jest.spyOn(entityDatesStore, 'getEntityDueDate').mockReturnValue(null);
      render(<ActionsCell {...incompleteRowProps} />);
      const previewWrapper = screen.getByTestId('preview-icon-tooltip').parentElement;

      fireEvent.mouseEnter(previewWrapper!);

      const tooltip = screen.getByTestId('preview-icon-tooltip');
      expect(tooltip).toHaveAttribute('data-show-tooltip', 'true');
    });

    it('should hide tooltip on mouse leave', () => {
      const incompleteRowProps = {
        ...mockProps,
        data: {
          ...mockProps.data,
          capitalCategory: '',
        },
      };

      render(<ActionsCell {...incompleteRowProps} />);
      const previewWrapper = screen.getByTestId('preview-icon-tooltip').parentElement;

      fireEvent.mouseEnter(previewWrapper!);
      fireEvent.mouseLeave(previewWrapper!);

      const tooltip = screen.getByTestId('preview-icon-tooltip');
      expect(tooltip).toHaveAttribute('data-show-tooltip', 'false');
    });
  });

  describe('Edge Cases', () => {
    it('should not call delete when button is disabled', () => {
      const mockSetFundGroupsLineItem = jest.fn();
      capEventSettingsStore.setFundGroupsLineItem = mockSetFundGroupsLineItem;

      const emptyRowProps = {
        ...mockProps,
        data: {
          ...mockProps.data,
          amount: 0,
          capitalCategory: '',
          callDistributionReason: '',
          defaultDescription: '',
          insideCommitment: '',
          investment: '',
          allocationBasis: '',
        },
        colDef: {
          cellEditorParams: {
            entityKey: 'test-entity',
            level: LineItemTypes.group,
          },
        },
      };

      capEventSettingsStore.fundGroupsLineItem = [emptyRowProps.data];

      render(<ActionsCell {...emptyRowProps} />);
      const buttons = screen.getAllByRole('button');
      const deleteButton = buttons.find(
        (button) => button.getAttribute('data-is-disabled') === 'true',
      );

      fireEvent.click(deleteButton!);

      expect(mockSetFundGroupsLineItem).not.toHaveBeenCalled();
    });
  });
});
