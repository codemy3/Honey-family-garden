"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface MagneticButtonProps {
  children: React.ReactElement;
  className?: string;
  range?: number;
  strength?: number;
}

export default function MagneticButton({
  children,
  className = "",
  range = 45,
  strength = 0.25,
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const xTo = gsap.quickTo(el, "x", {
      duration: 0.6,
      ease: "power3.out",
    });
    
    const yTo = gsap.quickTo(el, "y", {
      duration: 0.6,
      ease: "power3.out",
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.hypot(distX, distY);

      if (dist < range) {
        // Pull button towards cursor
        xTo(distX * strength);
        yTo(distY * strength);
      } else {
        // Spring back if mouse moves beyond range
        xTo(0);
        yTo(0);
      }
    };

    const handleMouseLeave = () => {
      // Return cleanly on exit
      xTo(0);
      yTo(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [range, strength]);

  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      {children}
    </div>
  );
}
