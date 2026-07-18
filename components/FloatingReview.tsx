"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Star, X } from "lucide-react";

export default function FloatingReview() {
  const drawerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const ratingText = ["Rate Us", "Uh oh...", "Fair", "Good", "Excellent!", "Perfect!"];

  useEffect(() => {
    if (typeof window === "undefined" || isDismissed) return;

    const ctx = gsap.context(() => {
      // Smooth slide-in entrance after 7 seconds
      gsap.fromTo(
        drawerRef.current,
        { x: "100%" },
        {
          x: "calc(100% - 56px)",
          duration: 1.2,
          ease: "expo.out",
          delay: 7,
        }
      );
    });

    return () => ctx.revert();
  }, [isDismissed]);

  const handleMouseEnter = () => {
    if (isDismissed) return;
    gsap.to(drawerRef.current, {
      x: 0,
      duration: 0.6,
      ease: "power3.out",
    });

    gsap.fromTo(
      starsRef.current,
      { opacity: 0, scale: 0.5, y: 15 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "back.out(2)",
        delay: 0.1,
      }
    );
  };

  const handleMouseLeave = () => {
    if (isDismissed) return;
    gsap.to(drawerRef.current, {
      x: "calc(100% - 56px)",
      duration: 0.5,
      ease: "power2.inOut",
    });
    setHoveredStar(0);
  };

  const dismissDrawer = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    gsap.to(drawerRef.current, {
      x: "100%",
      duration: 0.6,
      ease: "power3.in",
      onComplete: () => setIsDismissed(true),
    });
  };

  const handleStarClick = (star: number, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/reviews?rating=${star}`);
  };

  if (isDismissed || pathname === "/reviews") return null;

  return (
    <div
      ref={drawerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={dismissDrawer} // Clicking anywhere on the drawer closes it
      className="fixed top-1/3 right-0 -translate-y-1/2 z-[90] flex items-center shadow-[-20px_10px_40px_rgba(16,46,74,0.3)] rounded-l-[32px] overflow-hidden border-l border-y border-[#D4AF37]/30 cursor-pointer"
      style={{ transform: "translateX(100%)" }}
    >
      {/* --- EXPANDED PANEL WITH CLOSE BUTTON --- */}
      <div className="relative flex flex-col justify-center h-full bg-[#102E4A]/95 backdrop-blur-2xl pl-8 pr-10 py-8 cursor-default">
        
        {/* Close / Dismiss Button */}
        <button
          onClick={dismissDrawer}
          className="absolute top-3 right-3 p-1.5 rounded-full text-[#FDFBF7]/50 hover:text-[#D4AF37] hover:bg-white/5 transition-colors cursor-pointer"
          title="Close review drawer"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <span className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold text-[#D4AF37] mb-2">
          {ratingText[hoveredStar]}
        </span>
        
        {/* Prevent click on stars from closing the drawer */}
        <div 
          className="flex items-center gap-2 my-2"
          onClick={(e) => e.stopPropagation()} 
        >
          {[1, 2, 3, 4, 5].map((star, index) => (
            <div
              key={star}
              ref={(el) => { starsRef.current[index] = el; }}
              onMouseEnter={() => setHoveredStar(star)}
              onClick={(e) => handleStarClick(star, e)}
              className="relative cursor-pointer transition-transform hover:scale-125 duration-200"
            >
              <Star className="w-6 h-6 text-[#FDFBF7]/15 transition-colors duration-200" />
              <Star 
                className={`w-6 h-6 text-[#D4AF37] fill-[#D4AF37] absolute inset-0 transition-all duration-300 ${
                  hoveredStar >= star ? "opacity-100 scale-100 drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" : "opacity-0 scale-75"
                }`} 
              />
            </div>
          ))}
        </div>

        {/* Prevent click on the link from closing the drawer so navigation works */}
        <Link 
          href="/reviews"
          onClick={(e) => e.stopPropagation()}
          className="mt-5 text-center font-display text-[11px] tracking-[0.2em] uppercase font-bold text-[#102E4A] bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] py-2.5 rounded-full shadow-md hover:brightness-115 transition-all duration-300"
        >
          Rate Now
        </Link>
      </div>

      {/* --- SLIM STICKY TAB --- */}
      <div className="w-14 h-full flex flex-col items-center justify-center bg-[#102E4A] border-l border-[#D4AF37]/40 py-8 gap-4">
        <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37] animate-pulse" />
        <span 
          className="font-body text-[11px] font-bold uppercase tracking-[0.25em] text-[#FDFBF7] whitespace-nowrap"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Feedback
        </span>
      </div>
    </div>
  );
}