import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FIFTH ORBIT | Custom Software, ERP Systems & AI Automation",
    template: "%s | FIFTH ORBIT"
  },
  description:
    "FIFTH ORBIT is a premium technology consulting and software development agency. We build custom ERP systems, AI automation, analytics platforms, and digital transformation solutions that scale businesses.",
  keywords: [
    "AI Automation Company",
    "Software Development Company",
    "ERP Development Services",
    "Business Automation Solutions",
    "Custom Software Development",
    "Analytics Dashboard Development",
    "Manufacturing ERP System",
    "Website Development Services",
    "Enterprise Software Solutions",
    "Digital Transformation Services",
  ],
  metadataBase: new URL("https://fifthorbit.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "FIFTH ORBIT | Custom Software, ERP Systems & AI Automation",
    description:
      "Engineering digital growth through custom software, AI automation, enterprise ERP systems, and analytics dashboards.",
    url: "https://fifthorbit.com",
    siteName: "FIFTH ORBIT",
    images: [{ url: "/black.png", width: 1200, height: 630, alt: "FIFTH ORBIT" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIFTH ORBIT | Custom Software, ERP Systems & AI Automation",
    description:
      "Engineering digital growth through custom software, AI automation, enterprise ERP systems, and analytics dashboards.",
    images: ["/black.png"],
    creator: "@fifthorbit",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FIFTH ORBIT",
    alternateName: "Fifth Orbit Technology Consulting",
    url: "https://fifthorbit.com",
    logo: "https://fifthorbit.com/black.png",
    sameAs: [
      "https://twitter.com/fifthorbit",
      "https://www.linkedin.com/company/fifthorbit",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-80747-63113",
      contactType: "sales",
      areaServed: "Worldwide",
      availableLanguage: "en",
    },
    description:
      "Premium technology consulting & custom software development agency specialising in ERP development, AI automation, and enterprise analytics dashboards.",
  };

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
