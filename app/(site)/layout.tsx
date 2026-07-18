import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import FloatingReview from "@/components/FloatingReview";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <SmoothScrollProvider>
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScrollProvider>
      <FloatingReview />
    </>
  );
}
