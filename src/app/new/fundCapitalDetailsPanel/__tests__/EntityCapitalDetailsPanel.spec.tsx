import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import EntityCapitalDetailsPanel from '../EntityCapitalDetailsPanel';
import { theme } from '@/ui/globalStyles';

jest.mock('../DetailsReadOnlyInfo', () => {
  return function MockDetailsReadOnlyInfo({
    title,
    description,
    testId = 'details-read-only-info',
  }: {
    title: string;
    description: string;
    testId?: string;
  }) {
    return (
      <div data-testid={testId}>
        <div data-testid="mock-title">{title}</div>
        <div data-testid="mock-description">{description}</div>
      </div>
    );
  };
});

jest.mock('@/utils/prepareDataTestId', () => ({
  prepareDataTestId: jest.fn((testId) => testId),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('EntityCapitalDetailsPanel', () => {
  const defaultProps = {
    entityLabel: 'Test Entity Label',
  };

  it('should render with required entityLabel prop and correct content', () => {
    renderWithTheme(<EntityCapitalDetailsPanel {...defaultProps} />);

    expect(screen.getByTestId('panel-container')).toBeInTheDocument();
    expect(screen.getByTestId('details-read-only-info')).toBeInTheDocument();
    expect(screen.getByTestId('mock-title')).toHaveTextContent('Entity');
    expect(screen.getByTestId('mock-description')).toHaveTextContent('Test Entity Label');
  });

  it('should render with custom testId when provided', () => {
    const customTestId = 'custom-panel-id';
    renderWithTheme(<EntityCapitalDetailsPanel {...defaultProps} testId={customTestId} />);

    expect(screen.getByTestId(customTestId)).toBeInTheDocument();
  });

  it('should not fallback for empty string (uses nullish coalescing)', () => {
    const entityName = 'Fallback Entity Name';
    renderWithTheme(<EntityCapitalDetailsPanel entityLabel="" entityName={entityName} />);
    expect(screen.getByTestId('mock-description')).toHaveTextContent('');
  });

  it('should fallback to entityName when entityLabel is null or undefined', () => {
    const entityName = 'Fallback Entity Name';

    renderWithTheme(
      <EntityCapitalDetailsPanel entityLabel={null as unknown as string} entityName={entityName} />,
    );
    expect(screen.getByTestId('mock-description')).toHaveTextContent(entityName);
  });

  it('should pass correct props to DetailsReadOnlyInfo component', () => {
    const entityLabel = 'Integration Test Entity';
    renderWithTheme(
      <EntityCapitalDetailsPanel entityLabel={entityLabel} entityName="Alternative Name" />,
    );

    expect(screen.getByTestId('mock-title')).toHaveTextContent('Entity');
    expect(screen.getByTestId('mock-description')).toHaveTextContent(entityLabel);
  });

  it('should handle special characters and long text', () => {
    const specialCharEntity = 'Entity with $pecial Ch@racters & Symbols! 🚀';
    renderWithTheme(<EntityCapitalDetailsPanel entityLabel={specialCharEntity} />);

    expect(screen.getByTestId('mock-description')).toHaveTextContent(specialCharEntity);
    expect(screen.getByTestId('panel-container')).toBeInTheDocument();
  });
});
