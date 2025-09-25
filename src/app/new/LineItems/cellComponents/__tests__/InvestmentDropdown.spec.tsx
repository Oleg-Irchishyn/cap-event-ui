import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import { InvestmentDropdown } from '../InvestmentDropdown';
import { ICellRendererParams } from 'ag-grid-community';
import { capEventSettingsStore } from '@/stores';

// Mock the store
jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    investments: [],
    areInvestmentsLoading: false,
    fetchInvestments: jest.fn(),
  },
}));

// Mock the SearchBox component
jest.mock('@/app/components/SearchBox', () => {
  return function MockSearchBox({
    searchText,
    searchCallback,
    testId,
  }: {
    searchText: string;
    searchCallback: (value: string) => void;
    clearCallbackHandler: () => void;
    testId: string;
  }) {
    return (
      <input
        data-testid={testId}
        value={searchText}
        onChange={(e) => searchCallback(e.target.value)}
        placeholder="Search investments..."
      />
    );
  };
});

// Mock the useExternalElementClick hook
jest.mock('@/hooks/useExternalElementClick', () => ({
  useExternalElementClick: jest.fn(),
}));

// Mock createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (children: React.ReactNode) => children,
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('InvestmentDropdown', () => {
  const mockSetValue = jest.fn();
  const mockFetchInvestments = jest.fn();

  const defaultProps = {
    value: '',
    setValue: mockSetValue,
    api: {},
    node: {},
    colDef: {
      headerName: 'Investment',
      editable: true,
    },
  } as unknown as ICellRendererParams;

  const mockInvestments = [
    {
      id: '1',
      name: 'Investment 1',
      title: 'Investment Title 1',
      type: 'Equity',
    },
    {
      id: '2',
      name: 'Investment 2',
      title: 'Investment Title 2',
      type: 'Bond',
    },
    {
      id: '3',
      name: 'Investment 3',
      title: 'Investment Title 3',
      type: 'Fund',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    capEventSettingsStore.investments = mockInvestments;
    capEventSettingsStore.areInvestmentsLoading = false;
    capEventSettingsStore.fetchInvestments = mockFetchInvestments;
  });

  describe('Rendering', () => {
    it('should render with placeholder text when no value is selected', () => {
      renderWithTheme(<InvestmentDropdown {...defaultProps} />);

      expect(screen.getByText('Select Investment')).toBeInTheDocument();
    });

    it('should render with selected value when provided', () => {
      renderWithTheme(<InvestmentDropdown {...defaultProps} value="Investment Title 1" />);

      expect(screen.getByText('Investment Title 1')).toBeInTheDocument();
    });

    it('should not render chevron icon when cell is not editable', () => {
      const nonEditableProps = {
        ...defaultProps,
        colDef: { ...defaultProps.colDef, editable: false },
      };

      renderWithTheme(<InvestmentDropdown {...nonEditableProps} />);

      const wrapper = screen.getByText('Select Investment').closest('[data-is-clickable="false"]');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Dropdown functionality', () => {
    it('should open dropdown when clicked', () => {
      renderWithTheme(<InvestmentDropdown {...defaultProps} />);

      const trigger = screen.getByText('Select Investment');
      fireEvent.click(trigger);

      expect(screen.getByText('Refresh List')).toBeInTheDocument();
      expect(screen.getByText('Investment Title 1')).toBeInTheDocument();
      expect(screen.getByText('Investment Title 2')).toBeInTheDocument();
      expect(screen.getByText('Investment Title 3')).toBeInTheDocument();
    });

    it('should not open dropdown when cell is not editable', () => {
      const nonEditableProps = {
        ...defaultProps,
        colDef: { ...defaultProps.colDef, editable: false },
      };

      renderWithTheme(<InvestmentDropdown {...nonEditableProps} />);

      const trigger = screen.getByText('Select Investment');
      fireEvent.click(trigger);

      expect(screen.queryByText('Refresh List')).not.toBeInTheDocument();
    });
  });

  describe('Selection functionality', () => {
    it('should select an investment and close dropdown', () => {
      renderWithTheme(<InvestmentDropdown {...defaultProps} />);

      const trigger = screen.getByText('Select Investment');
      fireEvent.click(trigger);

      const option = screen.getByText('Investment Title 1');
      fireEvent.click(option);

      expect(mockSetValue).toHaveBeenCalledWith('Investment Title 1');
      expect(screen.queryByText('Refresh List')).not.toBeInTheDocument();
    });

    it('should update selected value when props change', () => {
      const { rerender } = renderWithTheme(<InvestmentDropdown {...defaultProps} />);

      expect(screen.getByText('Select Investment')).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <InvestmentDropdown {...defaultProps} value="Investment Title 2" />
        </ThemeProvider>,
      );

      expect(screen.getByText('Investment Title 2')).toBeInTheDocument();
    });
  });

  describe('Refresh functionality', () => {
    it('should call fetchInvestments when refresh button is clicked', () => {
      renderWithTheme(<InvestmentDropdown {...defaultProps} />);

      const trigger = screen.getByText('Select Investment');
      fireEvent.click(trigger);

      const refreshButton = screen.getByText('Refresh List');
      fireEvent.click(refreshButton);

      expect(mockFetchInvestments).toHaveBeenCalledTimes(1);
    });
  });

  describe('Investment display', () => {
    it('should display investment details correctly', () => {
      renderWithTheme(<InvestmentDropdown {...defaultProps} />);

      const trigger = screen.getByText('Select Investment');
      fireEvent.click(trigger);

      expect(screen.getByText('Investment Title 1')).toBeInTheDocument();
      expect(screen.getByText('Id: 1')).toBeInTheDocument();
      expect(screen.getByText('Equity')).toBeInTheDocument();

      expect(screen.getByText('Investment Title 2')).toBeInTheDocument();
      expect(screen.getByText('Id: 2')).toBeInTheDocument();
      expect(screen.getByText('Bond')).toBeInTheDocument();
    });

    it('should handle investments with missing fields gracefully', () => {
      capEventSettingsStore.investments = [
        {
          id: '1',
          name: undefined,
          title: undefined,
          type: undefined,
        },
      ];

      renderWithTheme(<InvestmentDropdown {...defaultProps} />);

      const trigger = screen.getByText('Select Investment');
      fireEvent.click(trigger);

      // Should not crash and should show the investment
      expect(screen.getByText('Id: 1')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty investments array', () => {
      capEventSettingsStore.investments = [];

      renderWithTheme(<InvestmentDropdown {...defaultProps} />);

      const trigger = screen.getByText('Select Investment');
      fireEvent.click(trigger);

      expect(screen.getByText('No options found')).toBeInTheDocument();
    });

    it('should handle undefined value prop', () => {
      renderWithTheme(<InvestmentDropdown {...defaultProps} value={undefined} />);

      expect(screen.getByText('Select Investment')).toBeInTheDocument();
    });

    it('should handle null value prop', () => {
      renderWithTheme(<InvestmentDropdown {...defaultProps} value={null} />);

      expect(screen.getByText('Select Investment')).toBeInTheDocument();
    });

    it('should handle function-based editable check', () => {
      const functionEditableProps = {
        ...defaultProps,
        colDef: {
          ...defaultProps.colDef,
          editable: jest.fn().mockReturnValue(true),
        },
      };

      renderWithTheme(<InvestmentDropdown {...functionEditableProps} />);

      const trigger = screen.getByText('Select Investment');
      fireEvent.click(trigger);

      expect(screen.getByText('Refresh List')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper data attributes for styling', () => {
      renderWithTheme(<InvestmentDropdown {...defaultProps} />);

      const wrapper = screen.getByText('Select Investment').closest('[data-is-clickable="true"]');
      expect(wrapper).toBeInTheDocument();
    });

    it('should toggle data-is-open attribute when dropdown opens/closes', () => {
      renderWithTheme(<InvestmentDropdown {...defaultProps} />);

      const wrapper = screen.getByText('Select Investment').closest('[data-is-open="false"]');
      expect(wrapper).toBeInTheDocument();

      fireEvent.click(screen.getByText('Select Investment'));

      const openWrapper = screen.getByText('Select Investment').closest('[data-is-open="true"]');
      expect(openWrapper).toBeInTheDocument();
    });
  });
});
