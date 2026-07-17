"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/MagneticButton";

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

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const mediaWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileImageRef = useRef<HTMLImageElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const lineOneRef = useRef<HTMLSpanElement>(null);
  const lineTwoRef = useRef<HTMLSpanElement>(null);
  const welcomeCardRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const USE_STRONG_GRADE = false;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  useEffect(() => {
    // 1. Logic for Mobile Auto-Play Reveal
    const isMobile = window.innerWidth < 768;
    if (videoRef.current) {
      if (!isMobile) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(
        [eyebrowRef.current, lineOneRef.current, lineTwoRef.current],
        { opacity: 1, y: 0 }
      );
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Initial Load: Text cascading in Hero section
      const loadTl = gsap.timeline();
      loadTl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.3);
      loadTl.to(lineOneRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.45);
      loadTl.to(lineTwoRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.6);

      // 2. Scroll-driven animations
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // --- DESKTOP ANIMATION ---
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: videoContainerRef.current,
            start: "top top",
            end: "+=40%",
            scrub: true,
            pin: true,
            pinSpacing: true, 
          },
        });

        scrollTl.to(heroTextRef.current, { opacity: 0, y: -60, ease: "power2.inOut", duration: 0.4 }, 0);
        scrollTl.to(
          videoContainerRef.current,
          { scaleX: 0.9, scaleY: 0.9, borderBottomLeftRadius: "50%", borderBottomRightRadius: "50%", ease: "none", duration: 1, force3D: true },
          0
        );
      });

      mm.add("(max-width: 767px)", () => {
        // --- MOBILE CINEMATIC ANIMATION ---
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: videoContainerRef.current,
            start: "top top",
            end: "+=55%", 
            scrub: true,
            pin: true,
            pinSpacing: false, 
            onEnter: () => {
              if (videoRef.current) {
                videoRef.current.play().catch(console.error);
                setIsPlaying(true);
              }
            }
          },
        });

        // Fade text AND gradients up and out (Fixes the shadow issue)
        scrollTl.to(heroTextRef.current, { opacity: 0, y: -30, ease: "power2.inOut", duration: 0.3 }, 0);

        scrollTl.to(videoContainerRef.current, { backgroundColor: "rgba(16,46,74,0)", ease: "power2.inOut", duration: 0.4 }, 0);

        // Compress the image wrapper into a perfect horizontal 16:9 floating card
        scrollTl.fromTo(
          mediaWrapperRef.current,
          { height: "100%", width: "100%", top: "0%", left: "0%", borderRadius: "0px" },
          {
            height: "28vh", // Slightly tighter to match 16:9
            width: "92%",
            top: "16vh", // FIX: Increased from 12vh to clear the navbar
            left: "4%", 
            borderRadius: "24px",
            ease: "power2.inOut",
            duration: 1,
          },
          0
        );

        if (mobileImageRef.current) {
          scrollTl.to(mobileImageRef.current, { opacity: 0, ease: "none", duration: 0.6 }, 0.2);
        }
      });

      // 3. Welcome section text reveal
      const featuresTl = gsap.timeline({
         scrollTrigger: {
             trigger: featuresRef.current,
             start: "top 85%", 
             end: "top 40%",
             scrub: true,
         },
      });

      featuresTl.fromTo(welcomeCardRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: "power2.out" });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full bg-[#FDFBF7] flex flex-col items-center overflow-hidden">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Work+Sans:wght@400;500;600&family=Caveat:wght@400;500&display=swap");
        .hfg-display { font-family: "Fraunces", ui-serif, Georgia, serif; }
        .hfg-body { font-family: "Work Sans", ui-sans-serif, system-ui, sans-serif; }
        .hfg-script { font-family: "Caveat", "Dancing Script", cursive; }
      `}</style>

      {/* Single Continuous Background */}
      <div className="absolute inset-0 w-full h-full opacity-90 pointer-events-none z-0">
        <Image src="/images/hero-background.png" alt="Botanical Architectural Sketch" fill className="object-cover object-center mix-blend-multiply" />
      </div>

      <div
        ref={videoContainerRef}
        className="relative w-full h-screen z-20 overflow-hidden flex items-center justify-center origin-top shadow-2xl pointer-events-none"
        style={{ willChange: "transform, border-radius", transform: "translateZ(0)", backgroundColor: "#102E4A" }}
      >
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <filter id="hfg-duotone">
              <feComponentTransfer>
                <feFuncR type="table" tableValues="0.03 0.18 0.42 0.68 0.92" />
                <feFuncG type="table" tableValues="0.08 0.24 0.46 0.70 0.90" />
                <feFuncB type="table" tableValues="0.20 0.34 0.40 0.42 0.55" />
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>

        <div ref={mediaWrapperRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto">
          
          <img
            ref={mobileImageRef}
            src="/images/hero.jpg"
            alt="Honey Family Garden Botanical Escape"
            className="absolute inset-0 w-full h-full object-cover block md:hidden z-[1]"
            style={{
              filter: [
                "saturate(0.82)", "contrast(1.06)", "brightness(1.04)", USE_STRONG_GRADE ? "url(#hfg-duotone)" : "",
              ].filter(Boolean).join(" "),
            }}
          />

          <video
            ref={videoRef}
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            poster="/images/hero.jpg"
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{
              filter: [
                "saturate(0.82)", "contrast(1.06)", "brightness(1.04)", USE_STRONG_GRADE ? "url(#hfg-duotone)" : "",
              ].filter(Boolean).join(" "),
            }}
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          <div
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{ background: "linear-gradient(180deg, rgba(16,46,74,0.35) 0%, rgba(16,46,74,0.08) 45%, rgba(16,46,74,0.30) 100%)", mixBlendMode: "multiply" }}
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 z-[3] pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 50% at 50% 35%, rgba(233,199,126,0.18), transparent 65%)", mixBlendMode: "soft-light" }}
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 z-[5] pointer-events-none opacity-[0.05] mix-blend-overlay"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
            aria-hidden="true"
          />
        </div>

        {/* FIX: Moved ref={heroTextRef} to the outermost wrapper so the dark gradients fade out along with the text! */}
        <div ref={heroTextRef} className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/65" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 45% at 50% 48%, rgba(0,0,0,0.45), transparent 70%)" }} />
          
          <div className="relative flex flex-col items-center px-4">
            <div ref={eyebrowRef} className="flex items-center gap-4 mb-6 md:mb-8 opacity-0 -translate-y-3">
              <span className="h-[1px] w-8 md:w-16" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.9))" }}></span>
              <span className="font-body hfg-body text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#D4AF37] font-semibold">
                A Botanical Escape
              </span>
              <span className="h-[1px] w-8 md:w-16" style={{ background: "linear-gradient(to left, transparent, rgba(212,175,55,0.9))" }}></span>
            </div>

            <h1 className="font-display hfg-display text-4xl md:text-6xl lg:text-8xl text-white font-normal text-center leading-[1.1] tracking-tight drop-shadow-2xl">
              <span ref={lineOneRef} className="inline-block text-[#FDFBF7] opacity-0 translate-y-8">
                Where Memories
              </span>{" "}
              <br className="hidden sm:block" />
              <span ref={lineTwoRef} className="inline-block font-light text-[#FDFBF7] opacity-0 translate-y-10 hfg-script italic text-5xl sm:text-7xl md:text-9xl">
                Blossom
              </span>
            </h1>
          </div>
        </div>

        {/* Interactive Play/Mute controls */}
        <div className="absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-3 pointer-events-auto">
          <button onClick={togglePlay} className="p-3 rounded-full bg-[#102E4A]/40 backdrop-blur-md border border-[#FDFBF7]/15 text-[#FDFBF7] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 hover:bg-[#102E4A]/60 transition-all duration-300 active:scale-90 cursor-pointer shadow-md" title={isPlaying ? "Pause Video" : "Play Video"}>
            {isPlaying ? (
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            ) : (
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <button onClick={toggleMute} className="p-3 rounded-full bg-[#102E4A]/40 backdrop-blur-md border border-[#FDFBF7]/15 text-[#FDFBF7] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 hover:bg-[#102E4A]/60 transition-all duration-300 active:scale-90 cursor-pointer shadow-md" title={isMuted ? "Unmute Video" : "Mute Video"}>
            {isMuted ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Welcome section */}
      <div ref={featuresRef} className="w-full relative z-10 bg-transparent pt-4 pb-16 md:pt-16 md:pb-32 px-5 md:px-10 overflow-hidden flex flex-col items-center justify-center -mt-6 md:mt-0 pointer-events-auto">
        <div ref={welcomeCardRef} className="w-full max-w-4xl relative z-10 opacity-0 translate-y-10 flex flex-col items-center text-center">
            <h2 className="font-display hfg-display text-4xl md:text-6xl text-[#102E4A] font-normal mb-6 md:mb-10 leading-tight">
              WELCOME <br className="hidden md:block"/> 
              <span className="hfg-script italic text-[#A68725] text-5xl md:text-7xl">to</span>{" "}
              <span className="relative inline-block mt-2 md:mt-0">
                Honey Family Garden
                <span className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-1 bg-[#D4AF37] opacity-30 rounded-full"></span>
              </span>
            </h2>

            <div className="flex items-center justify-center gap-4 w-full max-w-sm mb-8 md:mb-12">
              <div className="h-[1px] flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.5))" }} />
              <div className="flex items-center gap-1.5 text-[#D4AF37]">
                <HexMark className="w-4 h-4" />
                <div className="w-8 h-[1px] bg-[#D4AF37]/60" />
                <HexMark className="w-4 h-4" />
              </div>
              <div className="h-[1px] flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(212,175,55,0.5))" }} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mt-2">
              <MagneticButton>
                <Link href="/gallery" className="group block w-full sm:w-auto px-10 py-4 rounded-full border-2 border-[#102E4A] text-[#102E4A] font-bold text-sm tracking-wider uppercase bg-transparent transition-all duration-300 hover:bg-[#102E4A] hover:text-[#FDFBF7] hover:scale-105 active:scale-95 text-center min-w-[200px]">
                  <span className="inline-block transition-[letter-spacing] duration-300 group-hover:tracking-[0.15em]">Explore Gallery</span>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/contact" className="group block w-full sm:w-auto px-10 py-4 rounded-full bg-[#102E4A] hover:bg-[#1A4063] text-[#FDFBF7] font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 text-center min-w-[200px]">
                  <span className="inline-block transition-[letter-spacing] duration-300 group-hover:tracking-[0.15em]">Book Your Event</span>
                </Link>
              </MagneticButton>
            </div>
        </div>
      </div>
    </section>
  );
}