"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealText from "@/components/RevealText";
import MagneticButton from "@/components/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Deep parallax pull on the background image
      gsap.fromTo(
        bgRef.current,
        { y: "-20%", scale: 1.1 },
        {
          y: "20%",
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Subtle scale-up of the content box
      gsap.fromTo(
        ".cta-content",
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48 overflow-hidden bg-[#102E4A]">
      {/* 1. Scroll-Triggered Parallax Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          ref={bgRef}
          src="/images/hero.jpg"
          alt="Honey Family Garden cinematic background setup"
          fill
          sizes="100vw"
          className="object-cover opacity-40 filter saturate-[0.5] contrast-[1.1]"
        />
        {/* Navy/Blue solid grade overlay for contrast */}
        <div className="absolute inset-0 bg-[#102E4A]/85 mix-blend-multiply pointer-events-none" />
        
        {/* Slow ambient gradient shift */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-color-dodge animate-gradient-shift pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 35% 45%, rgba(212, 175, 55, 0.2) 0%, transparent 60%), radial-gradient(circle at 65% 55%, rgba(139, 154, 107, 0.2) 0%, transparent 60%)",
            animation: "slow-gradient 14s ease-in-out infinite alternate",
          }}
          aria-hidden="true"
        />
      </div>

      <style jsx global>{`
        @keyframes slow-gradient {
          0% { transform: translate(-3%, -3%) scale(1.0); }
          100% { transform: translate(3%, 3%) scale(1.08); }
        }
      `}</style>

      {/* 3. Centered Content Container */}
      <div className="cta-content relative z-10 max-w-4xl mx-auto px-6 sm:px-12 text-center flex flex-col items-center">
        <span className="font-body hfg-body text-xs font-semibold uppercase tracking-[0.4em] text-[#D4AF37] mb-6 block">
          Begin Your Journey
        </span>

        {/* Heavy headline reveal */}
        <RevealText
          tag="h2"
          stagger={0.12}
          className="font-display hfg-display font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#FDFBF7] mb-8 leading-[1.1] max-w-3xl drop-shadow-2xl"
        >
          Ready to Host Your <br />
          <span className="italic font-medium text-[#D4AF37]">Special Event?</span>
        </RevealText>

        <p className="font-body hfg-body text-base md:text-lg text-[#FDFBF7]/80 max-w-2xl mb-14 leading-relaxed font-light">
          Let us create an unforgettable experience for you and your guests.
          From intimate gatherings to grand wedding banquets, we bring your vision to life.
        </p>

        {/* CTAs */}
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 w-full px-2 sm:px-0">
          <MagneticButton className="flex-1 sm:flex-none flex justify-center w-full">
            <Link
              href="/contact"
              className="w-full px-2 sm:px-10 py-3.5 sm:py-4 bg-[#D4AF37] hover:bg-[#FDFBF7] text-[#102E4A] font-bold text-[9px] sm:text-xs tracking-[0.05em] sm:tracking-[0.15em] uppercase rounded-full transition-all duration-300 shadow-[0_10px_30px_rgba(212,175,55,0.2)] sm:min-w-[220px] text-center flex items-center justify-center whitespace-nowrap"
            >
              Get in Touch
            </Link>
          </MagneticButton>
          <MagneticButton className="flex-1 sm:flex-none flex justify-center w-full">
            <Link
              href="/hall-info"
              className="w-full px-2 sm:px-10 py-3.5 sm:py-4 border-2 border-[#FDFBF7]/30 text-[#FDFBF7] font-bold text-[9px] sm:text-xs tracking-[0.05em] sm:tracking-[0.15em] uppercase rounded-full hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-white/5 transition-all duration-300 sm:min-w-[220px] text-center backdrop-blur-sm flex items-center justify-center whitespace-nowrap"
            >
              Explore Venue
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}