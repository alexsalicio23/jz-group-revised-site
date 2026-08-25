import { getSiteUrl } from "@/app/site-url";
import type { TemplateSlug } from "@/app/templates/template-data";
import { getActiveCompanySite, groupSiteUrl } from "@/app/company-sites";
import { templates } from "@/app/templates/template-data";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type CatalogItem = {
  name: string;
  description?: string;
  path?: string;
};

const serviceAreas = ["Miami-Dade County", "Broward County", "Palm Beach County"];

const departments: Array<{ slug: TemplateSlug; name: string }> = [
  { slug: "demolition", name: "JZ Demolition" },
  { slug: "construction", name: "JZ Construction" },
  { slug: "waste-management", name: "JZ Waste Management" },
  { slug: "development", name: "JZ Development" },
];

function serializeJsonLd(value: object) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}

export function OrganizationStructuredData() {
  const base = getSiteUrl();
  const organizationId = `${base}/#organization`;
  const websiteId = `${base}/#website`;
  const activeCompany = getActiveCompanySite();

  if (activeCompany) {
    const company = templates[activeCompany];
    return (
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "LocalBusiness",
              "@id": organizationId,
              name: company.name,
              url: base,
              logo: `${base}/media/brand-logo.webp`,
              email: company.email,
              telephone: "+1-305-793-2984",
              description: company.introduction,
              parentOrganization: {
                "@type": "Organization",
                name: "JZ Group",
                url: groupSiteUrl,
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "15219 NW 60th Ave",
                addressLocality: "Miami Lakes",
                addressRegion: "FL",
                postalCode: "33014",
                addressCountry: "US",
              },
              areaServed: serviceAreas,
            },
            {
              "@type": "WebSite",
              "@id": websiteId,
              name: company.name,
              url: base,
              publisher: { "@id": organizationId },
              inLanguage: "en-US",
            },
          ],
        }}
      />
    );
  }

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "LocalBusiness",
            "@id": organizationId,
            name: "JZ Group",
            url: base,
            image: `${base}/media/og-image.jpg`,
            logo: `${base}/media/brand-logo.webp`,
            email: "estimating@jzdemo.com",
            telephone: "+1-305-793-2984",
            description: "Specialty demolition, construction, waste management, and development services for active and complex environments across South Florida.",
            address: {
              "@type": "PostalAddress",
              streetAddress: "15219 NW 60th Ave",
              addressLocality: "Miami Lakes",
              addressRegion: "FL",
              postalCode: "33014",
              addressCountry: "US",
            },
            areaServed: serviceAreas,
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+1-305-793-2984",
              email: "estimating@jzdemo.com",
              contactType: "estimating and project inquiries",
              areaServed: "US-FL",
            },
            department: departments.map((department) => ({
              "@id": `${base}/#${department.slug}`,
            })),
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "JZ Group service companies",
              itemListElement: departments.map((department) => ({
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: department.name,
                  url: `${base}/${department.slug}`,
                },
              })),
            },
          },
          {
            "@type": "WebSite",
            "@id": websiteId,
            name: "JZ Group",
            url: base,
            publisher: { "@id": organizationId },
            inLanguage: "en-US",
          },
          ...departments.map((department) => ({
            "@type": "Organization",
            "@id": `${base}/#${department.slug}`,
            name: department.name,
            url: `${base}/${department.slug}`,
            parentOrganization: { "@id": organizationId },
            areaServed: serviceAreas,
          })),
        ],
      }}
    />
  );
}

export function ServiceStructuredData({
  name,
  description,
  path,
  division,
  catalog = [],
}: {
  name: string;
  description: string;
  path: string;
  division?: TemplateSlug;
  catalog?: CatalogItem[];
}) {
  const base = getSiteUrl();
  const providerId = division ? `${base}/#${division}` : `${base}/#organization`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${base}${path}#service`,
        name,
        serviceType: name,
        description,
        url: `${base}${path}`,
        areaServed: serviceAreas,
        provider: { "@id": providerId },
        ...(catalog.length
          ? {
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: `${name} capabilities`,
                itemListElement: catalog.map((item) => ({
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: item.name,
                    ...(item.description ? { description: item.description } : {}),
                    ...(item.path ? { url: `${base}${item.path}` } : {}),
                  },
                })),
              },
            }
          : {}),
      }}
    />
  );
}

export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const base = getSiteUrl();

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${base}${item.path}`,
        })),
      }}
    />
  );
}
