// Simple logging utility
// In production, these can be replaced with proper logging service

const isDevelopment = import.meta.env.DEV;

export const logger = {
  error: (message, ...args) => {
    if (isDevelopment) {
      console.error(message, ...args);
    }
    // In production, send to error tracking service (e.g., Sentry)
    // Example: Sentry.captureException(new Error(message), { extra: args });
  },
  
  warn: (message, ...args) => {
    if (isDevelopment) {
      console.warn(message, ...args);
    }
  },
  
  info: (message, ...args) => {
    if (isDevelopment) {
      console.info(message, ...args);
    }
  },
  
  log: (message, ...args) => {
    if (isDevelopment) {
      console.log(message, ...args);
    }
  }
};
