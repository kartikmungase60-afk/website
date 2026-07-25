import type { Metadata } from "next"

interface PageSeo {
  title: string
  description: string
  path: string
  keywords: string[]
}

export function createPageMetadata({ title, description, path, keywords }: PageSeo): Metadata {
  const url = `https://hostlixo.com${path}`
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: { "en-IN": url },
    },
    openGraph: {
      title: `${title} | Hostlixo Cloud`,
      description,
      url,
      siteName: "Hostlixo Cloud",
      locale: "en_IN",
      type: "website",
      images: [{ url: "/assets/branding/hostlixo-social-banner.png", width: 1200, height: 630, alt: `${title} by Hostlixo Cloud` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Hostlixo Cloud`,
      description,
      images: ["/assets/branding/hostlixo-social-banner.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  }
}
