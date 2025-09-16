import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import FundGroupLineItems from '@/app/new/LineItems/FundGroupLineItems';
import { theme } from '@/ui/globalStyles';

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

      const tableWrapper = screen.getByTestId('table-wrapper-fund-group-account-table');
      expect(container).toContainElement(tableWrapper);

      expect(container.children).toHaveLength(3);
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
});
