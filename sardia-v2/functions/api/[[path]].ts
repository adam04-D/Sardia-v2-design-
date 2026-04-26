// Cloudflare Pages Function — proxies /api/* to the Render backend, preserving
// path, query, method, body, and headers. The cookie stays first-party because
// the browser only ever sees this Pages origin.

const BACKEND = 'https://sardia-backend-sql.onrender.com';

export const onRequest: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  const target = `${BACKEND}${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  headers.set('host', new URL(BACKEND).host);
  headers.set('x-forwarded-host', url.host);
  headers.set('x-forwarded-proto', url.protocol.replace(':', ''));

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual',
  };
  if (!['GET', 'HEAD'].includes(request.method)) {
    init.body = request.body;
  }

  const upstream = await fetch(target, init);
  const respHeaders = new Headers(upstream.headers);
  // Strip hop-by-hop headers Cloudflare will set itself.
  respHeaders.delete('content-encoding');
  respHeaders.delete('transfer-encoding');
  respHeaders.delete('connection');

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: respHeaders,
  });
};
