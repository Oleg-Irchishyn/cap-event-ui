import { toast } from 'react-toastify';
import { showErrorToast } from '@/utils/showErrorToast';
import { ApiError } from '@/clients/CapEventPackage/core/ApiError';
import type { ApiRequestOptions } from '@/clients/CapEventPackage/core/ApiRequestOptions';
import type { ApiResult } from '@/clients/CapEventPackage/core/ApiResult';

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

  it('should show error toast with ApiError and body message', () => {
    const request: ApiRequestOptions = {
      method: 'POST',
      url: 'https://api.example.com',
    };
    const response: ApiResult = {
      url: 'https://api.example.com',
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      body: { message: 'Invalid request parameters' },
    };
    const apiError = new ApiError(request, response, 'API Error');

    showErrorToast(apiError);

    expect(toast.error).toHaveBeenCalledWith('Invalid request parameters');
  });

  it('should fall back to error.message when ApiError has no body.message', () => {
    const request: ApiRequestOptions = {
      method: 'POST',
      url: 'https://api.example.com',
    };
    const response: ApiResult = {
      url: 'https://api.example.com',
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      body: {},
    };
    const apiError = new ApiError(request, response, 'API Error occurred');

    showErrorToast(apiError);

    expect(toast.error).toHaveBeenCalledWith('API Error occurred');
  });

  it('should handle ApiError with 401 status code', () => {
    const request: ApiRequestOptions = {
      method: 'GET',
      url: 'https://api.example.com',
    };
    const response: ApiResult = {
      url: 'https://api.example.com',
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      body: { message: 'Session expired' },
    };
    const apiError = new ApiError(request, response, 'Unauthorized');

    showErrorToast(apiError);

    expect(toast.error).toHaveBeenCalledWith('Unauthorized');
  });

  it('should handle ApiError with 401 status code and no message', () => {
    const request: ApiRequestOptions = {
      method: 'GET',
      url: 'https://api.example.com',
    };
    const response: ApiResult = {
      url: 'https://api.example.com',
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      body: {},
    };
    // Create ApiError without passing a message (will use default Error message)
    const apiError = new ApiError(request, response, 'Unauthorized');

    showErrorToast(apiError);

    expect(toast.error).toHaveBeenCalledWith('Unauthorized');
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

  it('should handle ApiError with null body', () => {
    const request: ApiRequestOptions = {
      method: 'GET',
      url: 'https://api.example.com',
    };
    const response: ApiResult = {
      url: 'https://api.example.com',
      ok: false,
      status: 404,
      statusText: 'Not Found',
      body: null,
    };
    const apiError = new ApiError(request, response, 'API Error message');

    showErrorToast(apiError);

    expect(toast.error).toHaveBeenCalledWith('API Error message');
  });
});
