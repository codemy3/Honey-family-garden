"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ArrowRight, Leaf } from "lucide-react";
import toast from "react-hot-toast";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- MOCK REVIEWS DATA (Replace with API fetch later) ---
const mockReviews = [
  {
    id: "1",
    name: "Eleanor Richards",
    rating: 5,
    date: "October 12, 2025",
    comment: "The Botanical Garden provided a breathtaking backdrop for our corporate gala. The operational fluidity and the attention to detail from the culinary team were unmatched. A truly elite experience.",
    image: "/images/scene1.webp"
  },
  {
    id: "2",
    name: "James & Sarah",
    rating: 5,
    date: "September 28, 2025",
    comment: "We hosted our wedding reception in the AC Hall. The acoustics were perfect for our live band, and the climate control kept everyone comfortable throughout the celebration.",
    image: "/images/scene2.webp"
  },
  {
    id: "3",
    name: "Marcus Thorne",
    rating: 5,
    date: "August 15, 2025",
    comment: "An exceptional venue. The sharp, clean architectural lines of the indoor spaces contrasted beautifully with the lush outdoor greenery. Highly recommended for high-stakes events.",
    image: "/images/hero.webp"
  }
];

export default function ReviewsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  
  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      toast.success("Review submitted successfully! It is pending approval.");
      setFormData({ name: "", email: "", phone: "", comment: "" });
      setRating(5);
      setIsSubmitting(false);
    }, 1500);
  };

  // GSAP Scroll Animations
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.fromTo(
        ".hero-text",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
      );

      // Background Parallax
      gsap.to(bgRef.current, {
        y: "15%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Review Stamp Cards Animation
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
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#FDFBF7] text-[#102E4A] overflow-hidden">
      
      <style jsx global>{`
        .hfg-display { font-family: "Fraunces", ui-serif, Georgia, serif; }
        .hfg-body { font-family: "Work Sans", ui-sans-serif, system-ui, sans-serif; }
        .hfg-script { font-family: "Caveat", "Dancing Script", cursive; } 
        
        .sharp-input:focus {
          outline: none;
          border-color: #102E4A;
          box-shadow: 3px 3px 0px rgba(212, 175, 55, 0.3);
        }

        .stamp-wrapper {
          filter: drop-shadow(0 15px 30px rgba(16, 46, 74, 0.08));
          display: block;
          width: 100%;
        }
        
        .stamp-frame {
          position: relative;
          background-color: transparent;
          background-image: radial-gradient(circle at 4px, transparent 4px, #FFFFFF 4.5px);
          background-size: 14px 14px;
          background-position: -4px -4px;
          padding: 10px 10px 32px 10px; 
          background-color: #FFFFFF;
        }

        .stamp-frame::before {
          content: "";
          position: absolute;
          inset: 6px; 
          background-color: #FFFFFF;
          z-index: 0;
        }

        .stamp-content {
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 bg-white border-b border-[#102E4A]/10 overflow-hidden">
        
        {/* Parallax Background Botanical Sketch */}
        <div ref={bgRef} className="absolute top-[-5%] right-0 w-[80%] md:w-[50%] h-[110%] opacity-15 md:opacity-30 pointer-events-none z-0">
          <Image 
            src="/images/about-bg.webp" 
            alt="Botanical Background" 
            fill 
            className="object-cover object-right mix-blend-multiply" 
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-5 md:px-10 relative z-10">
          <nav className="hero-text text-xs md:text-sm text-[#102E4A]/50 mb-8 md:mb-10 flex items-center gap-2 font-body font-medium uppercase tracking-widest">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <span className="text-[#102E4A]/20">/</span>
            <span className="text-[#102E4A]">Guest Experiences</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-10">
            <div>
              <div className="hero-text flex items-center gap-2 mb-3 md:mb-4">
                <Leaf className="w-4 h-4 md:w-5 md:h-5 text-[#D4AF37]" />
                <span className="font-body text-[#102E4A] text-[10px] md:text-xs font-bold tracking-widest uppercase">Testimonials</span>
              </div>
              <h1 className="hero-text font-display hfg-display text-5xl sm:text-6xl md:text-8xl font-light leading-[0.9] tracking-tight text-[#102E4A]">
                Guest <br /> 
                <span className="hfg-script text-[#D4AF37] text-6xl sm:text-7xl md:text-9xl -ml-1 md:-ml-2 block mt-1 md:mt-0">Experiences</span>
              </h1>
            </div>
            
            <div className="max-w-md">
              <p className="hero-text font-body hfg-body text-sm md:text-base text-[#102E4A]/70 leading-relaxed border-l-2 border-[#D4AF37] pl-4 md:pl-6 bg-white/50 backdrop-blur-sm py-2 rounded-r-lg">
                Read firsthand accounts of the flawless execution experienced by our guests, or share your own celebration story with us below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Torn Paper SVG Edge Divider --- */}
      <div className="w-full h-8 md:h-16 relative -mt-4 md:-mt-8 z-20 pointer-events-none text-[#FDFBF7]">
        <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none" className="w-full h-full drop-shadow-sm">
          <path d="M0 48H1440V0C1440 0 1380 24 1320 20C1260 16 1200 -4 1140 4C1080 12 1020 36 960 32C900 28 840 8 780 12C720 16 660 36 600 32C540 28 480 8 420 12C360 16 300 36 240 32C180 28 120 8 60 12C30 14 0 24 0 24V48Z" fill="currentColor"/>
        </svg>
      </div>

      {/* --- CONTENT SECTION: FORM & STAMP REVIEWS --- */}
      <section className="py-12 md:py-24 relative bg-[#FDFBF7] z-10">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* LEFT: STICKY SUBMISSION FORM */}
          <aside className="w-full lg:w-5/12 flex-shrink-0">
            <div className="lg:sticky lg:top-32 bg-white p-6 md:p-10 border border-[#102E4A]/10 shadow-[0_15px_30px_rgba(16,46,74,0.04)]">
              <h3 className="font-display hfg-display text-2xl md:text-3xl text-[#102E4A] mb-2 font-light">Share Your Story</h3>
              <p className="font-body text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] font-bold mb-6 md:mb-8">
                Submit a Review
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
                
                {/* Star Rating */}
                <div className="flex flex-col gap-2">
                  <label className="font-body text-[11px] uppercase tracking-widest text-[#102E4A] font-bold">Rating</label>
                  <div className="flex gap-1" onMouseLeave={() => setHoveredStar(null)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        className="p-1 -ml-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star 
                          className={`w-6 h-6 md:w-7 md:h-7 transition-colors duration-200 ${
                            star <= (hoveredStar ?? rating) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#102E4A]/15"
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="font-body text-[10px] md:text-[11px] uppercase tracking-widest text-[#102E4A] font-bold">Full Name *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="sharp-input w-full bg-[#FDFBF7] border border-[#102E4A]/15 px-4 py-3 font-body text-sm text-[#102E4A]"
                      placeholder="Jane Doe"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="font-body text-[10px] md:text-[11px] uppercase tracking-widest text-[#102E4A] font-bold">Phone Number *</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="sharp-input w-full bg-[#FDFBF7] border border-[#102E4A]/15 px-4 py-3 font-body text-sm text-[#102E4A]"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="font-body text-[10px] md:text-[11px] uppercase tracking-widest text-[#102E4A] font-bold">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="sharp-input w-full bg-[#FDFBF7] border border-[#102E4A]/15 px-4 py-3 font-body text-sm text-[#102E4A]"
                    placeholder="jane@company.com"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="comment" className="font-body text-[10px] md:text-[11px] uppercase tracking-widest text-[#102E4A] font-bold">Your Experience *</label>
                  <textarea
                    id="comment"
                    name="comment"
                    required
                    rows={4}
                    value={formData.comment}
                    onChange={handleChange}
                    className="sharp-input w-full bg-[#FDFBF7] border border-[#102E4A]/15 px-4 py-3 font-body text-sm text-[#102E4A] resize-none"
                    placeholder="Tell us about your event..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex items-center justify-between bg-[#102E4A] text-white px-6 md:px-8 py-4 font-body text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-[#D4AF37] hover:text-[#102E4A] transition-colors disabled:opacity-70 group"
                >
                  <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </aside>

          {/* RIGHT: STAMP-FRAMED REVIEWS GRID */}
          <div className="reviews-container w-full lg:w-7/12 flex flex-col gap-8 md:gap-10">
            {mockReviews.map((review) => (
              <div key={review.id} className="review-stamp">
                <div className="stamp-wrapper transition-transform duration-500 hover:-translate-y-1">
                  <div className="stamp-frame">
                    <div className="stamp-content flex flex-col sm:flex-row gap-5 md:gap-6 items-start sm:items-center p-3 md:p-4">
                      
                      {/* Optional Stamp Photo */}
                      <div className="relative w-full sm:w-32 md:w-40 h-48 sm:h-48 flex-shrink-0 overflow-hidden bg-[#102E4A]/5">
                        <Image 
                          src={review.image} 
                          alt={review.name} 
                          fill 
                          sizes="(max-width: 640px) 100vw, 160px"
                          className="object-cover"
                        />
                      </div>

                      {/* Review Details */}
                      <div className="flex-grow flex flex-col justify-between py-1 w-full">
                        <div>
                          <div className="flex gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3.5 h-3.5 ${i < review.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#102E4A]/10"}`} 
                              />
                            ))}
                          </div>
                          <p className="font-display hfg-display text-base md:text-xl text-[#102E4A] font-light leading-relaxed mb-6">
                            "{review.comment}"
                          </p>
                        </div>

                        <div className="flex justify-between items-end border-t border-[#102E4A]/10 pt-4">
                          <h4 className="font-body text-[11px] md:text-xs font-bold text-[#102E4A] uppercase tracking-widest">{review.name}</h4>
                          <span className="font-body text-[9px] text-[#102E4A]/50 uppercase tracking-widest font-bold">
                            {review.date}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}