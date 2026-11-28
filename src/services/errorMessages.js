export function getErrorInfo(error, resource = 'event') {
  const status = error?.status;

  if (status === 404) {
    const article = /^[aeiou]/.test(resource) ? 'an' : 'a';
    return {
      title: `${resource.charAt(0).toUpperCase()}${resource.slice(1)} not found`,
      message: `We couldn't find ${article} ${resource} with that ID.`,
      canRetry: false,
    };
  }
  if (status === 429) {
    return {
      title: 'Too many requests',
      message: 'Too many requests. Please wait a moment and try again.',
      canRetry: true,
    };
  }
  if (status === 0) {
    return {
      title: 'Connection problem',
      message: 'We could not reach the server. Check your internet connection and try again.',
      canRetry: true,
    };
  }
  return {
    title: 'Something went wrong',
    message: 'Something went wrong while loading. Please try again.',
    canRetry: true,
  };
}
