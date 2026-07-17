"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealText from "@/components/RevealText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  isText?: boolean;
  textValue?: string;
}

const stats: StatItem[] = [
  { value: 200, suffix: "+", label: "Guest Capacity" },
  { value: 200, suffix: "+", label: "Events Hosted" },
  { value: 15, suffix: "+", label: "Years Experience" },
];

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const card = cardRef.current;
    const rect = rectRef.current;
    if (!card) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setCount(stat.value);
      if (rect) gsap.set(rect, { strokeDashoffset: 0 });
      return;
    }

    // 1. Draw SVG card border from total perimeter path length
    if (rect) {
      const perimeter = rect.getTotalLength() || 1000;
      gsap.set(rect, { strokeDasharray: perimeter, strokeDashoffset: perimeter });

      gsap.fromTo(
        card,
        { opacity: 0, scale: 0.85, rotationX: -20, y: 40 },
        {
          opacity: 1,
          scale: 1,
          rotationX: 0,
          y: 0,
          duration: 1.2,
          delay: index * 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            once: true,
          },
        }
      );

      gsap.to(rect, {
        strokeDashoffset: 0,
        duration: 1.8,
        delay: index * 0.15 + 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          once: true,
        },
      });
    }

    // 2. Count-up animation starting fast, settling slow (power2.out)
    if (!stat.isText && stat.value > 0) {
      const counterVal = { val: 0 };
      gsap.to(counterVal, {
        val: stat.value,
        duration: 2.2,
        delay: index * 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          once: true,
        },
        onUpdate: () => {
          setCount(Math.round(counterVal.val));
        },
      });
    }
  }, [stat.value, stat.isText, index]);

  return (
    <div
      ref={cardRef}
      className="bg-offwhite border border-lightgrey/30 rounded-lg p-7 text-center hover:shadow-lg relative overflow-hidden transition-shadow duration-300 group"
    >
      {/* Self-drawing gold border */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none rounded-lg"
        fill="none"
        aria-hidden="true"
      >
        <rect
          ref={rectRef}
          x="0.5"
          y="0.5"
          width="calc(100% - 1px)"
          height="calc(100% - 1px)"
          rx="7"
          stroke="#D4AF37"
          strokeWidth="1.2"
        />
      </svg>

      {/* Number Value */}
      <div className="text-navy font-display font-bold text-4xl md:text-5xl mb-3 relative z-10">
        {stat.isText ? (
          stat.textValue
        ) : (
          <span>
            {count}
            {stat.suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <div className="text-charcoal/60 text-xs font-semibold uppercase tracking-wider relative z-10">
        {stat.label}
      </div>
    </div>
  );
}

export default function StatsGrid() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-5 md:px-10">
        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: "1200px" }}>
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
