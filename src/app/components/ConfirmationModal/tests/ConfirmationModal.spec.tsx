import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import ConfirmationModal from '@/app/components/ConfirmationModal/ConfirmationModal';
import { theme } from '@/ui/globalStyles';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => {
    return React.createElement('img', { ...props });
  },
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('ConfirmationModal', () => {
  it('does not render when isOpen is false', () => {
    renderWithTheme(
      <ConfirmationModal
        title="Entity"
        isOpen={false}
        handleClose={() => {}}
        handleProceed={() => {}}
      />,
    );

    expect(screen.queryByTestId('confirmation-modal-title')).not.toBeInTheDocument();
  });

  it('renders title and description when open', () => {
    renderWithTheme(
      <ConfirmationModal title="Entity" isOpen handleClose={() => {}} handleProceed={() => {}} />,
    );

    expect(screen.getByTestId('confirmation-modal-title')).toHaveTextContent('Entity Selection');
    expect(screen.getByTestId('confirmation-modal-description')).toHaveTextContent(
      'Changing the selected Entity will affect the calculation and overwrite the data without possibility of reverting.',
    );
    expect(screen.getByText('To confirm the change, please click Proceed.')).toBeInTheDocument();
  });

  it('calls handleClose when Cancel button is clicked', () => {
    const onClose = jest.fn();
    renderWithTheme(
      <ConfirmationModal title="Entity" isOpen handleClose={onClose} handleProceed={() => {}} />,
    );

    fireEvent.click(screen.getByTestId('confirmation-modal-cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls handleProceed when Proceed button is clicked', () => {
    const onProceed = jest.fn();
    renderWithTheme(
      <ConfirmationModal title="Entity" isOpen handleClose={() => {}} handleProceed={onProceed} />,
    );

    fireEvent.click(screen.getByTestId('confirmation-modal-proceed'));
    expect(onProceed).toHaveBeenCalledTimes(1);
  });

  it('calls handleClose when the close icon button is clicked', () => {
    const onClose = jest.fn();
    renderWithTheme(
      <ConfirmationModal title="Entity" isOpen handleClose={onClose} handleProceed={() => {}} />,
    );

    const closeImg = screen.getByAltText('modal-close-icon');
    const closeBtn = closeImg.closest('button');
    expect(closeBtn).toBeTruthy();
    if (closeBtn) fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls handleClose on outside click when open', () => {
    const onClose = jest.fn();
    renderWithTheme(
      <ConfirmationModal title="Entity" isOpen handleClose={onClose} handleProceed={() => {}} />,
    );

    fireEvent.mouseDown(document);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call handleClose when clicking inside modal content', () => {
    const onClose = jest.fn();
    renderWithTheme(
      <ConfirmationModal title="Entity" isOpen handleClose={onClose} handleProceed={() => {}} />,
    );

    fireEvent.mouseDown(screen.getByTestId('confirmation-modal-title'));
    expect(onClose).not.toHaveBeenCalled();
  });
});
