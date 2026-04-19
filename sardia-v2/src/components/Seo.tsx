import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article';
}

const SITE_NAME = 'سرديا';
const SITE_URL = 'https://sardia.me';
const DEFAULT_DESC =
  'مكتبة رقمية لأعمال الأديب آدم داودي — كتب، قصائد، دراسات نقدية وقصص قصيرة.';

export default function Seo({
  title,
  description = DEFAULT_DESC,
  image,
  path = '/',
  type = 'website',
}: SeoProps) {
  const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? `${SITE_URL}/og-image.jpg`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="ar_AR" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
