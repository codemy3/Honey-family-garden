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
      <div className="fixed top-4 md:top-6 left-0 right-0 z-[100] flex justify-center px-4 lg:px-6 pointer-events-none">
        {/* Using motion.nav with layout for the smooth shrink/expand effect */}
        <motion.nav
          layout
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className={clsx(
            "pointer-events-auto flex items-center rounded-full transition-colors duration-300",
            // Mobile layout shift
            isScrolled
              ? "w-auto bg-navy/85 backdrop-blur-2xl border border-gold/40 shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-1.5 pr-4 gap-3 lg:gap-0" // The centered pill
              : "w-full justify-between bg-transparent border border-transparent shadow-none p-1 lg:p-2", // Full width transparent
            // Desktop overrides (always full width, just changes background)
            "lg:w-full lg:max-w-7xl lg:justify-between lg:px-6 lg:py-2 lg:pr-6",
            !isScrolled && "lg:bg-navy/40 lg:backdrop-blur-xl lg:border-gold/20"
          )}
        >
          {/* Logo */}
          <motion.div layout className="flex-none lg:flex-1 flex justify-start">
            <Link
              href="/"
              className="flex-shrink-0 group relative block"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                layout
                className={clsx(
                  "flex items-center justify-center rounded-full transition-all duration-300",
                  // Add subtle circle behind logo only when scrolled into the pill
                  isScrolled
                    ? "bg-navy/80 lg:bg-transparent p-1.5 lg:p-0 border border-gold/20 lg:border-transparent shadow-inner lg:shadow-none"
                    : "bg-transparent p-0 border-transparent"
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 lg:w-14 lg:h-14 overflow-hidden flex items-center justify-center relative"
                >
                  <Image
                    src="/images/logo.png"
                    alt="Honey Family Garden Logo"
                    fill
                    sizes="(max-width: 1024px) 40px, 56px"
                    className="object-contain drop-shadow-md"
                  />
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Vertical Divider (Mobile Scrolled Only) */}
          <AnimatePresence>
            {isScrolled && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 1 }}
                exit={{ opacity: 0, width: 0 }}
                className="lg:hidden h-6 bg-gradient-to-b from-gold/0 via-gold/40 to-gold/0 flex-none"
              />
            )}
          </AnimatePresence>

          {/* Desktop Navigation - Center */}
          <motion.div layout className="hidden lg:flex flex-none items-center justify-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={pathname === link.href}
                isScrolled={isScrolled}
              />
            ))}
          </motion.div>

          {/* Right Actions */}
          <motion.div layout className="flex-none lg:flex-1 flex justify-end items-center gap-2 sm:gap-4 lg:pr-0">
            {/* CTA Button - Desktop Only */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="hidden lg:block">
              <Link
                href="/contact"
                className={clsx(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300",
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </motion.svg>
              </Link>
            </motion.div>

            {/* Mobile Menu Button - Transforms on scroll */}
            <motion.button
              layout
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={clsx(
                "lg:hidden flex items-center gap-2.5 transition-all duration-300 rounded-full",
                // When at the top, it looks like a standalone glass button. When scrolled, it merges into the pill.
                isScrolled
                  ? "text-cream hover:text-gold pl-1"
                  : "text-cream bg-navy/40 backdrop-blur-md p-3 border border-white/10 shadow-lg"
              )}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
            >
              {/* "MENU" Text slides in only when scrolled into the pill */}
              <AnimatePresence>
                {isScrolled && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-[9px] uppercase tracking-[0.2em] font-semibold mt-0.5 overflow-hidden whitespace-nowrap"
                  >
                    {isMobileMenuOpen ? "Close" : "Menu"}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Elegant 2-line staggered hamburger icon */}
              <motion.div className="flex flex-col items-end justify-center w-5 h-4 gap-1.5 relative">
                <motion.span
                  className="absolute top-[2px] right-0 block h-[1.5px] bg-current rounded-full"
                  variants={{
                    closed: { rotate: 0, y: 0, width: "100%" },
                    open: { rotate: -45, y: 5.5, width: "100%" },
                  }}
                  initial="closed"
                  animate={isMobileMenuOpen ? "open" : "closed"}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                <motion.span
                  className="absolute bottom-[2px] right-0 block h-[1.5px] bg-current rounded-full"
                  variants={{
                    closed: { rotate: 0, y: 0, width: "65%" },
                    open: { rotate: 45, y: -5.5, width: "100%" },
                  }}
                  initial="closed"
                  animate={isMobileMenuOpen ? "open" : "closed"}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.nav>
      </div>

      {/* Mobile Menu - Glass Morphism Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[105] lg:hidden bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-[110] w-80 backdrop-blur-xl bg-navy/95 border-l border-gold/20 shadow-2xl flex flex-col overflow-y-auto"
            >
              <div className="sticky top-0 p-6 border-b border-gold/20 bg-navy/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-cream">Menu</div>
                    <div className="text-xs text-gold uppercase tracking-widest">Navigation</div>
                  </div>
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                  >
                    <svg className="w-5 h-5 text-cream" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

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
                        pathname === link.href ? "text-gold bg-gold/10" : "text-cream/80 hover:text-cream hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-gold"
                          animate={pathname === link.href ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                        />
                        <span>{link.label}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

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
function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean; isScrolled: boolean; }) {
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
      <motion.div
        className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-gold/0 via-gold to-gold/0 rounded-full"
        animate={{ scaleX: isActive || isHovered ? 1 : 0, opacity: isActive || isHovered ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 35, duration: 0.3 }}
      />
    </Link>
  );
}