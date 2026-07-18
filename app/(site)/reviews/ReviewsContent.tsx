"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, Leaf } from "lucide-react";
import ClientReviewsWrapper from "./ClientReviewsWrapper";

import { Review } from "@/lib/validation";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || []);
      })
      .catch((err) => console.error("Error fetching reviews:", err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <ClientReviewsWrapper>
      <div className="w-full min-h-screen bg-[#FDFBF7] text-[#102E4A] overflow-hidden">
        
        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 bg-white border-b border-[#102E4A]/10 overflow-hidden">
          
          {/* Parallax Background Botanical Sketch */}
          <div className="js-parallax-bg absolute top-[-5%] right-0 w-[80%] md:w-[50%] h-[110%] opacity-15 md:opacity-30 pointer-events-none z-0">
            <Image 
              src="/images/about-bg.png" 
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
            
            {/* LEFT: STICKY SUBMISSION FORM CONTAINER */}
            <aside className="w-full lg:w-5/12 flex-shrink-0">
              <div className="bg-white p-6 md:p-10 border border-[#102E4A]/10 shadow-[0_15px_30px_rgba(16,46,74,0.04)]">
                <h3 className="font-display hfg-display text-2xl md:text-3xl text-[#102E4A] mb-2 font-light">Share Your Story</h3>
                <p className="font-body text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] font-bold mb-6 md:mb-8">
                  Submit a Review
                </p>

                {/* Form handled cleanly dynamically downstream */}
                <div className="js-form-placeholder" />
              </div>
            </aside>

            {/* RIGHT: STAMP-FRAMED REVIEWS GRID */}
            <div className="reviews-container w-full lg:w-7/12 flex flex-col gap-8 md:gap-10">
              {loading ? (
                <div className="text-center py-12 text-[#102E4A]/50 font-body">Loading experiences...</div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12 text-[#102E4A]/50 font-body">No reviews available yet.</div>
              ) : (
                reviews.map((review, index) => {
                  const dynamicImages = [
                    "/images/scene2.webp", 
                    "/images/scene4.webp", 
                    "/images/scene5.webp", 
                    "/images/scene7.webp", 
                    "/images/scene8.webp", 
                    "/images/outdoor.jpeg", 
                    "/images/indoor2.png"
                  ];
                  
                  // Use the first uploaded image, fallback to dynamic array
                  const img = review.images && review.images.length > 0 ? review.images[0] : dynamicImages[index % dynamicImages.length];

                  return (
                  <div key={review.id} className="review-stamp">
                    <div className="stamp-wrapper transition-transform duration-500 hover:-translate-y-1">
                      <div className="stamp-frame">
                        <div className="stamp-content flex flex-col sm:flex-row gap-5 md:gap-6 items-start sm:items-center p-3 md:p-4">
                          
                          <div className="relative w-full sm:w-32 md:w-40 h-48 sm:h-48 flex-shrink-0 overflow-hidden bg-[#102E4A]/5">
                            <Image 
                              src={img} 
                              alt={review.name} 
                              fill 
                              sizes="(max-width: 640px) 100vw, 160px"
                              className="object-cover"
                            />
                          </div>

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
                              {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                  </div>
                  );
                })
              )}
            </div>

          </div>
        </section>
      </div>
    </ClientReviewsWrapper>
  );
}