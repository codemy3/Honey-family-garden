"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, ArrowLeft, ArrowRight, Leaf, Eye } from "lucide-react";

// Assuming these are exported from your lib
import { galleryImages, categories, GalleryImage } from "@/lib/galleryData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- LIGHTBOX COMPONENT (The "White Room") ---
interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ images, currentIndex, isOpen, onClose, onPrev, onNext }: LightboxProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") onPrev();
    if (e.key === "ArrowRight") onNext();
  }, [isOpen, onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-[#FDFBF7]/95 backdrop-blur-xl flex flex-col items-center justify-center select-none"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 md:top-10 md:right-10 text-[#102E4A] hover:text-[#D4AF37] transition-colors duration-300 z-50 flex flex-col items-center gap-2 group"
          >
            <span className="hidden md:block font-body text-[10px] uppercase tracking-widest font-bold">Close</span>
            <X className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-90 transition-transform" strokeWidth={1} />
          </button>

          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 md:px-12 z-50 pointer-events-none">
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="pointer-events-auto p-4 text-[#102E4A] hover:text-[#D4AF37] transition-colors group bg-white/50 rounded-full backdrop-blur-md border border-[#102E4A]/10 shadow-sm"
            >
              <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-2 transition-transform" strokeWidth={1} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="pointer-events-auto p-4 text-[#102E4A] hover:text-[#D4AF37] transition-colors group bg-white/50 rounded-full backdrop-blur-md border border-[#102E4A]/10 shadow-sm"
            >
              <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" strokeWidth={1} />
            </button>
          </div>

          <div 
            className="relative w-[92vw] md:w-[75vw] h-[75vh] md:h-[80vh] max-w-7xl shadow-[0_40px_80px_rgba(16,46,74,0.15)] bg-white p-3 md:p-6 pb-28 md:pb-32 border border-[#102E4A]/5 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full relative overflow-hidden bg-[#102E4A]/5"
              >
                <Image
                  src={current.src}
                  alt={current.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 92vw, 75vw"
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute bottom-5 md:bottom-8 left-5 md:left-10 right-5 md:right-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-2 md:gap-0">
              <div>
                <span className="text-[#D4AF37] font-body text-[10px] md:text-xs uppercase tracking-widest font-bold mb-1 md:mb-2 block">
                  {current.category}
                </span>
                <h3 className="font-display hfg-display text-2xl md:text-4xl text-[#102E4A] font-light leading-tight">
                  {current.title}
                </h3>
              </div>
              <div className="text-left md:text-right">
                <span className="text-[#102E4A]/40 font-body text-[10px] md:text-xs uppercase tracking-widest block font-bold">
                  {currentIndex + 1} <span className="mx-2">/</span> {images.length}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function GalleryPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Filter Logic
  const filteredImages = activeCategory === "all"
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory);

  // Split images into 3 arrays for the staggered masonry layout
  const col1 = filteredImages.filter((_, i) => i % 3 === 0);
  const col2 = filteredImages.filter((_, i) => i % 3 === 1);
  const col3 = filteredImages.filter((_, i) => i % 3 === 2);

  const openLightbox = useCallback((imageObj: GalleryImage) => {
    // Find the absolute index in the filtered array based on the clicked object
    const index = filteredImages.findIndex(img => img.id === imageObj.id);
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, [filteredImages]);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const prevImage = useCallback(() => setLightboxIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1)), [filteredImages.length]);
  const nextImage = useCallback(() => setLightboxIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1)), [filteredImages.length]);

  // GSAP High-End Animations
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const ctx = gsap.context(() => {
      // 1. Hero Text Entrance
      gsap.fromTo(
        ".hero-text",
        { y: 50, opacity: 0, rotateX: -20 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.1, ease: "power4.out" }
      );

      // 2. The Darkroom Transition: Background color shifts from Cream to Navy
      ScrollTrigger.create({
        trigger: galleryRef.current,
        start: "top 60%",
        end: "top 20%",
        scrub: true,
        animation: gsap.to("body, main", { 
          backgroundColor: "#060B11", // Deep Navy
          color: "#FDFBF7", 
          ease: "none" 
        }),
      });

      // 3. Parallax Columns (Desktop only)
      if (window.innerWidth > 768) {
        gsap.to(".masonry-col-1", {
          y: -100,
          ease: "none",
          scrollTrigger: { trigger: galleryRef.current, start: "top bottom", end: "bottom top", scrub: true }
        });
        gsap.to(".masonry-col-2", {
          y: -250, // Middle column moves faster
          ease: "none",
          scrollTrigger: { trigger: galleryRef.current, start: "top bottom", end: "bottom top", scrub: true }
        });
        gsap.to(".masonry-col-3", {
          y: -50,
          ease: "none",
          scrollTrigger: { trigger: galleryRef.current, start: "top bottom", end: "bottom top", scrub: true }
        });
      }

    }, mainRef);
    
    return () => {
      ctx.revert();
      // Cleanup body color on unmount
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, []);

  // Reusable Stamp Card Component
  const RenderColumn = ({ images, className, mtClass }: { images: GalleryImage[], className: string, mtClass: string }) => (
    <div className={`flex flex-col gap-10 md:gap-16 w-full ${className} ${mtClass}`}>
      <AnimatePresence mode="popLayout">
        {images.map((image, idx) => {
          // Organic random rotation between -4deg and 4deg
          const randomRotation = (idx % 2 === 0 ? -1 : 1) * ((idx % 3) + 2); 
          
          return (
            <motion.div
              layout
              key={image.id}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
              onClick={() => openLightbox(image)}
              className="relative cursor-pointer group"
              style={{ rotate: `${randomRotation}deg` }}
              whileHover={{ rotate: 0, scale: 1.05, zIndex: 10, transition: { duration: 0.4, ease: "easeOut" } }}
            >
              <div className="stamp-wrapper transition-all duration-500">
                <div className="stamp-frame">
                  <div className="stamp-content h-full flex flex-col">
                    
                    {/* Hover Overlay "View" Eye */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="bg-[#102E4A]/80 text-[#D4AF37] p-4 rounded-full backdrop-blur-md scale-50 group-hover:scale-100 transition-transform duration-500 delay-100">
                        <Eye className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="relative w-full aspect-[4/5] md:aspect-square flex-grow overflow-hidden bg-[#102E4A]/5">
                      <Image
                        src={image.src}
                        alt={image.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.1] filter grayscale-[20%] group-hover:grayscale-0"
                      />
                    </div>
                    
                    <div className="pt-4 flex flex-col bg-white text-center">
                      <h4 className="font-display hfg-display text-[#102E4A] font-medium text-lg md:text-xl line-clamp-1">
                        {image.title}
                      </h4>
                      <span className="font-body text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold mt-2">
                        {image.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );

  return (
    <main ref={mainRef} className="w-full min-h-screen bg-[#FDFBF7] text-[#102E4A] transition-colors duration-1000">
      
      <style jsx global>{`
        .hfg-display { font-family: "Fraunces", ui-serif, Georgia, serif; }
        .hfg-body { font-family: "Work Sans", ui-sans-serif, system-ui, sans-serif; }
        .hfg-script { font-family: "Caveat", "Dancing Script", cursive; } 
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .stamp-wrapper {
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2));
          display: block;
          width: 100%;
          height: 100%;
        }
        
        .stamp-frame {
          position: relative;
          background-color: #FFFFFF;
          background-image: radial-gradient(circle at 5px, transparent 5px, #FFFFFF 5.5px);
          background-size: 16px 16px;
          background-position: -5px -5px;
          padding: 12px 12px 36px 12px; 
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .stamp-frame::before {
          content: "";
          position: absolute;
          inset: 8px; 
          background-color: #FFFFFF;
          z-index: 0;
        }

        .stamp-content { position: relative; z-index: 1; flex-grow: 1; }
      `}</style>

      {/* --- SUPER SIZED HERO SECTION --- */}
      <section className="relative pt-40 md:pt-56 pb-20 md:pb-32 overflow-hidden">
        <div className="absolute top-[-5%] right-0 w-[90%] md:w-[60%] h-[120%] opacity-20 md:opacity-40 pointer-events-none z-0">
          <Image src="/images/about-bg.png" alt="Botanical Background" fill className="object-cover object-right mix-blend-multiply" />
        </div>

        <div className="max-w-[1400px] mx-auto px-5 md:px-10 relative z-10">
          <nav className="hero-text text-xs md:text-sm text-current/50 mb-10 flex items-center gap-2 font-body font-medium uppercase tracking-widest">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <span className="text-current/20">/</span>
            <span className="text-current">The Gallery</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="perspective-[1000px]">
              <div className="hero-text flex items-center gap-2 mb-4">
                <Leaf className="w-4 h-4 md:w-5 md:h-5 text-[#D4AF37]" />
                <span className="font-body text-[10px] md:text-xs font-bold tracking-widest uppercase">Visual Archive</span>
              </div>
              <h1 className="hero-text font-display hfg-display text-6xl sm:text-7xl md:text-[10rem] font-light leading-[0.85] tracking-tight">
                Curated <br /> 
                <span className="hfg-script text-[#D4AF37] text-7xl sm:text-8xl md:text-[11rem] -ml-2 block mt-2">Moments</span>
              </h1>
            </div>
            
            <div className="max-w-md hero-text">
              <p className="font-body hfg-body text-sm md:text-lg text-current/70 leading-relaxed border-l-2 border-[#D4AF37] pl-6 py-2">
                A definitive collection of architectural spaces, culinary artistry, and the meticulously orchestrated events hosted within our gardens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wrap filter and grid so the sticky behavior naturally ends before the footer */}
      <div className="relative">
        {/* --- INLINE TYPOGRAPHIC FILTER MENU --- */}
        <section className="sticky top-16 md:top-24 z-30 bg-inherit border-b border-current/10 py-4 transition-colors duration-1000 backdrop-blur-md bg-opacity-90">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10">
            <div className="flex gap-8 md:gap-12 overflow-x-auto no-scrollbar snap-x">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className="relative group text-left whitespace-nowrap py-4 snap-start"
                >
                  <span className={`font-display hfg-display text-xl md:text-3xl transition-colors duration-500 ${
                    activeCategory === cat.key ? "text-[#D4AF37] italic" : "text-current/40 hover:text-current/80"
                  }`}>
                    {cat.label}
                  </span>
                  
                  {activeCategory === cat.key && (
                    <motion.div
                      layoutId="activeInlineFilter"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* --- THE DARKROOM STAGGERED MASONRY GRID --- */}
        <section ref={galleryRef} className="py-20 md:py-40 relative z-10 min-h-screen">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10">
            
            {filteredImages.length === 0 ? (
              <div className="w-full py-32 text-center border border-current/10">
                <span className="font-body text-xs uppercase tracking-widest text-current/40 font-bold">Archive empty</span>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-10 md:gap-12 lg:gap-16">
                {/* Column 1 - Normal */}
                <RenderColumn images={col1} className="masonry-col-1" mtClass="mt-0" />
                
                {/* Column 2 - Pushed down massively on desktop */}
                <RenderColumn images={col2} className="masonry-col-2" mtClass="mt-0 md:mt-48" />
                
                {/* Column 3 - Pushed down slightly on desktop */}
                <RenderColumn images={col3} className="masonry-col-3" mtClass="mt-0 md:mt-24" />
              </div>
            )}

          </div>
        </section>
      </div>

      <Lightbox
        images={filteredImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </main>
  );
}