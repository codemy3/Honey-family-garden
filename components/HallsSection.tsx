"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Leaf, Sparkles, Snowflake, Mic } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Spark Decoration
const AccentSparks = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <rect x="5" y="20" width="14" height="7" rx="3.5" transform="rotate(-40 5 20)" fill="#F5A623" />
    <rect x="18" y="10" width="14" height="7" rx="3.5" transform="rotate(-20 18 10)" fill="#F5A623" />
  </svg>
);

// Sequence 1 Typographic Lockup
const Seq1Text = () => (
  <span className="flex flex-col items-center justify-center leading-[0.85]">
    <span className="relative flex items-center justify-center text-[#FFF7E6] w-full">
      BOTANICAL
      <AccentSparks className="absolute -bottom-1 -right-4 md:-bottom-[10%] md:-right-[2%] w-6 h-6 md:w-[8vw] md:h-[8vw] max-w-[48px] max-h-[48px] rotate-[110deg]" />
    </span>
    <span className="flex items-center justify-center text-[#FFF7E6]">
      <span 
        className="hfg-script normal-case text-[0.45em] -rotate-6 translate-y-[15%] mr-3 md:mr-5" 
        style={{ color: "#F5A623", fontWeight: "normal" }}
      >
        our
      </span>
      GARDEN
    </span>
  </span>
);

// Sequence 2 Typographic Lockup
const Seq2Text = () => (
  <span className="flex flex-col items-center justify-center leading-[0.85]">
    <span className="block w-full text-center text-[#FFF7E6]">PRIVATE AC</span>
    <span className="flex items-center justify-center text-[#FFF7E6]">
      <span className="relative flex flex-col items-center justify-center mr-3 md:mr-5">
        <AccentSparks className="absolute -top-[80%] -left-[20%] md:-top-[100%] md:-left-[20%] w-5 h-5 md:w-[6vw] md:h-[6vw] max-w-[32px] max-h-[32px] -rotate-12" />
        <span 
          className="hfg-script normal-case text-[0.45em] -rotate-6 translate-y-[15%]" 
          style={{ color: "#F5A623", fontWeight: "normal" }}
        >
          the
        </span>
      </span>
      HALL
    </span>
  </span>
);

export default function HallsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const seq1Container = useRef<HTMLDivElement>(null);
  const text1Top = useRef<HTMLHeadingElement>(null);
  const text1Bottom = useRef<HTMLHeadingElement>(null);
  const img1 = useRef<HTMLDivElement>(null);
  const content1 = useRef<HTMLDivElement>(null);

  const seq2Container = useRef<HTMLDivElement>(null);
  const text2Top = useRef<HTMLHeadingElement>(null);
  const text2Bottom = useRef<HTMLHeadingElement>(null);
  const img2 = useRef<HTMLDivElement>(null);
  const content2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // ==========================================
      // DESKTOP ANIMATION: Heavy 3D & Blur Enabled
      // ==========================================
      mm.add("(min-width: 768px)", () => {
        gsap.set([img1.current, img2.current], { 
          scale: 0.4, rotationX: 35, rotationY: -10, z: -1000,
          filter: "blur(20px) brightness(0.8)", opacity: 0, transformPerspective: 2000 
        });
        gsap.set([content1.current, content2.current], { opacity: 0, y: 60, rotationZ: 2, scale: 0.95 });
        gsap.set(seq2Container.current, { opacity: 0, pointerEvents: "none" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=400%",
            pin: true,
            scrub: 1, 
            anticipatePin: 1,
          },
        });

        tl.to(text1Top.current, { y: "-40vh", rotation: -2, scale: 1.05, ease: "power3.inOut" }, 0)
          .to(text1Bottom.current, { y: "40vh", rotation: 2, scale: 1.05, ease: "power3.inOut" }, 0)
          .to(img1.current, { scale: 1, rotationX: 0, rotationY: 0, z: 0, filter: "blur(0px) brightness(1)", opacity: 1, duration: 1.5, ease: "power4.out" }, 0)
          .to(content1.current, { opacity: 1, y: 0, rotationZ: 0, scale: 1, duration: 1, ease: "back.out(1.2)" }, 0.5) 
          .to(img1.current, { scale: 2.5, opacity: 0, filter: "blur(30px) brightness(1.5)", ease: "power2.in" }, 2)
          .to(content1.current, { opacity: 0, y: -50, scale: 1.05, ease: "power2.in" }, 2)
          .to(text1Top.current, { opacity: 0 }, 2)
          .to(text1Bottom.current, { opacity: 0 }, 2)
          .to(seq1Container.current, { opacity: 0 }, 2.5)
          .set(seq2Container.current, { opacity: 1, pointerEvents: "auto" }, 2.5)
          .fromTo(text2Top.current, { y: 0, rotation: 0, scale: 1 }, { y: "-40vh", rotation: -2, scale: 1.05, ease: "power3.inOut" }, 2.5)
          .fromTo(text2Bottom.current, { y: 0, rotation: 0, scale: 1 }, { y: "40vh", rotation: 2, scale: 1.05, ease: "power3.inOut" }, 2.5)
          .to(img2.current, { scale: 1, rotationX: 0, rotationY: 0, z: 0, filter: "blur(0px) brightness(1)", opacity: 1, duration: 1.5, ease: "power4.out" }, 2.5)
          .to(content2.current, { opacity: 1, y: 0, rotationZ: 0, scale: 1, duration: 1, ease: "back.out(1.2)" }, 3)
          .to({}, { duration: 1 }, 4);
      });

      // ==========================================
      // MOBILE ANIMATION: CREATIVE & PERFORMANT
      // Natural flexbox stacking preventing overlap 
      // ==========================================
      mm.add("(max-width: 767px)", () => {
        // Reset desktop states ensuring interactive elements are clickable
        gsap.set(seq2Container.current, { opacity: 1, pointerEvents: "auto" });
        
        // Seq 1 ScrollTrigger Timeline
        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: seq1Container.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        });

        tl1.fromTo(text1Top.current, { opacity: 0, y: -20, scale: 0.95 }, { opacity: 0.15, y: 0, scale: 1, duration: 1, ease: "power3.out" }, 0)
           .fromTo(img1.current, { opacity: 0, scale: 0.9, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.2)
           .fromTo(content1.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" }, 0.4);

        // Seq 2 ScrollTrigger Timeline
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: seq2Container.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        });

        tl2.fromTo(text2Top.current, { opacity: 0, y: -20, scale: 0.95 }, { opacity: 0.15, y: 0, scale: 1, duration: 1, ease: "power3.out" }, 0)
           .fromTo(img2.current, { opacity: 0, scale: 0.9, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.2)
           .fromTo(content2.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" }, 0.4);
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-auto md:h-[100vh] md:h-[100dvh] bg-[#102E4A] overflow-hidden flex flex-col md:block md:items-center md:justify-center" style={{ perspective: "2000px" }}>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap');
        .hfg-display { font-family: "Fraunces", ui-serif, Georgia, serif; }
        .hfg-body { font-family: "Work Sans", ui-sans-serif, system-ui, sans-serif; }
        .hfg-script { font-family: "Caveat", "Dancing Script", cursive; }
        
        @media (min-width: 768px) {
          .clip-top-md { clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%); }
          .clip-bottom-md { clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%); }
        }
      `}</style>

      {/* Background Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image src="/images/hero.jpg" alt="Venue Background" fill className="object-cover opacity-60" priority />
        <div className="absolute inset-0 bg-[#102E4A]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,_rgba(212,175,55,0.25),_transparent_100%)]" />
      </div>

      {/* --- SEQUENCE 1 --- */}
      <div ref={seq1Container} className="relative md:absolute md:inset-0 w-full min-h-[100svh] md:min-h-0 md:h-full shrink-0 flex flex-col items-center justify-center py-20 px-4 md:px-0 md:block">
        <h2 ref={text1Top} className="absolute inset-0 flex items-center justify-center text-[20vw] sm:text-[18vw] md:text-[18vw] font-display hfg-display font-bold text-center pointer-events-none drop-shadow-xl md:drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] tracking-tighter md:clip-top-md z-[0] md:z-[30]">
          <Seq1Text />
        </h2>
        <h2 ref={text1Bottom} className="hidden md:flex absolute inset-0 items-center justify-center text-[15vw] sm:text-[16vw] md:text-[18vw] font-display hfg-display font-bold text-center pointer-events-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] tracking-tighter clip-bottom-md z-[30]">
          <Seq1Text />
        </h2>

        {/* Natural stacking on mobile using relative flow / Absolute positioned on desktop */}
        <div ref={img1} className="relative md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-[92vw] sm:max-w-[85vw] md:max-w-none md:w-[55vw] h-[40vh] sm:h-[45vh] md:h-[70vh] rounded-2xl overflow-hidden shadow-2xl will-change-transform z-[10] mb-6 md:mb-0">
          <Image src="/images/outdoor.jpeg" alt="Botanical Garden" fill className="object-cover" />
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] pointer-events-none" />
        </div>

        <div ref={content1} className="relative md:absolute md:bottom-[10vh] md:left-auto md:right-[10vw] w-full max-w-[92vw] sm:max-w-[85vw] md:max-w-none md:w-[32vw] bg-[#FDFBF7] p-6 sm:p-8 md:p-10 rounded-[20px] md:rounded-3xl will-change-transform shadow-2xl z-[20]">
          <span className="font-body text-[10px] md:text-sm font-semibold tracking-[0.25em] text-[#D4AF37] block mb-2 uppercase">STEP 01</span>
          <h3 className="font-display hfg-display text-2xl sm:text-3xl md:text-4xl text-[#102E4A] font-bold mb-2 md:mb-4 leading-tight">Open Botanical Garden</h3>
          <p className="font-body text-sm sm:text-base md:text-lg text-[#102E4A]/80 mb-4 md:mb-8 leading-relaxed font-medium">
            Celebrate under the stars in our enchanting botanical sanctuary. Surrounded by carefully curated greenery and dressed with elegant overhead string lights, this open-air venue offers the perfect magical backdrop.
          </p>
          <div className="grid grid-cols-1 gap-3 md:gap-5 mb-6 md:mb-10">
             <div className="flex items-center gap-3">
               <span className="p-2 md:p-3 rounded-full bg-[#102E4A]/5 shrink-0"><Leaf className="w-4 h-4 md:w-5 md:h-5 text-[#D4AF37]" /></span>
               <span className="font-body text-sm md:text-base text-[#102E4A] font-semibold">Botanical setting & garden views</span>
             </div>
             <div className="flex items-center gap-3">
               <span className="p-2 md:p-3 rounded-full bg-[#102E4A]/5 shrink-0"><Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#D4AF37]" /></span>
               <span className="font-body text-sm md:text-base text-[#102E4A] font-semibold">Ambient fairy lighting setup</span>
             </div>
          </div>
          <MagneticButton>
            <Link href="/contact" className="block sm:inline-block w-full sm:w-auto text-center px-6 md:px-8 py-3 md:py-4 rounded-full bg-[#102E4A] text-[#FDFBF7] font-bold text-[11px] md:text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-colors shadow-lg">
              Explore Venue
            </Link>
          </MagneticButton>
        </div>
      </div>

      {/* --- SEQUENCE 2 --- */}
      <div ref={seq2Container} className="relative md:absolute md:inset-0 w-full min-h-[100svh] md:min-h-0 md:h-full shrink-0 flex flex-col items-center justify-center py-20 px-4 md:px-0 md:block">
        <h2 ref={text2Top} className="absolute inset-0 flex items-center justify-center text-[20vw] sm:text-[18vw] md:text-[18vw] font-display hfg-display font-bold text-center pointer-events-none drop-shadow-xl md:drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] tracking-tighter md:clip-top-md z-[0] md:z-[30]">
          <Seq2Text />
        </h2>
        <h2 ref={text2Bottom} className="hidden md:flex absolute inset-0 items-center justify-center text-[15vw] sm:text-[16vw] md:text-[18vw] font-display hfg-display font-bold text-center pointer-events-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] tracking-tighter clip-bottom-md z-[30]">
          <Seq2Text />
        </h2>

        <div ref={img2} className="relative md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-[92vw] sm:max-w-[85vw] md:max-w-none md:w-[55vw] h-[40vh] sm:h-[45vh] md:h-[70vh] rounded-2xl overflow-hidden shadow-2xl will-change-transform z-[10] mb-6 md:mb-0">
          <Image src="/images/indoor.png" alt="Private AC Hall" fill className="object-cover" />
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] pointer-events-none" />
        </div>

        <div ref={content2} className="relative md:absolute md:bottom-[10vh] md:left-[10vw] md:right-auto w-full max-w-[92vw] sm:max-w-[85vw] md:max-w-none md:w-[32vw] bg-[#FDFBF7] p-6 sm:p-8 md:p-10 rounded-[20px] md:rounded-3xl will-change-transform shadow-2xl z-[20]">
          <span className="font-body text-[10px] md:text-sm font-semibold tracking-[0.25em] text-[#D4AF37] block mb-2 uppercase">STEP 02</span>
          <h3 className="font-display hfg-display text-2xl sm:text-3xl md:text-4xl text-[#102E4A] font-bold mb-2 md:mb-4 leading-tight">Private AC Hall</h3>
          <p className="font-body text-sm sm:text-base md:text-lg text-[#102E4A]/80 mb-4 md:mb-8 leading-relaxed font-medium">
            A sophisticated, fully air-conditioned indoor banquet hall designed for comfort and elegance. Equipped with modern AV amenities and customizable lighting for your event.
          </p>
          <div className="grid grid-cols-1 gap-3 md:gap-5 mb-6 md:mb-10">
             <div className="flex items-center gap-3">
               <span className="p-2 md:p-3 rounded-full bg-[#102E4A]/5 shrink-0"><Snowflake className="w-4 h-4 md:w-5 md:h-5 text-[#D4AF37]" /></span>
               <span className="font-body text-sm md:text-base text-[#102E4A] font-semibold">Full climate control & AC</span>
             </div>
             <div className="flex items-center gap-3">
               <span className="p-2 md:p-3 rounded-full bg-[#102E4A]/5 shrink-0"><Mic className="w-4 h-4 md:w-5 md:h-5 text-[#D4AF37]" /></span>
               <span className="font-body text-sm md:text-base text-[#102E4A] font-semibold">Integrated audio & mic setup</span>
             </div>
          </div>
          <MagneticButton>
            <Link href="/contact" className="block sm:inline-block w-full sm:w-auto text-center px-6 md:px-8 py-3 md:py-4 rounded-full bg-[#102E4A] text-[#FDFBF7] font-bold text-[11px] md:text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-colors shadow-lg">
              Explore Venue
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}