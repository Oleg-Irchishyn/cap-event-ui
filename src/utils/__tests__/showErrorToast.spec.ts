import { toast } from 'react-toastify';
import { showErrorToast } from '@/utils/showErrorToast';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('showErrorToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show error toast with string error', () => {
    const errorMessage = 'Something went wrong';
    showErrorToast(errorMessage);

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it('should show error toast with Error instance', () => {
    const error = new Error('Network error');
    showErrorToast(error);

    expect(toast.error).toHaveBeenCalledWith('Network error');
  });

  it('should show error toast with object containing message property', () => {
    const error = { message: 'Custom error message' };
    showErrorToast(error);

    expect(toast.error).toHaveBeenCalledWith('Custom error message');
  });

  it('should show default message for unknown error types', () => {
    const error = null;
    showErrorToast(error);

    expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred. Please try again.');
    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  it('should show default message for errors without message', () => {
    const error = {};
    showErrorToast(error);

    expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred. Please try again.');
  });

  it('should use custom message when provided', () => {
    const error = new Error('Technical error');
    const customMessage = 'Failed to save data';
    showErrorToast(error, customMessage);

    expect(toast.error).toHaveBeenCalledWith(customMessage);
  });
});
