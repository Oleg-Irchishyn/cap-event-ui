import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import DetailsModal from '@/app/new/allocation-distribution/DetailsModal';
import { DistributionRow } from '@/app/new/allocation-distribution/types';

const mockCloseModal = jest.fn();

const mockDetails: DistributionRow = {
  id: 'test-id',
  investor: 'Test Investor',
  entityId: 'entity-123',
  entityName: 'Test Entity',
  description: 'Test Description',
  dataPoints: '{"test": "data", "amount": 1000}',
  investmentTitle: 'Test Investment Title',
  investmentName: 'Test Investment Name',
  allocatedAmount: 1000,
};

const renderWithTheme = (details: DistributionRow = mockDetails, closeModal = mockCloseModal) =>
  render(
    <ThemeProvider theme={theme}>
      <DetailsModal details={details} closeModal={closeModal} />
    </ThemeProvider>,
  );

describe('DetailsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with correct title', () => {
    renderWithTheme();

    expect(screen.getByText('Investor Details')).toBeInTheDocument();
  });

  it('displays details data in textarea', () => {
    renderWithTheme();

    const textarea = screen.getByTestId('textarea-detail-modal') as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe(mockDetails.dataPoints);
    expect(textarea.name).toBe('allocation-payload');
    expect(textarea.rows).toBe(4);
  });

  it('renders close button with correct properties', () => {
    renderWithTheme();

    const closeButton = screen.getByTestId('close-details');
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveTextContent('Close');
  });

  it('calls closeModal when close button is clicked', () => {
    renderWithTheme();

    const closeButton = screen.getByTestId('close-details');
    fireEvent.click(closeButton);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('handles undefined dataPoints gracefully', () => {
    const detailsWithUndefinedDataPoints: DistributionRow = {
      ...mockDetails,
      dataPoints: undefined,
    };

    renderWithTheme(detailsWithUndefinedDataPoints);

    const textarea = screen.getByTestId('textarea-detail-modal') as HTMLTextAreaElement;
    expect(textarea.value).toBe('');
  });
});
