"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Leaf, Snowflake } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export default function HallInfoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for Hero Expansion
  const heroTrackRef = useRef<HTMLDivElement>(null); 
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const heroImageWrapperRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);

  // Refs for Scroll Animations
  const gardenSectionRef = useRef<HTMLDivElement>(null);
  const hallSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add({
        isMobile: "(max-width: 767px)",
        isDesktop: "(min-width: 768px)"
      }, (context) => {
        let { isMobile } = context.conditions as { isMobile: boolean };

        // 1. Set Initial Clip Path
        const initialClip = isMobile 
          ? "inset(25% 10% 25% 10% round 16px)" 
          : "inset(20% 30% 20% 30% round 24px)";

        gsap.set(heroImageWrapperRef.current, { clipPath: initialClip });

        // 2. HERO EXPAND SCROLL
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroTrackRef.current,
            start: "top top",
            end: "bottom bottom", 
            scrub: 0.5, 
          },
        });

        heroTl
          .to(heroImageWrapperRef.current, {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
          }, 0)
          .fromTo(heroImageRef.current, {
            scale: 1.4,
          }, {
            scale: 1, 
            ease: "none",
          }, 0)
          .to(heroTextRef.current, {
            opacity: 0,
            scale: 0.9,
            y: -50,
            ease: "none",
          }, 0);
      });

      // 3. HALL SECTIONS PARALLAX & ENTRANCE
      const animateSection = (triggerRef: any, rotation: number) => {
        gsap.fromTo(
          triggerRef.current.querySelector(".stamp-wrapper"),
          { y: 80, opacity: 0, rotation: rotation * 2 },
          {
            y: 0,
            opacity: 1,
            rotation: rotation,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: triggerRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          triggerRef.current.querySelectorAll(".text-animate"),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: triggerRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      };

      animateSection(gardenSectionRef, -3); 
      animateSection(hallSectionRef, 4);    

    }, containerRef);

    const timeoutId = setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      clearTimeout(timeoutId);
      ctx.revert(); 
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-[#FDFBF7] text-[#102E4A] overflow-clip">
      
      {/* Global CSS */}
      <style jsx global>{`
        .hfg-display { font-family: "Fraunces", ui-serif, Georgia, serif; }
        .hfg-body { font-family: "Work Sans", ui-sans-serif, system-ui, sans-serif; }
        .hfg-script { font-family: "Caveat", "Dancing Script", cursive; } 
        
        .stamp-wrapper {
          filter: drop-shadow(0 15px 30px rgba(16, 46, 74, 0.15));
          display: inline-block;
          will-change: transform, opacity;
        }
        
        .stamp-frame {
          position: relative;
          background-color: transparent;
          background-image: radial-gradient(circle at 6px, transparent 6px, #FFFFFF 6.5px);
          background-size: 20px 20px;
          background-position: -6px -6px;
          padding: 16px 16px 40px 16px; 
        }

        .stamp-frame::before {
          content: "";
          position: absolute;
          inset: 10px; 
          background-color: #FFFFFF;
          z-index: 0;
        }

        .stamp-content {
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* --- 1. IMMERSIVE HERO EXPANSION (NATIVE STICKY) --- */}
      {/* 
        CHANGED: h-[200vh] to h-[135vh] 
        This dramatically shortens the scroll distance needed to fully open the image.
      */}
      <section ref={heroTrackRef} className="relative w-full h-[135vh] bg-[#FDFBF7]">
        
        <div className="sticky top-0 w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-white">
          
          <h1 
            ref={heroTextRef}
            className="absolute inset-0 flex items-center justify-center font-display hfg-display text-[15vw] md:text-[12vw] font-bold text-[#102E4A] leading-none tracking-tight text-center z-0 will-change-transform"
          >
            THE SPACES
          </h1>

          <div 
            ref={heroImageWrapperRef}
            className="absolute inset-0 z-10 w-full h-full overflow-hidden pointer-events-none will-change-[clip-path]"
            style={{ transform: "translateZ(0)" }}
          >
            <Image
              ref={heroImageRef}
              src="/images/hero.jpg"
              alt="Honey Family Garden Spaces"
              fill
              className="object-cover origin-center will-change-transform"
              priority
            />
            <div className="absolute inset-0 bg-[#102E4A]/20 pointer-events-none" />
            
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
              <span className="font-body hfg-body text-[10px] uppercase tracking-[0.2em] text-white mb-4 drop-shadow-md">Scroll to Explore</span>
              <div className="w-px h-16 bg-white shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* --- Torn Paper SVG Edge Divider --- */}
      <div className="w-full h-12 md:h-16 relative -mt-12 md:-mt-16 z-20 pointer-events-none text-[#FDFBF7]">
        <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 48H1440V0C1440 0 1380 24 1320 20C1260 16 1200 -4 1140 4C1080 12 1020 36 960 32C900 28 840 8 780 12C720 16 660 36 600 32C540 28 480 8 420 12C360 16 300 36 240 32C180 28 120 8 60 12C30 14 0 24 0 24V48Z" fill="currentColor"/>
        </svg>
      </div>

      {/* --- 2. HALL ONE: BOTANICAL GARDEN --- */}
      <section ref={gardenSectionRef} className="relative w-full py-24 md:py-32 bg-[#FDFBF7] overflow-hidden hw-accelerate">
        <div className="absolute inset-0 w-full h-full opacity-[0.25] pointer-events-none z-0">
          <Image 
            src="/images/about-bg.png" 
            alt="Botanical Sketch" 
            fill 
            className="object-cover object-center mix-blend-multiply" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-20 relative z-10">
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <div className="stamp-wrapper w-[300px] md:w-[450px]">
              <div className="stamp-frame">
                <div className="stamp-content">
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <Image src="/images/outdoor.jpeg" alt="Botanical Garden Venue" fill className="object-cover" />
                  </div>
                  <div className="pt-4 pb-2 text-center">
                    <span className="font-display hfg-display text-[#102E4A] text-xl opacity-80">The Garden</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="text-animate flex items-center gap-2 mb-4 will-change-transform">
              <Leaf className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-body text-[#102E4A] text-xs font-bold tracking-widest uppercase">Outdoor Spaces</span>
            </div>
            
            <h2 className="text-animate font-display hfg-display text-5xl md:text-7xl text-[#102E4A] leading-[1.1] mb-6 drop-shadow-sm will-change-transform">
              Botanical <br/> 
              <span className="hfg-script text-[#D4AF37] text-6xl md:text-8xl -ml-2">Garden</span>
            </h2>

            <p className="text-animate font-body hfg-body text-[#102E4A]/90 text-base md:text-lg max-w-md leading-relaxed mb-8 font-medium will-change-transform">
              Celebrate under the stars in our lush botanical sanctuary. Dressed with elegant overhead canopy lighting, this open-air venue offers the perfect magical backdrop for grand gatherings.
            </p>

            <div className="text-animate flex flex-wrap gap-8 mb-10 border-l-2 border-[#D4AF37] pl-6 bg-white/40 p-4 rounded-r-lg backdrop-blur-sm will-change-transform">
              <div>
                <span className="block font-body text-[10px] uppercase tracking-widest text-[#102E4A]/70 mb-1 font-bold">Capacity</span>
                <span className="font-display hfg-display text-2xl text-[#102E4A]">150-250</span>
              </div>
              <div>
                <span className="block font-body text-[10px] uppercase tracking-widest text-[#102E4A]/70 mb-1 font-bold">Scale</span>
                <span className="font-display hfg-display text-2xl text-[#102E4A]">8,000 sq ft</span>
              </div>
            </div>

            <div className="text-animate will-change-transform">
              <Link href="/contact" className="inline-flex items-center justify-center bg-[#D4AF37] text-[#102E4A] font-bold text-xs uppercase tracking-widest px-8 py-4 hover:bg-[#102E4A] hover:text-[#FDFBF7] transition-colors duration-300 shadow-lg">
                Book This Space
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. HALL TWO: PRIVATE AC HALL --- */}
      <section ref={hallSectionRef} className="relative w-full py-24 md:py-32 bg-[#FDFBF7] overflow-hidden hw-accelerate">
        <div className="absolute inset-0 w-full h-full opacity-[0.25] pointer-events-none z-0">
          <Image 
            src="/images/about-bg2.png" 
            alt="AC Hall Sketch" 
            fill 
            className="object-cover object-center mix-blend-multiply" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-10 flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-20 relative z-10">
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="text-animate flex items-center gap-2 mb-4 will-change-transform">
              <Snowflake className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-body text-[#102E4A] text-xs font-bold tracking-widest uppercase">Climate Controlled</span>
            </div>
            
            <h2 className="text-animate font-display hfg-display text-5xl md:text-7xl text-[#102E4A] leading-[1.1] mb-6 drop-shadow-sm will-change-transform">
              Private <br/> 
              <span className="hfg-script text-[#D4AF37] text-6xl md:text-8xl -ml-2">AC Hall</span>
            </h2>

            <p className="text-animate font-body hfg-body text-[#102E4A]/90 text-base md:text-lg max-w-md leading-relaxed mb-8 font-medium will-change-transform">
              Sophisticated and intimate. Engineered for absolute comfort with integrated acoustics, bespoke lighting, and premium banquet arrangements for your most important indoor gatherings.
            </p>

            <div className="text-animate flex flex-wrap gap-8 mb-10 border-l-2 border-[#D4AF37] pl-6 bg-white/40 p-4 rounded-r-lg backdrop-blur-sm will-change-transform">
              <div>
                <span className="block font-body text-[10px] uppercase tracking-widest text-[#102E4A]/70 mb-1 font-bold">Capacity</span>
                <span className="font-display hfg-display text-2xl text-[#102E4A]">30-60</span>
              </div>
              <div>
                <span className="block font-body text-[10px] uppercase tracking-widest text-[#102E4A]/70 mb-1 font-bold">Scale</span>
                <span className="font-display hfg-display text-2xl text-[#102E4A]">2,500 sq ft</span>
              </div>
            </div>

            <div className="text-animate will-change-transform">
              <Link href="/contact" className="inline-flex items-center justify-center bg-[#D4AF37] text-[#102E4A] font-bold text-xs uppercase tracking-widest px-8 py-4 hover:bg-[#102E4A] hover:text-[#FDFBF7] transition-colors duration-300 shadow-lg">
                Book This Space
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="stamp-wrapper w-[300px] md:w-[450px]">
              <div className="stamp-frame">
                <div className="stamp-content">
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <Image src="/images/indoor.png" alt="Private AC Hall Venue" fill className="object-cover grayscale-[10%]" />
                  </div>
                  <div className="pt-4 pb-2 text-center">
                    <span className="font-display hfg-display text-[#102E4A] text-xl opacity-80">Indoor Hall</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}