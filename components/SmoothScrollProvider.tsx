"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Register plugins
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    // Create ScrollSmoother instance
    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1.2,
      effects: true,
      normalizeScroll: false, // keep false so native controls/trackpads feel normal
    });

    return () => {
      smoother.kill();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Aggressive native scroll reset
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    
    const smoother = ScrollSmoother.get();
    if (smoother) {
      // Instantly force smoother to top
      smoother.scrollTo(0, false);
      
      // Force it again after the Next.js DOM swap completes
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        smoother.scrollTo(0, false);
        ScrollTrigger.refresh();
      });

      // Final safety net for slow-rendering pages
      setTimeout(() => {
        window.scrollTo(0, 0);
        smoother.scrollTo(0, false);
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [pathname]);

  return (
    <div ref={wrapperRef} id="smooth-wrapper" className="w-full min-h-screen overflow-hidden">
      <div ref={contentRef} id="smooth-content" className="w-full relative">
        {children}
      </div>
    </div>
  );
}
