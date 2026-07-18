"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Star, ArrowRight, ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ClientReviewsWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0); // Start at 0
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-text",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
      );

      const bgElement = containerRef.current?.querySelector(".js-parallax-bg");
      if (bgElement) {
        gsap.to(bgElement, {
          y: "15%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      gsap.fromTo(
        ".review-stamp",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".reviews-container",
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setImages(prev => [...prev, ...selected].slice(0, 3)); // Max 3 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please provide a rating out of 5 stars.");
      return;
    }
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("comment", formData.comment);
      data.append("rating", rating.toString());
      images.forEach(file => data.append("images", file));

      const res = await fetch("/api/reviews", {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        toast.success("Review submitted successfully! Pending approval.");
        setFormData({ name: "", email: "", phone: "", comment: "" });
        setRating(0);
        setImages([]);
      } else {
        toast.error("Failed to submit review.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      <style jsx global>{`
        .hfg-display { font-family: "Fraunces", ui-serif, Georgia, serif; }
        .hfg-body { font-family: "Work Sans", ui-sans-serif, system-ui, sans-serif; }
        .hfg-script { font-family: "Caveat", "Dancing Script", cursive; } 
        .sharp-input:focus { outline: none; border-color: #102E4A; box-shadow: 3px 3px 0px rgba(212, 175, 55, 0.3); }
        .stamp-wrapper { filter: drop-shadow(0 15px 30px rgba(16, 46, 74, 0.08)); display: block; width: 100%; }
        .stamp-frame { position: relative; background-color: transparent; background-image: radial-gradient(circle at 4px, transparent 4px, #FFFFFF 4.5px); background-size: 14px 14px; background-position: -4px -4px; padding: 10px 10px 32px 10px; background-color: #FFFFFF; }
        .stamp-frame::before { content: ""; position: absolute; inset: 6px; background-color: #FFFFFF; z-index: 0; }
        .stamp-content { position: relative; z-index: 1; }

        @keyframes starPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .star-empty-pulse {
          animation: starPulse 2s infinite ease-in-out;
        }
        @keyframes starPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .star-filled-pop {
          animation: starPop 0.3s ease-out forwards;
        }
      `}</style>

      {/* Render structure tree layout natively */}
      {children}

      {/* Teleport Interactive Form directly inside structure template space safely post-mount */}
      {mounted && typeof document !== "undefined" && (
        <Portal injectorSelector=".js-form-placeholder">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-body text-[11px] uppercase tracking-widest text-[#102E4A] font-bold">Rating</label>
              <div className="flex gap-2" onMouseLeave={() => setHoveredStar(null)}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= (hoveredStar ?? rating);
                  const isPulse = rating === 0 && hoveredStar === null;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      className="p-1 -ml-1 focus:outline-none"
                    >
                      <Star 
                        className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-200 
                          ${isFilled ? "fill-[#D4AF37] text-[#D4AF37] star-filled-pop" : "text-[#102E4A]/15"} 
                          ${isPulse ? "star-empty-pulse" : ""}
                        `} 
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="font-body text-[10px] md:text-[11px] uppercase tracking-widest text-[#102E4A] font-bold">Full Name *</label>
                <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="sharp-input w-full bg-[#FDFBF7] border border-[#102E4A]/15 px-4 py-3 font-body text-sm text-[#102E4A]" placeholder="Jane Doe" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="font-body text-[10px] md:text-[11px] uppercase tracking-widest text-[#102E4A] font-bold">Phone Number *</label>
                <input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="sharp-input w-full bg-[#FDFBF7] border border-[#102E4A]/15 px-4 py-3 font-body text-sm text-[#102E4A]" placeholder="+91 00000 00000" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-body text-[10px] md:text-[11px] uppercase tracking-widest text-[#102E4A] font-bold">Email Address *</label>
              <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="sharp-input w-full bg-[#FDFBF7] border border-[#102E4A]/15 px-4 py-3 font-body text-sm text-[#102E4A]" placeholder="jane@company.com" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="comment" className="font-body text-[10px] md:text-[11px] uppercase tracking-widest text-[#102E4A] font-bold">Your Experience *</label>
              <textarea id="comment" name="comment" required rows={4} value={formData.comment} onChange={handleChange} className="sharp-input w-full bg-[#FDFBF7] border border-[#102E4A]/15 px-4 py-3 font-body text-sm text-[#102E4A] resize-none" placeholder="Tell us about your event..." />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[10px] md:text-[11px] uppercase tracking-widest text-[#102E4A] font-bold">Add Photos (Max 3)</label>
              <div className="flex flex-wrap gap-3">
                {images.map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden group">
                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <label className="w-20 h-20 border-2 border-dashed border-[#102E4A]/20 hover:border-[#D4AF37] rounded-md flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#FDFBF7]">
                    <ImagePlus className="w-6 h-6 text-[#102E4A]/40 mb-1" />
                    <span className="text-[9px] font-body text-[#102E4A]/60">Upload</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="mt-2 flex items-center justify-between bg-[#102E4A] text-white px-6 md:px-8 py-4 font-body text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-[#D4AF37] hover:text-[#102E4A] transition-colors disabled:opacity-70 group">
              <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </Portal>
      )}
    </div>
  );
}

// Simple internal portal renderer matching standard client mounts safely
function Portal({ children, injectorSelector }: { children: React.ReactNode; injectorSelector: string }) {
  const [target, setTarget] = useState<Element | null>(null);
  useEffect(() => {
    setTarget(document.querySelector(injectorSelector));
  }, [injectorSelector]);
  if (!target) return null;
  return createPortal(children, target);
}