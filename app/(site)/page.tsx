import Hero from "@/components/Hero";
import MarqueeSection from "@/components/MarqueeSection";
import HallsSection from "@/components/HallsSection";
import IntroSection from "@/components/IntroSection";
import StatsGrid from "@/components/StatsGrid";
import CTASection from "@/components/CTASection";
import FeaturedCarousel from "@/components/FeaturedCarousel";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeSection />
      <HallsSection />
      <IntroSection />
      {/* Include StatsGrid and FeaturedCarousel if you are still using them */}
      <CTASection />
    </>
  );
}