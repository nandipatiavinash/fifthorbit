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
    default: "FIFTH ORBIT | Best Custom Software & AI Automation Agency",
    template: "%s | FIFTH ORBIT"
  },
  description:
    "FIFTH ORBIT is a premium custom software development and AI automation consulting agency. We build high-performance custom ERP systems, intelligent AI workflow automation, enterprise analytics dashboards, and digital transformation solutions.",
  keywords: [
    "Best Custom Software Development Agency",
    "Top AI Automation Consulting Agency",
    "AI Workflow Automation Agency",
    "Enterprise ERP Systems Agency",
    "Bespoke CRM & Software Engineering",
    "Premium Software Development Agency",
    "Corporate Digital Transformation",
    "Next.js Software Agency",
    "Manufacturing ERP Solutions",
    "Salon & Retail Tech Consulting",
    "Business Process Automation Developers",
    "AI Integration Solutions",
  ],
  metadataBase: new URL("https://fifthorbit.com"),
  alternates: { canonical: "/" },
  verification: {
    google: "uoq8RTEL72G0-E9Y0VxIYrDgFVY2Tgf-g7KYT64CzOw",
  },
  openGraph: {
    title: "FIFTH ORBIT | Best Custom Software & AI Automation Agency",
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
    title: "FIFTH ORBIT | Best Custom Software & AI Automation Agency",
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
