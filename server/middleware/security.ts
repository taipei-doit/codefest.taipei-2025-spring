import { defineEventHandler, setResponseHeaders } from 'h3';

export default defineEventHandler(event => {
  // Set security headers
  setResponseHeaders(event, {
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.surveycake.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://www.surveycake.com; frame-src 'self' https://www.surveycake.com https://www.googletagmanager.com; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self' https://www.surveycake.com; upgrade-insecure-requests;",
  });
});
