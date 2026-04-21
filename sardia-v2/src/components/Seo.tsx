import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
  };
}

const SITE_NAME = 'سرديا';
const SITE_URL = 'https://sardia.me';
const SITE_AUTHOR = 'آدم داودي';
const DEFAULT_DESC =
  'مكتبة رقمية لأعمال الأديب آدم داودي — كتب، قصائد، دراسات نقدية وقصص قصيرة.';
const DEFAULT_OG = `${SITE_URL}/og-image.png`;

export default function Seo({
  title,
  description = DEFAULT_DESC,
  image,
  path = '/',
  type = 'website',
  article,
}: SeoProps) {
  const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? DEFAULT_OG;

  const jsonLd: Record<string, unknown> =
    type === 'article'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description,
          image: [ogImage],
          author: { '@type': 'Person', name: article?.author ?? SITE_AUTHOR },
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
          },
          datePublished: article?.publishedTime,
          dateModified: article?.modifiedTime ?? article?.publishedTime,
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
          inLanguage: 'ar',
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
          description,
          inLanguage: 'ar',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/gallery?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content={SITE_AUTHOR} />
      <link rel="canonical" href={url} />
      <link rel="alternate" type="application/rss+xml" title={`${SITE_NAME} RSS`} href={`${SITE_URL}/rss.xml`} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="ar_AR" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />

      {type === 'article' && article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {type === 'article' && article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {type === 'article' && (
        <meta property="article:author" content={article?.author ?? SITE_AUTHOR} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
