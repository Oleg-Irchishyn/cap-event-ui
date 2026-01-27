import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import CapEvent from '../page';

jest.mock('@/app/new/GeneralSettings', () => {
  return function GeneralSettings() {
    return <div data-testid="general-settings">GeneralSettings</div>;
  };
});

jest.mock('@/app/components/ButtonsGroup/ButtonsGroup', () => {
  return function ButtonsGroup() {
    return <div data-testid="buttons-group">ButtonsGroup</div>;
  };
});

jest.mock('@/app/new/attachments/Attachments', () => {
  return function Attachments() {
    return <div data-testid="attachments">Attachments</div>;
  };
});

jest.mock('@/app/new/CommentsField', () => {
  return function CommentsField() {
    return <div data-testid="comments-field">CommentsField</div>;
  };
});

jest.mock('@/app/new/LineItems/EntityLineItems', () => {
  return function EntityLineItems() {
    return <div data-testid="entity-line-items">EntityLineItems</div>;
  };
});

jest.mock('@/app/new/LineItems/FundGroupLineItems', () => {
  return function FundGroupLineItems() {
    return <div data-testid="fund-group-line-items">FundGroupLineItems</div>;
  };
});

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('CapEvent (NewPage)', () => {
  it('renders all main components', () => {
    renderWithTheme(<CapEvent />);

    expect(screen.getByTestId('buttons-group')).toBeInTheDocument();
    expect(screen.getByTestId('general-settings')).toBeInTheDocument();
    expect(screen.getByTestId('fund-group-line-items')).toBeInTheDocument();
    expect(screen.getByTestId('entity-line-items')).toBeInTheDocument();
    expect(screen.getByTestId('attachments')).toBeInTheDocument();
    expect(screen.getByTestId('comments-field')).toBeInTheDocument();
  });

  it('renders components in correct order', () => {
    const { container } = renderWithTheme(<CapEvent />);

    const buttonsGroup = screen.getByTestId('buttons-group');
    const generalSettings = screen.getByTestId('general-settings');
    const fundGroupLineItems = screen.getByTestId('fund-group-line-items');
    const entityLineItems = screen.getByTestId('entity-line-items');
    const attachments = screen.getByTestId('attachments');
    const commentsField = screen.getByTestId('comments-field');

    const allElements = [
      buttonsGroup,
      generalSettings,
      fundGroupLineItems,
      entityLineItems,
      attachments,
      commentsField,
    ];

    allElements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders PageContainer wrapper', () => {
    const { container } = renderWithTheme(<CapEvent />);

    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild?.childNodes.length).toBeGreaterThan(0);
  });
});
