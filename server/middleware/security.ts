export default defineEventHandler(event => {
  setResponseHeaders(event, {
    'X-Frame-Options': 'SAMEORIGIN',
    'Content-Security-Policy': "frame-ancestors 'self'",
  });
});
