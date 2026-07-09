import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { SITE } from "@/lib/constants";
import { getSiteSettings } from "@/lib/settings";
import "./globals.css";

const geistSans = localFont({
  src: "../../public/fonts/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  display: "swap",
  preload: true,
});

const geistMono = localFont({
  src: "../../public/fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const siteName = settings.name;
  const siteTitle = settings.seo_title;
  const siteDescription = settings.seo_description;

  return {
    title: {
      default: `${siteName} — ${siteTitle}`,
      template: `%s — ${siteName}`,
    },
    description: siteDescription,
    metadataBase: new URL(SITE.url),
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName,
      title: `${siteName} — ${siteTitle}`,
      description: siteDescription,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} — ${siteTitle}`,
      description: siteDescription,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans`}
      >
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--foreground))",
            },
          }}
        />
      </body>
    </html>
  );
}
