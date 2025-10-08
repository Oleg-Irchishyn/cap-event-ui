export interface ConfirmationModalProps {
  title: string;
  isOpen: boolean;
  cancelText?: string;
  confirmText?: string;
  handleClose: () => void;
  handleProceed: () => void;
}
