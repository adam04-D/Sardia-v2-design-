const CLOUDINARY_HOST = 'res.cloudinary.com';

function injectCloudinaryTransform(url: string, transform: string): string {
  try {
    const u = new URL(url);
    if (u.hostname !== CLOUDINARY_HOST) return url;
    // path shape: /{cloud}/image/upload/[transforms/]v123/folder/name.jpg
    const marker = '/image/upload/';
    const idx = u.pathname.indexOf(marker);
    if (idx === -1) return url;
    const before = u.pathname.slice(0, idx + marker.length);
    const after = u.pathname.slice(idx + marker.length);
    // If a transform segment is already present (contains an underscore param), replace it.
    const hasTransform = /^[^/]*_[^/]*\//.test(after) && !/^v\d+\//.test(after);
    const rest = hasTransform ? after.split('/').slice(1).join('/') : after;
    u.pathname = `${before}${transform}/${rest}`;
    return u.toString();
  } catch {
    return url;
  }
}

export function cdnImage(url: string | null | undefined, width: number, opts: { quality?: string } = {}): string {
  if (!url) return '';
  const q = opts.quality ?? 'auto';
  return injectCloudinaryTransform(url, `f_auto,q_${q},w_${width},c_limit`);
}

export function cdnSrcSet(url: string | null | undefined, widths: number[]): string {
  if (!url) return '';
  return widths.map((w) => `${cdnImage(url, w)} ${w}w`).join(', ');
}
