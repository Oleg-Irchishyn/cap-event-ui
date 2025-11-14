import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import CommentsField from '@/app/new/CommentsField';
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

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('CommentsField', () => {
  it('renders the component with title and textarea', () => {
    renderWithTheme(<CommentsField />);

    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByText('Comment Text Area')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    expect(screen.getByText('0 of 1200')).toBeInTheDocument();
  });

  it('updates character counter when typing in textarea', () => {
    renderWithTheme(<CommentsField />);

    const textarea = screen.getByPlaceholderText('Enter text');
    fireEvent.change(textarea, { target: { value: 'Hello World' } });

    expect(screen.getByText('11 of 1200')).toBeInTheDocument();
    expect(textarea).toHaveValue('Hello World');
  });

  it('respects maxLength of 1200 characters', () => {
    renderWithTheme(<CommentsField />);

    const textarea = screen.getByPlaceholderText('Enter text') as HTMLTextAreaElement;

    expect(textarea).toHaveAttribute('maxLength', '1200');
  });
});
