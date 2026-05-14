export function parseError(error) {
  if (error?.response?.data) {
    const data = error.response.data;

    if (Array.isArray(data.message)) {
      return data.message[0];
    }

    if (typeof data.message === 'string') {
      return data.message;
    }
  }

  if (error?.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}