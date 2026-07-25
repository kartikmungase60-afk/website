import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { LayoutWrapper } from "./components/layout-wrapper";
import { CurrencyProvider } from "./components/ui/InrPricing";
import AosInit from "./components/AosInit";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: "dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#09090b" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" }
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://hostlixo.com"),
  title: {
    default: "Hostlixo Cloud | Minecraft, VPS, Bot & Web Hosting India",
    template: "%s | Hostlixo Cloud"
  },
  description: "Hostlixo Cloud provides Minecraft server hosting, AMD Ryzen VPS hosting, Discord bot hosting and web hosting in India with NVMe storage, INR pricing and DDoS-filtered connectivity.",
  keywords: [
    "Hostlixo Cloud",
    "Minecraft hosting India",
    "Minecraft server hosting India",
    "VPS hosting India",
    "Discord bot hosting",
    "bot hosting India",
    "web hosting India",
    "AMD Ryzen VPS",
    "NVMe hosting India",
    "Mumbai hosting"
  ],
  authors: [{ name: "Hostlixo Cloud" }],
  creator: "Hostlixo Cloud",
  publisher: "Hostlixo Cloud",
  category: "Cloud Hosting",
  classification: "Cloud hosting and managed infrastructure",
  
  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://hostlixo.com",
    siteName: "Hostlixo Cloud",
    title: "Hostlixo Cloud | Minecraft, VPS, Bot & Web Hosting India",
    description: "Minecraft hosting, VPS hosting, Discord bot hosting and web hosting from an India-based cloud platform.",
    images: [
      {
        url: "https://hostlixo.com/assets/branding/hostlixo-social-banner.png",
        width: 1200,
        height: 630,
        alt: "Hostlixo India game server hosting and VPS infrastructure in Mumbai",
        type: "image/png"
      }
    ]
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Hostlixo Cloud | Minecraft, VPS, Bot & Web Hosting India",
    description: "India-based Minecraft hosting, VPS hosting, Discord bot hosting and web hosting with clear monthly pricing.",
    images: ["https://hostlixo.com/assets/branding/hostlixo-social-banner.png"]
  },

  // Additional metadata with bot protection
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  applicationName: "Hostlixo Cloud",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "64x64", type: "image/x-icon" }
    ],
    apple: [
      { url: "/assets/branding/hostlixo-logo.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: "/favicon.ico"
  },

  alternates: {
    canonical: "https://hostlixo.com",
    languages: { "en-IN": "https://hostlixo.com" }
  },
  other: {
    "msapplication-TileColor": "#09090b",
    "terms-of-service": "https://hostlixo.com/terms-of-services",
    "privacy-policy": "https://hostlixo.com/privacy-policy"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hostlixo Cloud" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://hostlixo.com/#organization",
              "name": "Hostlixo Cloud",
              "alternateName": "Hostlixo",
              "url": "https://hostlixo.com",
              "logo": "https://hostlixo.com/icon.svg",
              "description": "India-based Minecraft server hosting, VPS hosting, Discord bot hosting and web hosting headquartered in Mumbai",
              "slogan": "Dark, fast hosting for games, apps and websites",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "addressCountry": "IN"
              },
              "knowsAbout": ["Minecraft hosting India", "VPS hosting India", "Discord bot hosting", "web hosting India", "AMD Ryzen VPS", "NVMe storage"],
              "areaServed": [
                { "@type": "Country", "name": "India" },
                { "@type": "Country", "name": "Singapore" },
                { "@type": "Country", "name": "Germany" },
                { "@type": "Country", "name": "United States" }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Hostlixo Cloud Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Minecraft Hosting",
                      "description": "Minecraft server hosting with assigned RAM, NVMe storage, backups and DDoS filtering"
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "Service",
                      "name": "VPS Hosting",
                      "description": "Virtual private servers with full root access"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Discord Bot Hosting",
                      "description": "Managed bot runtimes with automatic restart and file access"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Web Hosting",
                      "description": "Web hosting for websites, stores and applications across four global regions"
                    }
                  }
                ]
              },
              "sameAs": [
                "https://discord.gg/97CrJNkJ2T"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"],
                "serviceType": "Technical Support",
                "url": "https://control.hostlixo.com",
                "email": "support@hostlixo.com"
              },
              "location": {
                "@type": "Place",
                "name": "Hostlixo Cloud Mumbai Headquarters",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Mumbai",
                  "addressRegion": "Maharashtra",
                  "addressCountry": "IN"
                }
              },
              "brand": {
                "@type": "Brand",
                "name": "Hostlixo Cloud"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://hostlixo.com/#website",
              "url": "https://hostlixo.com",
              "name": "Hostlixo Cloud",
              "alternateName": "Hostlixo",
              "description": "India-based Minecraft hosting, VPS hosting, Discord bot hosting and web hosting headquartered in Mumbai",
              "inLanguage": "en-IN",
              "publisher": {
                "@id": "https://hostlixo.com/#organization"
              }
            })
          }}
        />
      </head>
      <body
        className="antialiased min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AosInit />
          <CurrencyProvider>
          {/* Grid background */}
          <div className="fixed inset-0 pointer-events-none z-0 opacity-15"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
