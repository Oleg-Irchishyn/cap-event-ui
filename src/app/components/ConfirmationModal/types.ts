export interface ConfirmationModalProps {
  title: string;
  isOpen: boolean;
  description: string;
  cancelText?: string;
  confirmText?: string;
  handleClose: () => void;
  handleProceed: () => void;
  secondaryDescription?: string;
}
