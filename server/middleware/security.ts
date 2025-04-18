import { defineEventHandler, setResponseHeaders } from 'h3';
import crypto from 'crypto';

export default defineEventHandler(event => {
  // Generate a random nonce
  const nonce = crypto.randomBytes(16).toString('base64');

  // Set security headers
  setResponseHeaders(event, {
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': `frame-ancestors 'self'; script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://www.surveycake.com; style-src 'self' 'nonce-${nonce}'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://www.surveycake.com; frame-src 'self' https://www.surveycake.com https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'self' https://www.surveycake.com; upgrade-insecure-requests;`,
  });

  // Add nonce to the event context for use in templates
  event.context.nonce = nonce;
});
