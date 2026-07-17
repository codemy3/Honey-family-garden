"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Phone, MapPin, Clock, Mail } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";

export default function ContactContent() {
  const bgRef = useRef<HTMLDivElement>(null);

  // Parallax for header
  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { ref: infoRef, inView: infoInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <>
      {/* Page Header */}
      <section className="relative h-[300px] md:h-[350px] overflow-hidden flex items-center justify-center">
        <div
          ref={bgRef}
          className="absolute inset-0 w-full h-[140%] -top-[20%]"
          style={{
            backgroundImage: "url('/images/hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "transform",
          }}
        />
        <div className="absolute inset-0 bg-navy/70" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-5"
        >
          <h1 className="font-display font-bold text-4xl md:text-5xl text-cream mb-3 text-shadow">
            Get in Touch
          </h1>
          <p className="text-cream/80 text-lg">
            Plan your perfect event with us
          </p>
        </motion.div>
      </section>

      {/* Contact Info + Map */}
      <section ref={infoRef} className="bg-cream py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={infoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6"
          >
            {/* Contact Info Card */}
            <div className="lg:col-span-2 bg-navy rounded-xl p-6 md:p-8 text-cream">
              <h3 className="font-display font-bold text-xl mb-1">
                Honey Family Garden Restaurant
              </h3>
              <p className="text-cream/50 text-sm mb-6">
                Premium Event Venue in Shimoga
              </p>

              <div className="w-full h-px bg-cream/10 mb-6" />

              <div className="space-y-5">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <span className="text-gold mt-0.5"><Phone className="w-5 h-5" /></span>
                  <div>
                    <p className="text-cream/60 text-xs font-semibold uppercase tracking-wider mb-1">
                      Phone
                    </p>
                    <a
                      href="tel:+918XXXXXXXXX"
                      className="text-cream text-sm hover:text-gold transition-colors"
                    >
                      +91 8XXX-XXXXXX
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <span className="text-gold mt-0.5"><MapPin className="w-5 h-5" /></span>
                  <div>
                    <p className="text-cream/60 text-xs font-semibold uppercase tracking-wider mb-1">
                      Address
                    </p>
                    <a
                      href="https://maps.google.com/?q=Shimoga+Karnataka"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cream text-sm hover:text-gold transition-colors"
                    >
                      Honey Family Garden Restaurant
                      <br />
                      Shimoga, Karnataka
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <span className="text-gold mt-0.5"><Clock className="w-5 h-5" /></span>
                  <div>
                    <p className="text-cream/60 text-xs font-semibold uppercase tracking-wider mb-1">
                      Hours
                    </p>
                    <p className="text-cream text-sm">
                      Mon – Sun: 11:00 AM – 11:00 PM
                    </p>
                    <p className="text-cream/50 text-xs mt-0.5">
                      Events: Flexible timing
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <span className="text-gold mt-0.5"><Mail className="w-5 h-5" /></span>
                  <div>
                    <p className="text-cream/60 text-xs font-semibold uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <a
                      href="mailto:contact@honeygarden.com"
                      className="text-cream text-sm hover:text-gold transition-colors"
                    >
                      contact@honeygarden.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="lg:col-span-3 rounded-xl overflow-hidden shadow-lg min-h-[350px] lg:min-h-[450px]">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "350px" }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62076.95398613024!2d75.5279!3d13.9299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbb7de4a1b0b2c5%3A0x8d3a2a45a9f38b0!2sShimoga%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Honey Family Garden Restaurant Location"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="bg-offwhite py-16">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}
