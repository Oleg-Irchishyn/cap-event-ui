import React, { PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import FundGroupLineItems from '@/app/new/LineItems/FundGroupLineItems';
import { theme } from '@/ui/globalStyles';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { ITEM_STATES } from '@/const/common';

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

jest.mock('@/app/new/LineItems/AccountsTable', () => ({
  __esModule: true,
  default: jest.fn(({ isDisabled, testId }) => (
    <div data-testid={testId}>AccountsTable {isDisabled ? 'disabled' : 'enabled'}</div>
  )),
}));

jest.mock('@/app/new/styles', () => ({
  Title: ({ children }: PropsWithChildren) => <h1>{children}</h1>,
}));

jest.mock('@/api', () => ({
  ReferenceDataApi: {
    accounts: { getAccounts: jest.fn().mockResolvedValue([]) },
    investments: { getInvestments: jest.fn().mockResolvedValue([]) },
  },
}));

jest.mock('@/stores', () => ({
  entityDatesStore: {
    noticeDate: new Date(),
    hasDifferentDates: false,
  },
  capEventSettingsStore: {
    isGeneralSettingsEmpty: jest.fn(() => true),
    hasMultipleEntitiesChosen: true,
    isNoticeDateValid: true,
    setEventTypes: jest.fn(),
    setTemplates: jest.fn(),
    setFundGroups: jest.fn(),
    setFundEntities: jest.fn(),
    setNoticeDate: jest.fn(),
  },
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('FundGroupLineItems', () => {
  describe('Rendering', () => {
    it('should render the component with correct test id and title', () => {
      renderWithTheme(<FundGroupLineItems />);

      expect(screen.getByTestId('fund-group-line-items')).toBeInTheDocument();
      expect(screen.getByText('Capital Event Line Items - Fund Group Level')).toBeInTheDocument();
    });

    it('should render BackgroundContainer as the root element', () => {
      renderWithTheme(<FundGroupLineItems />);

      const backgroundContainer = screen.getByTestId('fund-group-line-items');
      expect(backgroundContainer).toBeInTheDocument();
      expect(backgroundContainer).toContainElement(
        screen.getByText('Capital Event Line Items - Fund Group Level'),
      );
    });

    it('should render the correct title text', () => {
      renderWithTheme(<FundGroupLineItems />);

      const title = screen.getByText('Capital Event Line Items - Fund Group Level');
      expect(title).toBeInTheDocument();
      expect(title).toBeVisible();
    });

    it('should have the correct component structure', () => {
      renderWithTheme(<FundGroupLineItems />);

      const container = screen.getByTestId('fund-group-line-items');
      expect(container).toBeInTheDocument();

      const title = screen.getByText('Capital Event Line Items - Fund Group Level');
      expect(container).toContainElement(title);

      const tableWrapper = screen.getByTestId('fund-group-account-table');
      expect(container).toContainElement(tableWrapper);

      expect(container.children).toHaveLength(2);
    });
  });

  describe('Component Integration', () => {
    it('should render without errors', () => {
      expect(() => {
        renderWithTheme(<FundGroupLineItems />);
      }).not.toThrow();
    });

    it('should render consistently on multiple renders', () => {
      const { unmount, rerender } = renderWithTheme(<FundGroupLineItems />);

      expect(screen.getByTestId('fund-group-line-items')).toBeInTheDocument();
      expect(screen.getByText('Capital Event Line Items - Fund Group Level')).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <FundGroupLineItems />
        </ThemeProvider>,
      );

      expect(screen.getByTestId('fund-group-line-items')).toBeInTheDocument();
      expect(screen.getByText('Capital Event Line Items - Fund Group Level')).toBeInTheDocument();

      unmount();
    });
  });

  describe('Styling', () => {
    it('should apply theme correctly through styled-components', () => {
      renderWithTheme(<FundGroupLineItems />);

      const title = screen.getByText('Capital Event Line Items - Fund Group Level');
      expect(title).toBeInTheDocument();

      expect(title).toBeVisible();
    });
  });

  describe('FundGroupLineItems', () => {
    beforeEach(() => {
      jest.clearAllMocks();

      capEventSettingsStore.setEventTypes([]);
      capEventSettingsStore.setTemplates([]);
      capEventSettingsStore.setFundGroups([]);
      capEventSettingsStore.setFundEntities([]);

      capEventSettingsStore.noticeDate = null;

      entityDatesStore.noticeDate = null;
      entityDatesStore.hasDifferentDates = false;
    });

    it('renders disabled AccountTable when only one entity is selected', () => {
      capEventSettingsStore.setEventTypes([{ label: 'evt', state: ITEM_STATES.SELECTED }]);
      capEventSettingsStore.setTemplates([{ label: 'tpl', state: ITEM_STATES.SELECTED }]);
      capEventSettingsStore.setFundGroups([{ label: 'fg', state: ITEM_STATES.SELECTED }]);
      capEventSettingsStore.setFundEntities([{ label: 'entity1', state: ITEM_STATES.SELECTED }]);
      capEventSettingsStore.setNoticeDate(new Date());

      render(<FundGroupLineItems />);

      expect(screen.getByTestId('fund-group-account-table')).toHaveTextContent(
        'AccountsTable disabled',
      );
    });

    it('renders enabled AccountTable when setting valid and multiple entities are chosen', () => {
      entityDatesStore.noticeDate = new Date();
      entityDatesStore.hasDifferentDates = false;

      capEventSettingsStore.setEventTypes([{ label: 'evt', state: ITEM_STATES.SELECTED }]);
      capEventSettingsStore.setTemplates([{ label: 'tpl', state: ITEM_STATES.SELECTED }]);
      capEventSettingsStore.setFundGroups([{ label: 'fg', state: ITEM_STATES.SELECTED }]);
      capEventSettingsStore.setFundEntities([
        { label: 'entity1', state: ITEM_STATES.SELECTED },
        { label: 'entity2', state: ITEM_STATES.SELECTED },
      ]);
      capEventSettingsStore.setNoticeDate(new Date());

      jest.spyOn(capEventSettingsStore, 'isGeneralSettingsEmpty').mockReturnValue(false);

      render(<FundGroupLineItems />);

      expect(screen.getByTestId('fund-group-account-table')).toHaveTextContent(
        'AccountsTable enabled',
      );
    });
  });
});
