import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import LogoutButton from '../LogoutButton';

const mockLogout = jest.fn();
jest.mock('@/utils/logout', () => ({
  logout: (...args: unknown[]) => mockLogout(...args),
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('LogoutButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logout button with correct label', () => {
    renderWithTheme(<LogoutButton />);
    const button = screen.getByTestId('logout');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls logout on click', () => {
    renderWithTheme(<LogoutButton />);
    const button = screen.getByTestId('logout');
    fireEvent.click(button);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('uses text theme variant', () => {
    renderWithTheme(<LogoutButton />);
    const button = screen.getByTestId('logout');
    expect(button).toHaveAttribute('data-theme', 'text');
  });
});
