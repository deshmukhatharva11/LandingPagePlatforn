import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'business.business';
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  serviceName?: string;
  serviceDescription?: string;
  faqs?: FAQItem[];
  city?: string;
}

const BASE_URL = 'https://mrtraders.site';
const DEFAULT_IMAGE = 'https://mrtraders.site/favicon.png';

export default function SEO({
  title = 'MR Interiors | Interior Designer & Factory Outlet in Nashik',
  description = 'MR Interiors delivers turnkey home interiors, modular kitchens, custom wardrobes, and commercial interior design in Nashik, Pune & Mumbai with factory-direct pricing.',
  image = DEFAULT_IMAGE,
  canonical = BASE_URL,
  type = 'website',
  noindex = false,
  breadcrumbs,
  serviceName,
  serviceDescription,
  faqs,
  city = 'Nashik',
}: SEOProps) {
  // Ensure absolute canonical and image URLs
  const absoluteCanonical = canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical}`;
  const absoluteImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  // Organization & LocalBusiness Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${BASE_URL}/#business`,
    name: 'MR Interiors',
    alternateName: 'MR Traders & Factory Outlet',
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.png`,
    image: absoluteImage,
    description: 'Premier interior design and execution studio specializing in residential interiors, modular kitchens, custom wardrobes, and commercial spaces with factory-direct supply.',
    telephone: '+91 9423640903',
    email: 'mrtradersofficial01@gmail.com',
    priceRange: '₹₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Nilgiri Baug, Sambhaji Nagar Road, Nandura Naka',
      addressLocality: 'Nashik',
      addressRegion: 'Maharashtra',
      postalCode: '422003',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 20.0000,
      longitude: 73.7898,
    },
    areaServed: [
      { '@type': 'City', name: 'Nashik' },
      { '@type': 'City', name: 'Pune' },
      { '@type': 'City', name: 'Mumbai' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/mr_traders.10',
      'https://www.facebook.com/mrtradersofficial',
      'https://www.youtube.com/@mrtraders',
    ],
  };

  // WebSite Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'MR Interiors',
    description: 'Interior Design & Factory Outlet in Nashik, Maharashtra',
    publisher: {
      '@id': `${BASE_URL}/#business`,
    },
  };

  // BreadcrumbList Schema (if breadcrumbs provided)
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${BASE_URL}${crumb.url}`,
    })),
  } : null;

  // Service Schema (if service details provided)
  const serviceSchema = serviceName ? {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: serviceName,
    description: serviceDescription || description,
    provider: {
      '@id': `${BASE_URL}/#business`,
    },
    areaServed: {
      '@type': 'City',
      name: city,
    },
  } : null;

  // FAQ Schema (if FAQs provided)
  const faqSchema = faqs && faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={absoluteCanonical} />

      {/* Robots Directive */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="MR Interiors" />
      <meta property="og:url" content={absoluteCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={absoluteCanonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* JSON-LD Schemas */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      {serviceSchema && (
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      )}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
    </Helmet>
  );
}