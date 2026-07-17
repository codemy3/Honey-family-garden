import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import FloatingReview from "@/components/FloatingReview";

export const metadata: Metadata = {
  title: {
    default: "Honey Family Garden Restaurant | Premium Event Venue in Shimoga",
    template: "%s | Honey Family Garden Restaurant",
  },
  description:
    "Premium restaurant and event venue in Shimoga, Karnataka. Host weddings, corporate events, and family celebrations in our botanical garden (150-200 guests) or private AC hall (30-60 guests). Multi-cuisine catering & guest accommodations available.",
  keywords: [
    "event venue Shimoga",
    "wedding hall Shimoga",
    "garden restaurant Karnataka",
    "Honey Family Garden",
    "banquet hall Shimoga",
    "corporate event venue",
    "party hall Shimoga",
  ],
  openGraph: {
    title: "Honey Family Garden Restaurant | Premium Event Venue in Shimoga",
    description:
      "Where celebrations bloom. Premium venue for weddings, corporate events & family functions in Shimoga.",
    type: "website",
    locale: "en_IN",
    siteName: "Honey Family Garden Restaurant",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#102E4A",
              color: "#FFF7E6",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              borderRadius: "8px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#D4AF37",
                secondary: "#102E4A",
              },
            },
            error: {
              iconTheme: {
                primary: "#E24B4A",
                secondary: "#FFF7E6",
              },
            },
          }}
        />
        <Navbar />
        <SmoothScrollProvider>
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScrollProvider>
        <FloatingReview />
      </body>
    </html>
  );
}
