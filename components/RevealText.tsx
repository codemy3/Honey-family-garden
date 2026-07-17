"use client";

import { useEffect, useRef, ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface RevealTextProps {
  children: React.ReactNode;
  tag?: ElementType;
  className?: string;
  stagger?: number;
  delay?: number;
}

export default function RevealText({
  children,
  tag: Tag = "h2",
  className = "",
  stagger = 0.08,
  delay = 0,
}: RevealTextProps) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = elementRef.current;
    if (!target) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.fromTo(
        target,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: target,
            start: "top 90%",
            once: true,
          },
        }
      );
      return;
    }

    // Split text into lines twice for a line-mask effect:
    // Outer Split (parent-line) gets overflow: hidden
    // Inner Split (child-line) is translated up/down
    const childSplit = new SplitText(target, {
      type: "lines",
      linesClass: "child-line inline-block w-full",
    });

    const parentSplit = new SplitText(target, {
      type: "lines",
      linesClass: "parent-line overflow-hidden block w-full",
    });

    // Animate inner line up
    gsap.set(childSplit.lines, { yPercent: 105, opacity: 0 });

    const scrollAnim = gsap.to(childSplit.lines, {
      yPercent: 0,
      opacity: 1,
      duration: 0.85,
      delay,
      ease: "power3.out",
      stagger,
      scrollTrigger: {
        trigger: target,
        start: "top 88%",
        once: true,
      },
    });

    return () => {
      scrollAnim.scrollTrigger?.kill();
      childSplit.revert();
      parentSplit.revert();
    };
  }, [stagger, delay]);

  return (
    <Tag ref={elementRef} className={className}>
      {children}
    </Tag>
  );
}
