import * as Sentry from '@sentry/react';

// Optional. If VITE_SENTRY_DSN isn't set we install no-op stubs so the
// rest of the codebase can call Sentry.captureException without a guard
// at every site. Mirrors the backend's src/config/sentry.js pattern.
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) {
    if (import.meta.env.DEV) {
      console.info('[sentry] disabled (VITE_SENTRY_DSN not set).');
    }
    return;
  }
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    // Light sampling in prod; full in dev/staging so local errors are visible.
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    // Replay only on errors — full session replay would be expensive on the
    // free tier. 0% in prod baseline; lift later if you need reproduction.
    replaysOnErrorSampleRate: import.meta.env.PROD ? 0.1 : 0,
    replaysSessionSampleRate: 0,
    // Strip query strings from breadcrumb URLs so search terms / filter
    // values don't get sent off-site.
    beforeBreadcrumb(crumb) {
      if (crumb.category === 'fetch' || crumb.category === 'xhr') {
        const url = crumb.data?.url as string | undefined;
        if (url && url.includes('?')) {
          crumb.data = { ...crumb.data, url: url.split('?')[0] };
        }
      }
      return crumb;
    },
  });
}

export const captureException = Sentry.captureException;
