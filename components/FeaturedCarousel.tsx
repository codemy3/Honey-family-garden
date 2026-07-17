"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { gsap } from "gsap";

const slides = [
  {
    id: 1,
    src: "/images/carousel-1.jpg",
    alt: "Beautiful garden venue setup for wedding",
    label: "Garden Weddings",
    icon: "🌿",
  },
  {
    id: 2,
    src: "/images/carousel-2.jpg",
    alt: "Elegant indoor AC hall with lighting",
    label: "Elegant Hall Events",
    icon: "✨",
  },
  {
    id: 3,
    src: "/images/carousel-3.jpg",
    alt: "Multi-cuisine catering spread",
    label: "Exquisite Catering",
    icon: "🍽️",
  },
];

export default function FeaturedCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const carouselRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Buttery 3D perspective mouse-tilt hooks
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    // quickTo values to interpolate 3D rotation parameters
    const rotXTo = gsap.quickTo(el, "rotateX", { duration: 0.6, ease: "power2.out" });
    const rotYTo = gsap.quickTo(el, "rotateY", { duration: 0.6, ease: "power2.out" });

    // Apply perspective styling to container
    gsap.set(el.parentElement, { perspective: 1000 });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalized offsets from center (-0.5 to 0.5)
      const normX = x / rect.width - 0.5;
      const normY = y / rect.height - 0.5;

      // Rotate card up to 6 degrees
      rotXTo(-normY * 6);
      rotYTo(normX * 6);
    };

    const handleMouseLeave = () => {
      rotXTo(0);
      rotYTo(0);
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section ref={ref} className="bg-offwhite py-20 md:py-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-5 md:px-10"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark mb-2 block">
            Crafting Experiences
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-navy">
            Featured Moments
          </h2>
          <div className="w-12 h-[2px] bg-gold mx-auto mt-4" />
        </div>

        {/* Carousel Outer Wrapper */}
        <div
          ref={carouselRef}
          className="relative overflow-hidden rounded-[32px] shadow-2xl bg-navy transform-gpu"
          style={{ transformStyle: "preserve-3d" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Image Container with Clip-Path transitions */}
          <div className="relative h-[280px] sm:h-[380px] md:h-[450px] lg:h-[500px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" }}
                animate={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
                exit={{ clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                {/* Fallback elegant gradient panel */}
                <div
                  className="w-full h-full relative"
                  style={{
                    background: [
                      "linear-gradient(135deg, #102E4A 0%, #1a4a3a 50%, #D4AF37 100%)",
                      "linear-gradient(135deg, #1a3f5f 0%, #102E4A 50%, #8BA89B 100%)",
                      "linear-gradient(135deg, #D4AF37 0%, #102E4A 50%, #1a4a3a 100%)",
                    ][current],
                  }}
                >
                  {/* Decorative Icon overlay */}
                  <div className="w-full h-full flex items-center justify-center pointer-events-none opacity-90">
                    <div className="text-center">
                      <div className="text-7xl mb-4">
                        {slides[current].icon}
                      </div>
                      <p className="text-cream font-display font-bold text-2xl md:text-3.5xl">
                        {slides[current].label}
                      </p>
                      <p className="text-cream/50 text-xs tracking-wider uppercase mt-3 max-w-sm mx-auto px-4 leading-relaxed">
                        {slides[current].alt}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Ambient vignette grade overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-black/25 pointer-events-none" />

            {/* Label Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 pointer-events-none z-10">
              <span className="font-body text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-2 block">
                FEATURED CATEGORY
              </span>
              <p className="text-cream font-display font-semibold text-xl sm:text-2xl">
                {slides[current].label}
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() =>
              setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
            }
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-navy/40 backdrop-blur-md border border-white/10 text-cream flex items-center justify-center transition-all duration-300 hover:bg-navy/70 hover:scale-105 active:scale-95 z-20 cursor-pointer"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-navy/40 backdrop-blur-md border border-white/10 text-cream flex items-center justify-center transition-all duration-300 hover:bg-navy/70 hover:scale-105 active:scale-95 z-20 cursor-pointer"
            aria-label="Next slide"
          >
            →
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-2.5 mt-8">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                index === current
                  ? "w-8 h-2 bg-gold"
                  : "w-2 h-2 bg-navy/20 hover:bg-navy/40"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
