import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import EntityLineItems from '@/app/new/EntityLineItems';
import { theme } from '@/ui/globalStyles';
import { capEventSettingsStore } from '@/stores';
import { ITEM_STATES } from '@/const/common';

interface MockStore {
  funds: Array<{
    id?: string;
    label: string;
    displayName?: string;
    state: string;
  }>;
  _isGeneralSettingsEmpty: boolean;
  isGeneralSettingsEmpty: boolean;
}

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    funds: [],
    _isGeneralSettingsEmpty: true,
    get isGeneralSettingsEmpty() {
      return this._isGeneralSettingsEmpty;
    },
    set isGeneralSettingsEmpty(value) {
      this._isGeneralSettingsEmpty = value;
    },
  },
}));

jest.mock('@/app/new/fundCapitalDetailsPanel/EntityCapitalDetailsPanel', () => {
  return function MockEntityCapitalDetailsPanel({
    entityLabel,
    entityName,
  }: {
    entityLabel: string;
    entityName?: string;
  }) {
    return (
      <div data-testid="entity-capital-details-panel">
        Fund: {entityLabel} {entityName && `(${entityName})`}
      </div>
    );
  };
});

jest.mock('@/app/components/BackgroundContainer', () => {
  return function MockBackgroundContainer({
    children,
    testId,
  }: {
    children: React.ReactNode;
    testId?: string;
  }) {
    return <div data-testid={testId}>{children}</div>;
  };
});

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

const mockCapEventSettingsStore = capEventSettingsStore as unknown as MockStore;

describe('EntityLineItems', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCapEventSettingsStore.funds = [];
    mockCapEventSettingsStore._isGeneralSettingsEmpty = true;
  });

  describe('Rendering', () => {
    it('should render the component with correct test id and title', () => {
      renderWithTheme(<EntityLineItems />);

      expect(screen.getByTestId('entity-line-items')).toBeInTheDocument();
      expect(screen.getByText('Capital Event Line Items - Entity Level')).toBeInTheDocument();
    });

    it('should render nothing when settings store is empty', () => {
      mockCapEventSettingsStore._isGeneralSettingsEmpty = true;

      renderWithTheme(<EntityLineItems />);

      expect(screen.getByTestId('entity-line-items')).toBeInTheDocument();
      expect(screen.getByText('Capital Event Line Items - Entity Level')).toBeInTheDocument();
      expect(screen.queryByTestId('entity-capital-details-panel')).not.toBeInTheDocument();
    });

    it('should render fund panels when settings store is not empty and has selected funds', () => {
      const mockFunds = [
        {
          id: '1',
          label: 'Fund A',
          displayName: 'Fund A Display',
          state: ITEM_STATES.SELECTED,
        },
        {
          id: '2',
          label: 'Fund B',
          displayName: 'Fund B Display',
          state: ITEM_STATES.SELECTED,
        },
      ];

      mockCapEventSettingsStore.funds = mockFunds;
      mockCapEventSettingsStore._isGeneralSettingsEmpty = false;

      renderWithTheme(<EntityLineItems />);

      expect(screen.getByTestId('entity-line-items')).toBeInTheDocument();
      expect(screen.getByText('Capital Event Line Items - Entity Level')).toBeInTheDocument();
      expect(screen.getAllByTestId('entity-capital-details-panel')).toHaveLength(2);
      expect(screen.getByText('Fund: Fund A (Fund A Display)')).toBeInTheDocument();
      expect(screen.getByText('Fund: Fund B (Fund B Display)')).toBeInTheDocument();
    });

    it('should not render panels for funds that are not selected', () => {
      const mockFunds = [
        {
          id: '1',
          label: 'Fund A',
          displayName: 'Fund A Display',
          state: ITEM_STATES.SELECTED,
        },
        {
          id: '2',
          label: 'Fund B',
          displayName: 'Fund B Display',
          state: ITEM_STATES.EXCLUDED,
        },
        {
          id: '3',
          label: 'Fund C',
          displayName: 'Fund C Display',
          state: ITEM_STATES.OPTIONAL,
        },
      ];

      mockCapEventSettingsStore.funds = mockFunds;
      mockCapEventSettingsStore._isGeneralSettingsEmpty = false;

      renderWithTheme(<EntityLineItems />);

      expect(screen.getAllByTestId('entity-capital-details-panel')).toHaveLength(1);
      expect(screen.getByText('Fund: Fund A (Fund A Display)')).toBeInTheDocument();
      expect(screen.queryByText('Fund: Fund B (Fund B Display)')).not.toBeInTheDocument();
      expect(screen.queryByText('Fund: Fund C (Fund C Display)')).not.toBeInTheDocument();
    });

    it('should handle funds without displayName', () => {
      const mockFunds = [
        {
          id: '1',
          label: 'Fund A',
          state: ITEM_STATES.SELECTED,
        },
      ];

      mockCapEventSettingsStore.funds = mockFunds;
      mockCapEventSettingsStore._isGeneralSettingsEmpty = false;

      renderWithTheme(<EntityLineItems />);

      expect(screen.getByTestId('entity-capital-details-panel')).toBeInTheDocument();
      expect(screen.getByText('Fund: Fund A')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should sort funds alphabetically by displayName', () => {
      const mockFunds = [
        {
          id: '1',
          label: 'Fund A',
          displayName: 'Zebra Fund',
          state: ITEM_STATES.SELECTED,
        },
        {
          id: '2',
          label: 'Fund B',
          displayName: 'Alpha Fund',
          state: ITEM_STATES.SELECTED,
        },
        {
          id: '3',
          label: 'Fund C',
          displayName: 'Beta Fund',
          state: ITEM_STATES.SELECTED,
        },
      ];

      mockCapEventSettingsStore.funds = mockFunds;
      mockCapEventSettingsStore._isGeneralSettingsEmpty = false;

      renderWithTheme(<EntityLineItems />);

      const panels = screen.getAllByTestId('entity-capital-details-panel');
      expect(panels).toHaveLength(3);
      expect(panels[0]).toHaveTextContent('Fund: Fund B (Alpha Fund)');
      expect(panels[1]).toHaveTextContent('Fund: Fund C (Beta Fund)');
      expect(panels[2]).toHaveTextContent('Fund: Fund A (Zebra Fund)');
    });

    it('should sort funds alphabetically by label when displayName is not available', () => {
      const mockFunds = [
        {
          id: '1',
          label: 'Zebra Fund',
          state: ITEM_STATES.SELECTED,
        },
        {
          id: '2',
          label: 'Alpha Fund',
          state: ITEM_STATES.SELECTED,
        },
        {
          id: '3',
          label: 'Beta Fund',
          state: ITEM_STATES.SELECTED,
        },
      ];

      mockCapEventSettingsStore.funds = mockFunds;
      mockCapEventSettingsStore._isGeneralSettingsEmpty = false;

      renderWithTheme(<EntityLineItems />);

      const panels = screen.getAllByTestId('entity-capital-details-panel');
      expect(panels).toHaveLength(3);
      expect(panels[0]).toHaveTextContent('Fund: Alpha Fund');
      expect(panels[1]).toHaveTextContent('Fund: Beta Fund');
      expect(panels[2]).toHaveTextContent('Fund: Zebra Fund');
    });

    it('should handle mixed case sorting correctly', () => {
      const mockFunds = [
        {
          id: '1',
          label: 'fund a',
          displayName: 'ZEBRA FUND',
          state: ITEM_STATES.SELECTED,
        },
        {
          id: '2',
          label: 'FUND B',
          displayName: 'alpha fund',
          state: ITEM_STATES.SELECTED,
        },
      ];

      mockCapEventSettingsStore.funds = mockFunds;
      mockCapEventSettingsStore._isGeneralSettingsEmpty = false;

      renderWithTheme(<EntityLineItems />);

      const panels = screen.getAllByTestId('entity-capital-details-panel');
      expect(panels).toHaveLength(2);
      expect(panels[0]).toHaveTextContent('Fund: FUND B (alpha fund)');
      expect(panels[1]).toHaveTextContent('Fund: fund a (ZEBRA FUND)');
    });
  });

  describe('Integration', () => {
    it('should filter and sort selected funds correctly', () => {
      const mockFunds = [
        {
          id: '1',
          label: 'Fund A',
          displayName: 'Zebra Fund',
          state: ITEM_STATES.EXCLUDED,
        },
        {
          id: '2',
          label: 'Fund B',
          displayName: 'Alpha Fund',
          state: ITEM_STATES.SELECTED,
        },
        {
          id: '3',
          label: 'Fund C',
          displayName: 'Beta Fund',
          state: ITEM_STATES.OPTIONAL,
        },
        {
          id: '4',
          label: 'Fund D',
          displayName: 'Charlie Fund',
          state: ITEM_STATES.SELECTED,
        },
      ];

      mockCapEventSettingsStore.funds = mockFunds;
      mockCapEventSettingsStore._isGeneralSettingsEmpty = false;

      renderWithTheme(<EntityLineItems />);

      const panels = screen.getAllByTestId('entity-capital-details-panel');
      expect(panels).toHaveLength(2);
      expect(panels[0]).toHaveTextContent('Fund: Fund B (Alpha Fund)');
      expect(panels[1]).toHaveTextContent('Fund: Fund D (Charlie Fund)');
    });

    it('should render empty list when no funds are selected', () => {
      const mockFunds = [
        {
          id: '1',
          label: 'Fund A',
          displayName: 'Fund A Display',
          state: ITEM_STATES.EXCLUDED,
        },
        {
          id: '2',
          label: 'Fund B',
          displayName: 'Fund B Display',
          state: ITEM_STATES.OPTIONAL,
        },
      ];

      mockCapEventSettingsStore.funds = mockFunds;
      mockCapEventSettingsStore._isGeneralSettingsEmpty = false;

      renderWithTheme(<EntityLineItems />);

      expect(screen.getByTestId('entity-line-items')).toBeInTheDocument();
      expect(screen.getByText('Capital Event Line Items - Entity Level')).toBeInTheDocument();
      expect(screen.queryByTestId('entity-capital-details-panel')).not.toBeInTheDocument();
    });
  });
});
