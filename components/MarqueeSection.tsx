"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const images = [
  { src: "/images/food.webp", alt: "Gourmet food selection 1" },
  { src: "/images/food2.webp", alt: "Gourmet food selection 2" },
  { src: "/images/food3.webp", alt: "Gourmet food selection 3" },
  { src: "/images/food4.webp", alt: "Gourmet food selection 4" },
  { src: "/images/food5.webp", alt: "Gourmet food selection 5" },
];

// 1. Decorative Golden Sparks SVG
function GoldenSparks({ className = "w-8 h-8 md:w-10 md:h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 54 44" 
      fill="none" 
      className={className}
      aria-hidden="true"
    >
      <path d="M19.5 3C21.8 1.5 25.5 2.8 26.8 5.2L34.2 18.5C35.5 20.9 34.2 24.2 31.8 25.5C29.5 26.8 25.8 25.5 24.5 23.1L17.1 9.8C15.8 7.4 17.1 4.3 19.5 3Z" fill="#FBA819" />
      <path d="M5.2 21.5C7.5 20.2 11.2 21.5 12.5 23.9L17.8 33.5C19.1 35.9 17.8 39.2 15.5 40.5C13.2 41.8 9.5 40.5 8.2 38.1L2.9 28.5C1.6 26.1 2.9 22.8 5.2 21.5Z" fill="#FBA819" />
    </svg>
  );
}

// 2. Decorative Swirl/Flourish SVG
function GoldenSwirl({ className = "w-4 h-6 md:w-5 md:h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 20 32" 
      fill="none" 
      className={className}
      aria-hidden="true"
    >
      <path d="M15.2 2.5C17.5 4.2 18.2 8.5 16.5 11.2C14.8 13.9 11.5 15.5 8.8 18.2C6.1 20.9 4.5 24.5 5.8 28.2" stroke="#FBA819" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

// --- Dynamic Frame Sizing Logic ---
const getCardDimensions = (idx: number) => {
  const styleType = idx % 4;
  switch (styleType) {
    case 0: return "w-[160px] h-[240px] md:w-[280px] md:h-[400px]"; // Tall Portrait
    case 1: return "w-[220px] h-[160px] md:w-[340px] md:h-[240px]"; // Wide Landscape
    case 2: return "w-[140px] h-[180px] md:w-[220px] md:h-[280px]"; // Small Accent
    case 3: return "w-[180px] h-[200px] md:w-[260px] md:h-[300px]"; // Medium Boxy
    default: return "w-[160px] h-[240px] md:w-[280px] md:h-[400px]";
  }
};

export default function MarqueeSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<HTMLDivElement>(null);
  
  const isInteracting = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (headerRef.current && sparksRef.current) {
      gsap.fromTo(
        sparksRef.current,
        { scale: 0, opacity: 0, rotation: -20 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    const tween = gsap.fromTo(
      track,
      { xPercent: -50 },
      {
        xPercent: 0,
        ease: "none",
        duration: 15, // FIX: Reduced from 25 to 15 to make the baseline speed faster
        repeat: -1,
      }
    );

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: track,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const vel = self.getVelocity();
        const multiplier = 1 + vel / 250;
        const skew = gsap.utils.clamp(-6, 6, vel / -200);

        gsap.to(tween, {
          timeScale: multiplier,
          duration: 0.4,
          overwrite: "auto",
        });
        
        gsap.to(track.children, {
          skewX: skew,
          duration: 0.5,
          overwrite: "auto",
        });
      },
    });

    const tickListener = () => {
      const currentScale = tween.timeScale();
      const target = isInteracting.current ? 0.05 : 1.0;
      
      if (Math.abs(currentScale - target) > 0.01) {
        tween.timeScale(gsap.utils.interpolate(currentScale, target, 0.06));
      }

      gsap.to(track.children, {
        skewX: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    gsap.ticker.add(tickListener);

    return () => {
      tween.kill();
      scrollTriggerInstance.kill();
      gsap.ticker.remove(tickListener);
    };
  }, []);

  const duplicatedImages = [...images, ...images];

  return (
    <section className="w-full bg-[#FDFBF7] pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden flex flex-col items-center">
      
      {/* FIX: Changed 'mb-12' to 'mb-4' in the div below to reduce the gap on mobile devices */}
      <div ref={headerRef} className="flex flex-col items-center text-center px-4 mb-4 md:mb-16 relative z-10">
        <span className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37] mb-3 block">
          Experience Culinary Artistry
        </span>
        <div className="relative inline-block px-4 py-2 md:px-6">
          <div ref={sparksRef} className="absolute -top-1 left-2 md:-top-6 md:-left-6 pointer-events-none transform -translate-x-1/2">
            <GoldenSparks className="w-6 h-6 md:w-11 md:h-11 drop-shadow-sm" />
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1E3A2F] tracking-tight flex flex-col sm:flex-row items-center justify-center gap-y-2 sm:gap-x-3 leading-tight">
            <span>A Feast for the</span>
            <span className="relative inline-flex items-center text-[#FBA819] font-serif italic font-normal pr-1">
              Sense&apos;s!
            </span>
          </h2>
        </div>
        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-4 opacity-70" />
      </div>

      <div className="w-full overflow-hidden relative py-4">
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none" />

        <div
          ref={trackRef}
          onMouseEnter={() => (isInteracting.current = true)}
          onMouseLeave={() => (isInteracting.current = false)}
          onTouchStart={() => (isInteracting.current = true)}
          onTouchEnd={() => (isInteracting.current = false)}
          className="flex items-center gap-4 md:gap-8 w-fit will-change-transform px-4"
        >
          {duplicatedImages.map((img, idx) => (
            <div
              key={idx}
              style={{ "--rot": idx % 2 === 0 ? "-2.5deg" : "2.5deg" } as React.CSSProperties}
              className={`marquee-card ${getCardDimensions(idx)} rounded-2xl md:rounded-[36px] overflow-hidden shadow-lg flex-shrink-0 relative group border border-[#D4AF37]/20 cursor-pointer bg-white`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 240px, 340px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102E4A]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-card {
          transform: rotate(var(--rot));
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .marquee-card:hover {
          transform: rotate(0deg) scale(1.04) !important;
          border-color: rgba(251, 168, 25, 0.6);
          box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.15);
          z-index: 20;
        }
      `}</style>
    </section>
  );
}