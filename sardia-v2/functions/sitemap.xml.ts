// Proxy /sitemap.xml to the backend's dynamic feed.
const BACKEND = 'https://sardia-backend-sql.onrender.com';

export const onRequest: PagesFunction = async () => {
  const upstream = await fetch(`${BACKEND}/sitemap.xml`);
  const headers = new Headers(upstream.headers);
  headers.delete('content-encoding');
  headers.delete('transfer-encoding');
  return new Response(upstream.body, { status: upstream.status, headers });
};
