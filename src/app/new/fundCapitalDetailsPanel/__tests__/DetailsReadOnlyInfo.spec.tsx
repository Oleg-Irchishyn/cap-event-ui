import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import DetailsReadOnlyInfo from '../DetailsReadOnlyInfo';
import { theme } from '@/ui/globalStyles';

jest.mock('@/utils/prepareDataTestId', () => ({
  prepareDataTestId: jest.fn((testId) => testId),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('DetailsReadOnlyInfo', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description',
  };

  it('should render with required props and correct content', () => {
    renderWithTheme(<DetailsReadOnlyInfo {...defaultProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByTestId('details-read-only-info')).toBeInTheDocument();
  });

  it('should render with custom testId when provided', () => {
    const customTestId = 'custom-test-id';
    renderWithTheme(<DetailsReadOnlyInfo {...defaultProps} testId={customTestId} />);

    expect(screen.getByTestId(customTestId)).toBeInTheDocument();
  });

  it('should handle special characters and long content', () => {
    const titleWithSpecialChars = 'Title with $pecial Ch@r$!';
    const descriptionWithSpecialChars = 'Description with émojis 🎉 & symbols';

    renderWithTheme(
      <DetailsReadOnlyInfo
        title={titleWithSpecialChars}
        description={descriptionWithSpecialChars}
      />,
    );

    expect(screen.getByText(titleWithSpecialChars)).toBeInTheDocument();
    expect(screen.getByText(descriptionWithSpecialChars)).toBeInTheDocument();
  });

  it('should render title as h2 element and maintain correct structure', () => {
    renderWithTheme(<DetailsReadOnlyInfo {...defaultProps} />);

    const title = screen.getByRole('heading', { level: 2 });
    const description = screen.getByText('Test Description');

    expect(title).toHaveTextContent('Test Title');
    expect(description.tagName.toLowerCase()).toBe('span');
    expect(title.compareDocumentPosition(description)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('should handle edge cases gracefully', () => {
    renderWithTheme(<DetailsReadOnlyInfo title="" description="" />);
    expect(screen.getByTestId('details-read-only-info')).toBeInTheDocument();

    renderWithTheme(
      <DetailsReadOnlyInfo title="Test Title" description={undefined as unknown as string} />,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
