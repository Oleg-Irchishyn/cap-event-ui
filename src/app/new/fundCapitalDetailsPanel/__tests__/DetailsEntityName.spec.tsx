import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import DetailsEntityName from '../DetailsEntityName';
import { theme } from '@/ui/globalStyles';

jest.mock('@/utils/prepareDataTestId', () => ({
  prepareDataTestId: jest.fn((testId) => testId),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('DetailsEntityName', () => {
  const defaultProps = {
    title: 'Test Title',
  };

  it('should render with required props and correct content', () => {
    renderWithTheme(<DetailsEntityName {...defaultProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByTestId('entity-name')).toBeInTheDocument();
  });

  it('should render with custom testId when provided', () => {
    const customTestId = 'custom-test-id';
    renderWithTheme(<DetailsEntityName {...defaultProps} testId={customTestId} />);

    expect(screen.getByTestId(customTestId)).toBeInTheDocument();
  });

  it('should handle special characters and long content', () => {
    const titleWithSpecialChars = 'Title with $pecial Ch@r$!';

    renderWithTheme(<DetailsEntityName title={titleWithSpecialChars} />);

    expect(screen.getByText(titleWithSpecialChars)).toBeInTheDocument();
  });

  it('should render title as div element and maintain correct structure', () => {
    renderWithTheme(<DetailsEntityName {...defaultProps} />);

    const title = screen.getByText('Test Title');

    expect(title.tagName.toLowerCase()).toBe('div');
  });

  it('should handle edge cases gracefully', () => {
    renderWithTheme(<DetailsEntityName title="entity name" />);
    expect(screen.getByTestId('entity-name')).toBeInTheDocument();
  });
});
