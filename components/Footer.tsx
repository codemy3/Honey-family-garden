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
  "Weddings & Receptions",
  "Corporate Events",
  "Birthday Parties",
  "Family Functions",
  "Catering Services",
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
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8"
        >
          {/* Column 1: Brand & Logo */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 flex-shrink-0 bg-white/5 rounded-full p-2 border border-white/10">
                  <Image
                    src="/images/logo.png"
                    alt="Honey Family Garden Logo"
                    fill
                    className="object-contain p-1.5"
                  />
                </div>
                <span className="font-display hfg-display text-lg font-bold tracking-wide">
                  Honey Family Garden
                </span>
              </div>
              <p className="font-body text-[#FDFBF7]/70 text-xs md:text-sm leading-relaxed">
                Your sanctuary for celebrations in Shimoga, where modern architectural elegance meets natural splendor.
              </p>
            </div>
            
            <div className="hidden lg:block">
              <span className="font-display hfg-display italic text-[#D4AF37] text-sm">
                &ldquo;Where memories blossom&rdquo;
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-3.5 h-3.5 text-[#D4AF37]" />
              <h4 className="font-body text-xs font-bold uppercase tracking-[0.2em] text-white">
                Navigation
              </h4>
            </div>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#FDFBF7]/70 font-body text-xs md:text-sm hover:text-[#D4AF37] transition-colors duration-300 flex items-center gap-2 group w-fit"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40 group-hover:bg-[#D4AF37] group-hover:scale-125 transition-all" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-3.5 h-3.5 text-[#D4AF37]" />
              <h4 className="font-body text-xs font-bold uppercase tracking-[0.2em] text-white">
                Our Services
              </h4>
            </div>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-[#FDFBF7]/70 font-body text-xs md:text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40" />
                    <span>{service}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Timing */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-3.5 h-3.5 text-[#D4AF37]" />
              <h4 className="font-body text-xs font-bold uppercase tracking-[0.2em] text-white">
                Get In Touch
              </h4>
            </div>
            <div className="space-y-3 font-body text-xs md:text-sm">
              <div>
                <p className="text-[#FDFBF7]/40 text-[9px] uppercase tracking-wider font-bold mb-0.5">Location</p>
                <p className="text-[#FDFBF7]/80">Shimoga, Karnataka</p>
              </div>

              <div>
                <p className="text-[#FDFBF7]/40 text-[9px] uppercase tracking-wider font-bold mb-0.5">Direct Line</p>
                <a
                  href="tel:+918000000000"
                  className="text-[#FDFBF7]/80 hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1 group font-medium"
                >
                  <span>+91 80000 00000</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              <div>
                <p className="text-[#FDFBF7]/40 text-[9px] uppercase tracking-wider font-bold mb-0.5">Hours</p>
                <p className="text-[#FDFBF7]/80">Mon – Sun: 11:00 AM – 11:00 PM</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Copyright & Credit Bar */}
      <div className="border-t border-white/10 bg-[#0A1F33]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-[#FDFBF7]/40 font-body text-[11px]">
            © {new Date().getFullYear()} Honey Family Garden. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 text-[11px] font-body">
            <span className="text-[#D4AF37]/80 tracking-wider">
              Crafted with 🍯 in Shimoga
            </span>
            <span className="text-white/20">•</span>
            <p className="text-[#FDFBF7]/50">
              Built by{" "}
              <a 
                href="https://maithri-portfolio-amber.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:text-white font-medium transition-colors underline decoration-[#D4AF37]/40 hover:decoration-white underline-offset-2"
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