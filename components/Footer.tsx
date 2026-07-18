"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Leaf, ArrowUpRight } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/hall-info", label: "Hall Info" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

const services = [
  { label: "Weddings & Receptions", href: "/hall-info" },
  { label: "Corporate Events", href: "/hall-info" },
  { label: "Birthday Parties", href: "/hall-info" },
  { label: "Family Functions", href: "/hall-info" },
  { label: "Catering Services", href: "/hall-info" },
];

export default function Footer() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <footer ref={ref} className="bg-[#102E4A] text-[#FDFBF7] relative overflow-hidden border-t border-[#D4AF37]/20">
      
      <style jsx global>{`
        .hfg-display { font-family: "Fraunces", ui-serif, Georgia, serif; }
        .hfg-body { font-family: "Work Sans", ui-sans-serif, system-ui, sans-serif; }
        .hfg-script { font-family: "Caveat", "Dancing Script", cursive; } 
      `}</style>

      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Container */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8"
        >
          {/* Column 1: Brand & Logo */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="relative w-12 h-12 flex-shrink-0 bg-white/5 rounded-full p-2 border border-white/10">
                  <Image
                    src="/images/logo.png"
                    alt="Honey Family Garden Logo"
                    fill
                    className="object-contain p-1.5"
                  />
                </div>
                <span className="font-display hfg-display text-lg font-bold tracking-wide text-white">
                  Honey Family Garden
                </span>
              </div>
              <p className="font-body text-[#FDFBF7]/80 text-sm leading-relaxed max-w-sm">
                Your sanctuary for celebrations in Shimoga, where modern architectural elegance meets natural splendor.
              </p>
            </div>
            
            <div className="hidden lg:block pt-4">
              <span className="font-display hfg-display italic text-[#D4AF37] text-base">
                &ldquo;Where memories blossom&rdquo;
              </span>
            </div>
          </div>

          {/* Column 2 & 3: Quick Links & Services (Side-by-side on mobile) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-10">
            {/* Column 2: Quick Links */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="w-3.5 h-3.5 !text-[#D4AF37] shrink-0" />
                <h4 className="font-body text-xs sm:text-sm font-bold uppercase tracking-widest !text-[#D4AF37] whitespace-nowrap">
                  Navigation
                </h4>
              </div>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#FDFBF7]/80 font-body text-xs sm:text-sm hover:text-white transition-colors duration-300 flex items-center gap-2 sm:gap-3 group w-fit"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40 group-hover:bg-[#D4AF37] group-hover:scale-125 transition-all shrink-0" />
                      <span className="whitespace-nowrap">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Services */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="w-3.5 h-3.5 !text-[#D4AF37] shrink-0" />
                <h4 className="font-body text-xs sm:text-sm font-bold uppercase tracking-widest !text-[#D4AF37] whitespace-nowrap">
                  Our Services
                </h4>
              </div>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.label}>
                    <Link
                      href={service.href}
                      className="text-[#FDFBF7]/80 font-body text-xs sm:text-sm hover:text-white transition-colors duration-300 flex items-center gap-2 sm:gap-3 group w-fit"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40 group-hover:bg-[#D4AF37] group-hover:scale-125 transition-all shrink-0" />
                      <span className="whitespace-normal sm:whitespace-nowrap leading-tight">{service.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Contact & Timing */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="w-3.5 h-3.5 !text-[#D4AF37] shrink-0" />
              <h4 className="font-body text-xs sm:text-sm font-bold uppercase tracking-widest !text-[#D4AF37] whitespace-nowrap">
                Get In Touch
              </h4>
            </div>
            <div className="space-y-5 font-body text-sm">
              <div>
                <p className="text-white/60 text-[10px] uppercase tracking-[0.15em] font-bold mb-1">Location</p>
                <p className="text-white font-medium">Shimoga, Karnataka</p>
              </div>

              <div>
                <p className="text-white/60 text-[10px] uppercase tracking-[0.15em] font-bold mb-1">Direct Line</p>
                <a
                  href="tel:+917204724250"
                  className="text-[#D4AF37] hover:text-white transition-colors inline-flex items-center gap-1.5 group font-semibold text-lg"
                >
                  <span>+91 72047 24250</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              <div>
                <p className="text-white/60 text-[10px] uppercase tracking-[0.15em] font-bold mb-1">Hours</p>
                <p className="text-white font-medium">Mon – Sun: 11:00 AM – 11:00 PM</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Copyright & Credit Bar */}
      <div className="border-t border-white/10 bg-[#0A1F33]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[#FDFBF7]/50 font-body text-xs">
            © {new Date().getFullYear()} Honey Family Garden. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 text-xs font-body">
            <p className="text-[#FDFBF7]/60">
              Built by{" "}
              <a 
                href="https://maithri-portfolio-amber.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:text-white font-semibold transition-colors underline decoration-[#D4AF37]/40 hover:decoration-white underline-offset-4"
              >
                my3
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}