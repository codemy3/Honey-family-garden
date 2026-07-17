"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const logoFillRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  const [isLoaderActive, setIsLoaderActive] = useState(true);

  // 1. Store the latest onComplete callback in a ref to prevent infinite re-renders
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Lock body scroll during preloader
  useEffect(() => {
    if (isLoaderActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoaderActive]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsLoaderActive(false);
      if (onCompleteRef.current) onCompleteRef.current();
      return;
    }

    // 2. Added preloaderRef as the scope for GSAP context
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsLoaderActive(false);
          // 3. Call the ref version of the callback
          if (onCompleteRef.current) onCompleteRef.current();
        },
      });

      // Logo Filling Effect: from bottom to top
      tl.fromTo(
        logoFillRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "power2.inOut" },
        0.2
      );

      // Shine sweep across the logo
      tl.fromTo(
        shineRef.current,
        { left: "-100%" },
        { left: "200%", duration: 1.2, ease: "power1.inOut" },
        1.0
      );

      // Subtle scale pop on the logo right before shutter opens
      tl.to(
        logoFillRef.current,
        { scale: 1.05, duration: 0.5, ease: "power2.out" },
        2.0
      );

      // SHUTTER EFFECT: Slide the preloader up and away
      tl.to(
        preloaderRef.current,
        {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
        },
        2.4
      );
    }, preloaderRef);

    return () => ctx.revert();
  }, []); // 4. Removed onComplete from this dependency array!

  if (!isLoaderActive) return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#102E4A]"
    >
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 overflow-hidden flex items-center justify-center rounded-2xl">
        <div className="absolute inset-0 opacity-20 filter grayscale">
          <Image
            src="/images/logo.png"
            alt="Honey Family Garden Background Logo"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 192px, 256px"
          />
        </div>
        
        <div
          ref={logoFillRef}
          className="absolute inset-0"
          style={{ clipPath: "inset(100% 0% 0% 0%)" }}
        >
          <Image
            src="/images/logo.png"
            alt="Honey Family Garden Logo"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 192px, 256px"
          />
        </div>

        <div
          ref={shineRef}
          className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 mix-blend-overlay"
          style={{ left: "-100%" }}
        />
      </div>
    </div>
  );
}