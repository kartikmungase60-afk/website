interface ServiceSchemaProps {
  name: string
  description: string
  path: string
  serviceType: string
}

export default function ServiceSchema({ name, description, path, serviceType }: ServiceSchemaProps) {
  const url = `https://hostlixo.com${path}`
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name,
        description,
        url,
        serviceType,
        provider: { "@id": "https://hostlixo.com/#organization" },
        areaServed: [
          { "@type": "Country", name: "India" },
          { "@type": "Country", name: "Singapore" },
          { "@type": "Country", name: "Germany" },
          { "@type": "Country", name: "United States" },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Hostlixo Cloud", item: "https://hostlixo.com" },
          { "@type": "ListItem", position: 2, name, item: url },
        ],
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
