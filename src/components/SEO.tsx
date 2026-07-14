import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({
  title = "MR Traders - Premium Interior Design & Factory Outlet in Nashik",
  description = "Transform your space with MR Traders' premium interior design solutions. Nashik's leading interior design firm & factory outlet with 1000+ projects delivered. Call +91 9423640903.",
  image = "/favicon.png",
  url = "https://mrtraders.site",
  type = "website"
}: SEOProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "MR Traders & Factory Outlet",
    "image": image,
    "description": description,
    "@id": url,
    "url": url,
    "telephone": "+91 9423640903",
    "email": "mrtradersofficial01@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Nilgiri Baug, Sambhaji Nagar Road, Nandura Naka",
      "addressLocality": "Nashik",
      "postalCode": "422003",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 20.0000,
      "longitude": 73.7898
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "19:00"
    },
    "sameAs": [
      "https://www.instagram.com/mr_traders.10",
      "https://www.facebook.com/mrtradersofficial"
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}