"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/hall-info", label: "Halls" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Main Navbar - Floating Pill Layout */}
      <div className="fixed top-4 md:top-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <nav
          className={clsx(
            "pointer-events-auto w-full max-w-7xl rounded-full transition-all duration-500 shadow-2xl flex items-center justify-between pr-2 pl-4 md:pl-6 py-2 border",
            isScrolled
              ? "bg-navy/95 backdrop-blur-xl border-gold/30 shadow-black/50"
              : "bg-navy/80 backdrop-blur-md border-gold/10 shadow-black/20"
          )}
        >
          {/* Logo - Left Side */}
          <div className="flex-1 flex justify-start">
            <Link
              href="/"
              className="flex-shrink-0 group relative"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 overflow-hidden flex items-center justify-center relative"
                >
                  <Image
                    src="/images/logo.png"
                    alt="Honey Family Garden Logo"
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </motion.div>
               
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Center (Perfectly Centered) */}
          <div className="hidden lg:flex flex-none items-center gap-2 md:gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={pathname === link.href}
                isScrolled={isScrolled}
              />
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex-1 flex justify-end items-center gap-2 sm:gap-4">
            {/* CTA Button - Desktop Only */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/contact"
                className={clsx(
                  "hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300",
                  "bg-gold text-navy hover:shadow-lg hover:shadow-gold/40"
                )}
              >
                <span>Enquire</span>
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  whileHover={{ x: 3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </motion.svg>
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors mr-1"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className="flex flex-col gap-1.5"
                animate={isMobileMenuOpen ? "open" : "closed"}
              >
                <motion.span
                  className="block w-5 h-0.5 bg-cream rounded-full"
                  variants={{
                    open: { rotate: 45, y: 7, transition: { duration: 0.3 } },
                    closed: { rotate: 0, y: 0, transition: { duration: 0.3 } },
                  }}
                />
                <motion.span
                  className="block w-5 h-0.5 bg-cream rounded-full"
                  variants={{
                    open: { opacity: 0, transition: { duration: 0.2 } },
                    closed: { opacity: 1, transition: { duration: 0.3 } },
                  }}
                />
                <motion.span
                  className="block w-5 h-0.5 bg-cream rounded-full"
                  variants={{
                    open: { rotate: -45, y: -7, transition: { duration: 0.3 } },
                    closed: { rotate: 0, y: 0, transition: { duration: 0.3 } },
                  }}
                />
              </motion.div>
            </motion.button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu - Glass Morphism Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-30 lg:hidden bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-40 w-80 backdrop-blur-xl bg-navy/95 border-l border-gold/20 shadow-2xl flex flex-col overflow-y-auto"
            >
              {/* Header with close hint */}
              <div className="sticky top-0 p-6 border-b border-gold/20 bg-navy/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-cream">Menu</div>
                    <div className="text-xs text-gold uppercase tracking-widest">
                      Navigation
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                  >
                    <svg
                      className="w-5 h-5 text-cream"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 px-4 py-6 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={clsx(
                        "block px-4 py-3 rounded-lg font-medium transition-all duration-200 group relative",
                        pathname === link.href
                          ? "text-gold bg-gold/10"
                          : "text-cream/80 hover:text-cream hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-gold"
                          animate={
                            pathname === link.href ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
                          }
                        />
                        <span>{link.label}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* CTA in Mobile Menu */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="px-4 py-4 border-t border-gold/20 bg-gradient-to-t from-navy/50 to-transparent"
              >
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gold text-navy font-bold rounded-full hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <span>Book Your Event</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </Link>
              </motion.div>

              {/* Footer Info */}
              <div className="px-6 py-4 text-cream/40 text-xs border-t border-gold/10">
                <p className="font-semibold text-cream/60 mb-1">Honey Family Garden</p>
                <p>Premium Event Venue</p>
                <p>Shimoga, Karnataka</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// NavLink Component - Desktop Navigation Item with Elegant Underline
function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
  isScrolled: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className={clsx(
        "relative px-4 py-2 text-sm font-semibold transition-colors duration-200",
        isActive ? "text-gold" : "text-cream/80 hover:text-cream"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}

      {/* Elegant underline - appears on active or hover */}
      <motion.div
        className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-gold/0 via-gold to-gold/0 rounded-full"
        animate={{
          scaleX: isActive || isHovered ? 1 : 0,
          opacity: isActive || isHovered ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 35,
          duration: 0.3,
        }}
      />
    </Link>
  );
}