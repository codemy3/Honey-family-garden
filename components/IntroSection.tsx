"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealText from "@/components/RevealText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function HexMark({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" strokeLinejoin="round" />
    </svg>
  );
}

// 1. NEW: Delicate Golden Botanical Sprig Accent
function BotanicalSprig({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M26 6C20 6 14 10 10 16C6 22 4 28 4 28C4 28 10 26 16 22C22 18 26 12 26 6Z"
        stroke="#D4AF37"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 28L15 17" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function IntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLElement | null)[]>([]);
  const scrubParagraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Cinematic Curtain Reveal for the Image
      gsap.fromTo(
        imageWrapperRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 25%",
            scrub: 1.5,
          },
        }
      );

      // 2. Parallax effect inside the image + Badge rotation
      gsap.fromTo(
        imageRef.current,
        { y: "-15%", scale: 1.15 },
        {
          y: "15%",
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

      if (badgeRef.current) {
        gsap.to(badgeRef.current, {
          rotate: 360,
          ease: "none",
          repeat: -1,
          duration: 20,
        });
      }

      // 3. Elegant staggered text reveal
      gsap.fromTo(
        contentRefs.current.filter(Boolean),
        { opacity: 0, y: 30, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRefs.current[0],
            start: "top 85%",
          },
        }
      );

      // 4. UPGRADED: Text scrub effect with Golden Keyword Ignition
      if (scrubParagraphRef.current) {
        const words = scrubParagraphRef.current.querySelectorAll(".scrub-word");
        gsap.fromTo(
          words,
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: scrubParagraphRef.current,
              start: "top 80%",
              end: "bottom 40%",
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Words that should turn golden when scrubbed
  const goldKeywords = ["sanctuary", "celebrations", "grand", "wedding,", "perfect", "canvas."];

  return (
    <section ref={sectionRef} className="w-full bg-[#FDFBF7] py-24 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left: Editorial Image Reveal with Offset Frame & Badge */}
        <div className="w-full lg:w-5/12 relative px-4 sm:px-0">
          
          {/* Decorative Offset Outline Frame */}
          <div className="absolute inset-0 aspect-[4/5] rounded-t-full rounded-b-xl border border-[#D4AF37]/40 translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5 pointer-events-none hidden sm:block" />

          <div
            ref={imageWrapperRef}
            className="relative aspect-[4/5] rounded-t-full rounded-b-xl overflow-hidden shadow-[0_20px_40px_rgba(16,46,74,0.15)] z-10 bg-navy"
          >
            <Image
              ref={imageRef}
              src="/images/scene1.webp"
              alt="Enchanting botanical escape gardens at Honey Family Garden"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover origin-center"
            />
            <div className="absolute inset-0 bg-[#102E4A]/10 mix-blend-multiply pointer-events-none" />
          </div>

          {/* Glowing background gradient */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[radial-gradient(circle,_rgba(212,175,55,0.25)_0%,_transparent_70%)] pointer-events-none" />

          {/* Spinning Circular Editorial Seal/Badge */}
          <div className="absolute -bottom-6 -right-2 sm:-right-6 z-20 bg-[#FDFBF7] p-2 rounded-full shadow-xl border border-[#D4AF37]/30 flex items-center justify-center">
            <div ref={badgeRef} className="w-20 h-20 md:w-24 md:h-24 relative flex items-center justify-center">
              <svg className="w-full h-full w-20 h-20 md:w-24 md:h-24 animate-spin-slow" viewBox="0 0 100 100">
                <path
                  id="textPath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text className="text-[9.5px] font-body font-semibold uppercase tracking-[0.2em] fill-[#102E4A]">
                  <textPath href="#textPath" startOffset="0%">
                    • Botanical Escape • Shimoga
                  </textPath>
                </text>
              </svg>
              <HexMark className="w-5 h-5 text-[#D4AF37] absolute" />
            </div>
          </div>
        </div>

        {/* Right: Typography & Content */}
        <div className="w-full lg:w-7/12 flex flex-col items-start text-left z-10 mt-6 lg:mt-0">
          <span
            ref={(el) => { contentRefs.current[0] = el; }}
            className="font-body hfg-body text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37] block mb-4"
          >
            STEP 03
          </span>
          <div ref={(el) => { contentRefs.current[1] = el; }} className="w-12 h-[1px] bg-[#D4AF37]/50 mb-8" />

          <div ref={(el) => { contentRefs.current[2] = el; }} className="relative">
            {/* Floating Sprig over the heading */}
            <div className="absolute -top-5 right-0 md:right-10 opacity-80 hidden sm:block">
              <BotanicalSprig className="w-8 h-8 rotate-12" />
            </div>

            <RevealText
              tag="h2"
              className="font-display hfg-display font-light text-4xl sm:text-5xl md:text-6xl text-[#102E4A] leading-[1.1] mb-8"
            >
              Our Story, <br />
              <span className="italic font-normal text-[#D4AF37] relative inline-block">
                Your Celebration
                <span className="absolute bottom-1 left-0 w-full h-[1px] bg-[#D4AF37]/40" />
              </span>
            </RevealText>
          </div>

          <div className="space-y-8 max-w-2xl">
            {/* UPGRADED: Words light up in gold if they are selling points */}
            <p
              ref={(el) => {
                contentRefs.current[3] = el;
                if (el) scrubParagraphRef.current = el;
              }}
              className="font-display hfg-display text-xl md:text-2xl leading-relaxed text-[#102E4A]"
            >
              {"Nestled in the heart of Shimoga, Honey Family Garden is your sanctuary for celebrations — where an intimate family gathering, a grand wedding, or a corporate retreat all find their perfect canvas."
                .split(" ")
                .map((word, i) => {
                  const cleanWord = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
                  const isGold = goldKeywords.some((kw) => kw.includes(cleanWord) && cleanWord.length > 3);

                  return (
                    <span
                      key={i}
                      className={`scrub-word inline-block mr-1.5 opacity-20 transition-colors duration-300 ${
                        isGold ? "font-medium text-[#D4AF37]" : "text-[#102E4A]"
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
            </p>

            <p
              ref={(el) => { contentRefs.current[4] = el; }}
              className="font-body hfg-body text-base md:text-lg leading-relaxed text-[#102E4A]/70"
            >
              With multi-cuisine catering, comfortable guest accommodations,
              and a team dedicated to excellence, every detail is curated so
              your event is nothing short of extraordinary.
            </p>

            <div ref={(el) => { contentRefs.current[5] = el; }} className="border-l-2 border-[#D4AF37] pl-6 py-2 bg-gradient-to-r from-[#D4AF37]/5 to-transparent rounded-r-lg">
              <p className="text-[#102E4A] text-lg md:text-xl italic font-display hfg-display leading-snug">
                "From grand celebrations to intimate gatherings — every moment
                deserves a beautiful setting."
              </p>
            </div>
          </div>

          {/* Decorative Divider */}
          <div ref={(el) => { contentRefs.current[6] = el; }} className="flex items-center gap-3 mt-12">
            <div className="w-16 h-px bg-[#D4AF37]/40" />
            <div className="flex items-center gap-1.5 text-[#D4AF37]">
              <HexMark className="w-4 h-4" />
              <HexMark className="w-4 h-4" />
            </div>
            <div className="w-16 h-px bg-[#D4AF37]/40" />
          </div>
        </div>

      </div>
    </section>
  );
}