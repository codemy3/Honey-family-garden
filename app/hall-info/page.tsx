"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Leaf, Snowflake } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HallInfoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for Hero Expansion
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

    let ctx: gsap.Context;

    // Small delay ensures Next.js has completed routing and DOM is painted
    // before ScrollTrigger calculates positions for the pinned hero.
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
      
      ctx = gsap.context(() => {
        // 1. HERO EXPAND SCROLL
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero-container",
            start: "top top",
            end: "+=100%",
            scrub: true,
            pin: true,
          },
        });

        heroTl
          .to(heroImageWrapperRef.current, {
            width: "100vw",
            height: "100vh",
            y: 0,
            ease: "none",
          }, 0)
          .to(heroImageRef.current, {
            scale: 1, 
            ease: "none",
          }, 0)
          .to(heroTextRef.current, {
            opacity: 0,
            y: -50,
            scale: 0.95,
            ease: "none",
          }, 0);

        // 2. HALL SECTIONS PARALLAX & ENTRANCE
        const animateSection = (triggerRef: any, rotation: number) => {
          // Floating Stamp Animation
          gsap.fromTo(
            triggerRef.current.querySelector(".stamp-wrapper"),
            { y: 100, opacity: 0, rotation: rotation * 2 },
            {
              y: 0,
              opacity: 1,
              rotation: rotation,
              duration: 1.5,
              ease: "back.out(1.2)",
              scrollTrigger: {
                trigger: triggerRef.current,
                start: "top 65%",
              },
            }
          );

          // Text Stagger Animation
          gsap.fromTo(
            triggerRef.current.querySelectorAll(".text-animate"),
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.15,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: triggerRef.current,
                start: "top 75%",
              },
            }
          );
        };

        animateSection(gardenSectionRef, -3); // Garden Stamp tilts left
        animateSection(hallSectionRef, 4);    // Hall Stamp tilts right

      }, containerRef);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-[#FDFBF7] text-[#102E4A] overflow-hidden">
      
      {/* Global CSS */}
      <style jsx global>{`
        .hfg-display { font-family: "Fraunces", ui-serif, Georgia, serif; }
        .hfg-body { font-family: "Work Sans", ui-sans-serif, system-ui, sans-serif; }
        .hfg-script { font-family: "Caveat", "Dancing Script", cursive; } 
        
        .stamp-wrapper {
          filter: drop-shadow(0 15px 30px rgba(16, 46, 74, 0.15));
          display: inline-block;
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

      {/* --- 1. IMMERSIVE HERO EXPANSION --- */}
      <section className="hero-container relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
        <h1 
          ref={heroTextRef}
          className="absolute font-display hfg-display text-[12vw] font-light text-[#102E4A] leading-none tracking-tight text-center z-0"
        >
          THE SPACES
        </h1>

        <div 
          ref={heroImageWrapperRef}
          className="relative z-10 w-[40vw] h-[50vh] overflow-hidden shadow-2xl flex items-center justify-center border border-[#102E4A]/10"
          style={{ willChange: "width, height" }}
        >
          <Image
            ref={heroImageRef}
            src="/images/hero.jpg"
            alt="Honey Family Garden Spaces"
            fill
            className="object-cover scale-125 origin-center"
            priority
          />
          <div className="absolute inset-0 bg-[#102E4A]/10 pointer-events-none" />
          
          <div className="absolute bottom-10 flex flex-col items-center pointer-events-none">
            <span className="font-body hfg-body text-[10px] uppercase tracking-[0.2em] text-white mb-4">Explore</span>
            <div className="w-px h-16 bg-white" />
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
      <section ref={gardenSectionRef} className="relative w-full py-24 md:py-32 bg-[#FDFBF7] overflow-hidden">
        
        {/* FULL WIDTH BACKGROUND IMAGE */}
        <div className="absolute inset-0 w-full h-full opacity-[0.25] pointer-events-none z-0">
          <Image 
            src="/images/about-bg.png" 
            alt="Botanical Sketch" 
            fill 
            className="object-cover object-center mix-blend-multiply" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-20 relative z-10">
          
          {/* Stamp Photo (Left Side) */}
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

          {/* Text Content (Right Side) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="text-animate flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-body text-[#102E4A] text-xs font-bold tracking-widest uppercase">Outdoor Spaces</span>
            </div>
            
            <h2 className="text-animate font-display hfg-display text-5xl md:text-7xl text-[#102E4A] leading-[1.1] mb-6 drop-shadow-sm">
              Botanical <br/> 
              <span className="hfg-script text-[#D4AF37] text-6xl md:text-8xl -ml-2">Garden</span>
            </h2>

            <p className="text-animate font-body hfg-body text-[#102E4A]/90 text-base md:text-lg max-w-md leading-relaxed mb-8 font-medium">
              Celebrate under the stars in our lush botanical sanctuary. Dressed with elegant overhead canopy lighting, this open-air venue offers the perfect magical backdrop for grand gatherings.
            </p>

            <div className="text-animate flex flex-wrap gap-8 mb-10 border-l-2 border-[#D4AF37] pl-6 bg-white/40 p-4 rounded-r-lg backdrop-blur-sm">
              <div>
                <span className="block font-body text-[10px] uppercase tracking-widest text-[#102E4A]/70 mb-1 font-bold">Capacity</span>
                <span className="font-display hfg-display text-2xl text-[#102E4A]">150-250</span>
              </div>
              <div>
                <span className="block font-body text-[10px] uppercase tracking-widest text-[#102E4A]/70 mb-1 font-bold">Scale</span>
                <span className="font-display hfg-display text-2xl text-[#102E4A]">8,000 sq ft</span>
              </div>
            </div>

            <div className="text-animate">
              <Link href="/contact" className="inline-flex items-center justify-center bg-[#D4AF37] text-[#102E4A] font-bold text-xs uppercase tracking-widest px-8 py-4 hover:bg-[#102E4A] hover:text-[#FDFBF7] transition-colors duration-300 shadow-lg">
                Book This Space
              </Link>
            </div>
          </div>

        </div>
      </section>



      {/* --- 3. HALL TWO: PRIVATE AC HALL --- */}
      <section ref={hallSectionRef} className="relative w-full py-24 md:py-32 bg-[#FDFBF7] overflow-hidden">
        
        {/* FULL WIDTH BACKGROUND IMAGE */}
        <div className="absolute inset-0 w-full h-full opacity-[0.25] pointer-events-none z-0">
          <Image 
            src="/images/about-bg2.png" 
            alt="AC Hall Sketch" 
            fill 
            className="object-cover object-center mix-blend-multiply" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-10 flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-20 relative z-10">
          
          {/* Text Content (Left Side) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="text-animate flex items-center gap-2 mb-4">
              <Snowflake className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-body text-[#102E4A] text-xs font-bold tracking-widest uppercase">Climate Controlled</span>
            </div>
            
            <h2 className="text-animate font-display hfg-display text-5xl md:text-7xl text-[#102E4A] leading-[1.1] mb-6 drop-shadow-sm">
              Private <br/> 
              <span className="hfg-script text-[#D4AF37] text-6xl md:text-8xl -ml-2">AC Hall</span>
            </h2>

            <p className="text-animate font-body hfg-body text-[#102E4A]/90 text-base md:text-lg max-w-md leading-relaxed mb-8 font-medium">
              Sophisticated and intimate. Engineered for absolute comfort with integrated acoustics, bespoke lighting, and premium banquet arrangements for your most important indoor gatherings.
            </p>

            <div className="text-animate flex flex-wrap gap-8 mb-10 border-l-2 border-[#D4AF37] pl-6 bg-white/40 p-4 rounded-r-lg backdrop-blur-sm">
              <div>
                <span className="block font-body text-[10px] uppercase tracking-widest text-[#102E4A]/70 mb-1 font-bold">Capacity</span>
                <span className="font-display hfg-display text-2xl text-[#102E4A]">30-60</span>
              </div>
              <div>
                <span className="block font-body text-[10px] uppercase tracking-widest text-[#102E4A]/70 mb-1 font-bold">Scale</span>
                <span className="font-display hfg-display text-2xl text-[#102E4A]">2,500 sq ft</span>
              </div>
            </div>

            <div className="text-animate">
              <Link href="/contact" className="inline-flex items-center justify-center bg-[#D4AF37] text-[#102E4A] font-bold text-xs uppercase tracking-widest px-8 py-4 hover:bg-[#102E4A] hover:text-[#FDFBF7] transition-colors duration-300 shadow-lg">
                Book This Space
              </Link>
            </div>
          </div>

          {/* Stamp Photo (Right Side) */}
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