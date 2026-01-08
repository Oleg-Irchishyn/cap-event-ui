import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import BackToCapEventListButton from '../BackToCapEventListButton';
import { ROUTES } from '@/const/routes';

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
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('BackToCapEventListButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct label', () => {
    renderWithTheme(
      <BackToCapEventListButton isFormClean={true} onOpenConfirmationModal={jest.fn()} />,
    );
    const button = screen.getByTestId('back');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Back to Capital Event List')).toBeInTheDocument();
  });

  it('navigates to main list when form is clean', () => {
    renderWithTheme(
      <BackToCapEventListButton isFormClean={true} onOpenConfirmationModal={jest.fn()} />,
    );
    const button = screen.getByTestId('back');
    fireEvent.click(button);
    expect(mockRouter.push).toHaveBeenCalledWith(ROUTES.MAIN.path);
  });

  it('opens confirmation modal when form has unsaved changes', () => {
    const onOpen = jest.fn();
    renderWithTheme(
      <BackToCapEventListButton isFormClean={false} onOpenConfirmationModal={onOpen} />,
    );
    const button = screen.getByTestId('back');
    fireEvent.click(button);
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
