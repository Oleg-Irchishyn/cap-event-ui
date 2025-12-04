import { toast } from 'react-toastify';

const extractErrorMessage = (error: unknown): string => {
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle Error instances
  if (error instanceof Error) {
    // Check if it's an ApiError with a body message
    if ('body' in error && error.body && typeof error.body === 'object') {
      const apiError = error as { body?: { message?: string }; status?: number; message?: string };
      if (apiError.status === 401) {
        return apiError.message ?? 'Unauthorized';
      }
      if (apiError.body?.message) {
        return apiError.body.message;
      }
    }

    // Fall back to error message
    if (error.message) {
      return error.message;
    }
  }

  // Handle objects with message property
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string') {
      return message;
    }
  }

  // Default fallback
  return 'An unexpected error occurred. Please try again.';
};

export const showErrorToast = (error: unknown, customMessage?: string): void => {
  const message = customMessage ?? extractErrorMessage(error);
  toast.error(message);
};
