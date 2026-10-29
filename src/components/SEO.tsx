import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface HowToStep {
  name: string;
  text: string;
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
  /** Short concise answer for AI featured snippets (AEO) */
  speakableAnswer?: string;
  /** HowTo steps for process-oriented pages (GEO) */
  howToSteps?: HowToStep[];
  /** If true, include AggregateRating for the business */
  includeRating?: boolean;
  /** Optional article publish date (ISO 8601) for freshness signals */
  datePublished?: string;
  /** Keywords for meta tag */
  keywords?: string;
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
  speakableAnswer,
  howToSteps,
  includeRating = false,
  datePublished,
  keywords,
}: SEOProps) {
  // Ensure absolute canonical and image URLs
  const absoluteCanonical = canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical}`;
  const absoluteImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  // ─── Organization & LocalBusiness Schema ───────────────────────────
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${BASE_URL}/#business`,
    name: 'MR Interiors',
    alternateName: ['MR Traders & Factory Outlet', 'MR Traders', 'MR Interiors Nashik'],
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.png`,
    image: absoluteImage,
    description: 'Premier interior design and execution studio specializing in residential interiors, modular kitchens, custom wardrobes, and commercial spaces with factory-direct supply in Nashik, Pune & Mumbai.',
    telephone: '+91 9423640903',
    email: 'mrtradersofficial01@gmail.com',
    priceRange: '₹₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Bank Transfer, Credit Card',
    foundingDate: '1990',
    numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 50, maxValue: 100 },
    knowsAbout: [
      'Interior Design',
      'Modular Kitchen Design',
      'Wardrobe Design',
      'Home Interior',
      'Commercial Interior Design',
      'False Ceiling Design',
      'Furniture Manufacturing',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Interior Design Services',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Residential Interiors',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Complete Home Interiors' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Modular Kitchen Design & Installation' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Wardrobes & Walk-in Closets' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Commercial Interiors',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Office Interior Design' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Retail Store Fit-outs' } },
          ],
        },
      ],
    },
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
      { '@type': 'City', name: 'Nashik', '@id': 'https://www.wikidata.org/wiki/Q228405' },
      { '@type': 'City', name: 'Pune', '@id': 'https://www.wikidata.org/wiki/Q1538' },
      { '@type': 'City', name: 'Mumbai', '@id': 'https://www.wikidata.org/wiki/Q1156' },
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
    ...(includeRating ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        bestRating: '5',
        worstRating: '1',
        ratingCount: '312',
        reviewCount: '298',
      },
    } : {}),
  };

  // ─── WebSite Schema with SearchAction (GEO) ───────────────────────
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
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/services?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // ─── WebPage Schema (AEO – Speakable) ─────────────────────────────
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteCanonical}/#webpage`,
    url: absoluteCanonical,
    name: title,
    description: description,
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: { '@id': `${BASE_URL}/#business` },
    ...(datePublished ? { datePublished } : {}),
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: 'en-IN',
    ...(speakableAnswer ? {
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['article', '.speakable-answer', 'h1', '.hero-description'],
      },
    } : {}),
  };

  // ─── BreadcrumbList Schema ─────────────────────────────────────────
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

  // ─── Service Schema ────────────────────────────────────────────────
  const serviceSchema = serviceName ? {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: serviceName,
    name: serviceName,
    description: serviceDescription || description,
    provider: {
      '@id': `${BASE_URL}/#business`,
    },
    areaServed: {
      '@type': 'City',
      name: city,
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'INR',
      },
    },
  } : null;

  // ─── FAQ Schema (AEO) ─────────────────────────────────────────────
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

  // ─── HowTo Schema (GEO – Process Content) ─────────────────────────
  const howToSchema = howToSteps && howToSteps.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How ${serviceName || 'Interior Design'} Works at MR Interiors`,
    description: `Step-by-step process for ${serviceName || 'interior design'} with MR Interiors in ${city}.`,
    totalTime: 'P45D',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: 'Contact for quote',
    },
    step: howToSteps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  } : null;

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={absoluteCanonical} />

      {/* Keywords (still used by some engines and AI crawlers) */}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Language and Geo targeting */}
      <meta httpEquiv="content-language" content="en-IN" />
      <meta name="geo.region" content="IN-MH" />
      <meta name="geo.placename" content={city} />

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
      <meta property="og:locale" content="en_IN" />

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
      <script type="application/ld+json">
        {JSON.stringify(webPageSchema)}
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
      {howToSchema && (
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>
      )}
    </Helmet>
  );
}