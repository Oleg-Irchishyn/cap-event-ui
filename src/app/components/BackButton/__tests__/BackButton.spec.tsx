import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import BackButton from '../BackButton';
import { ROUTES } from '@/const/routes';

let mockPathname = '/somewhere';
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname,
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('BackButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render outside of preview screen', () => {
    mockPathname = ROUTES.NEW_CAP_EVENT.path;
    renderWithTheme(<BackButton />);
    expect(screen.queryByTestId('back')).not.toBeInTheDocument();
  });

  it('renders on preview screen with correct label', () => {
    mockPathname = ROUTES.PREVIEW_SCREEN.path;
    renderWithTheme(<BackButton />);

    const button = screen.getByTestId('back');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('navigates to NEW_CAP_EVENT on click', () => {
    mockPathname = ROUTES.PREVIEW_SCREEN.path;
    renderWithTheme(<BackButton />);

    const button = screen.getByTestId('back');
    fireEvent.click(button);
    expect(mockRouter.push).toHaveBeenCalledWith(ROUTES.NEW_CAP_EVENT.path);
  });

  it('shows tooltip on hover and hides on mouse leave', () => {
    mockPathname = ROUTES.PREVIEW_SCREEN.path;
    renderWithTheme(<BackButton />);

    expect(screen.queryByTestId('tooltip-back-button-tooltip')).not.toBeInTheDocument();

    const button = screen.getByTestId('back');
    fireEvent.mouseEnter(button);

    const tooltip = screen.getByTestId('tooltip-back-button-tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('Back to previous page');

    fireEvent.mouseLeave(button);
    expect(screen.queryByTestId('tooltip-back-button-tooltip')).not.toBeInTheDocument();
  });
});
