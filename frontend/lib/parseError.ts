import { AxiosError } from 'axios';
import { ApiError } from '../types';


export function parseError(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined;

    if (!data) return 'Network error. Please check your connection.';

    if (Array.isArray(data.message)) {
      return data.message[0]; //show 1st validation error
    }

    if (typeof data.message === 'string') {
      return data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}