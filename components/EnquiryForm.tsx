"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";
import clsx from "clsx";
import MagneticButton from "@/components/MagneticButton";

interface FormState {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  eventType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  eventDate?: string;
  guestCount?: string;
}

function HexMark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" strokeLinejoin="round" />
    </svg>
  );
}

export default function EnquiryForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    guestCount: "80", // default starting guest count
    eventType: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const today = new Date().toISOString().split("T")[0];

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (!value || value.length < 3) return "Name must be at least 3 characters";
        break;
      case "email":
        if (!value || !/\S+@\S+\.\S+/.test(value)) return "Invalid email address";
        break;
      case "phone":
        if (!value || !/^(\+91|0)?[6-9]\d{9}$/.test(value.replace(/\s/g, "")))
          return "Invalid phone number";
        break;
      case "eventDate":
        if (!value) return "Please select a date";
        if (new Date(value) < new Date(today)) return "Please select a future date";
        break;
      case "guestCount": {
        const num = parseInt(value);
        if (!value || isNaN(num) || num < 10 || num > 500)
          return "Guest count must be between 10-500";
        break;
      }
    }
    return undefined;
  };

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, form[name as keyof FormState]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Step validation check
  const isStepValid = (stepNumber: number) => {
    if (stepNumber === 1) {
      return (
        form.name.length >= 3 &&
        !validateField("email", form.email) &&
        !validateField("phone", form.phone)
      );
    }
    if (stepNumber === 2) {
      return form.eventDate && new Date(form.eventDate) >= new Date(today);
    }
    return true; // Step 3 checks final validity on submit
  };

  const isFormValid = () => {
    return (
      isStepValid(1) &&
      isStepValid(2) &&
      parseInt(form.guestCount) >= 10 &&
      parseInt(form.guestCount) <= 500
    );
  };

  // Live Recommendation Calculator
  const getRecommendation = () => {
    const guests = parseInt(form.guestCount) || 0;
    if (guests <= 60) {
      return {
        hall: "Private AC Hall Recommended",
        detail: "❄️ Fully climate-controlled intimate comfort.",
        badgeColor: "bg-navy text-cream border border-gold/20",
      };
    }
    if (guests > 60 && guests < 150) {
      return {
        hall: "Both Venues Recommended",
        detail: "✨ Custom setups combining AC Hall and Open Garden.",
        badgeColor: "bg-[#FFF7E6] text-navy border border-gold/30",
      };
    }
    return {
      hall: "Open Botanical Garden Recommended",
      detail: "🌿 Lush evening celebrations under string lights.",
      badgeColor: "bg-[#4B5D3A]/10 text-[#4B5D3A] border border-[#4B5D3A]/25",
    };
  };

  const rec = getRecommendation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      toast.success("Enquiry sent! We'll contact you within 24 hours.");
      setForm({
        name: "",
        email: "",
        phone: "",
        eventDate: "",
        guestCount: "80",
        eventType: "",
        message: "",
      });
      setErrors({});
      setTouched({});
      setStep(1);
    } catch {
      toast.error("Failed to send enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatus = (name: string) => {
    if (!touched[name]) return null;
    if (errors[name as keyof FormErrors]) return "error";
    return "valid";
  };

  const inputClasses = (name: string) =>
    clsx(
      "w-full px-4 py-3 rounded-md border text-sm bg-white transition-all duration-200 outline-none text-charcoal",
      getStatus(name) === "error"
        ? "border-error"
        : getStatus(name) === "valid"
        ? "border-success/40"
        : "border-lightgrey",
      "focus:border-gold focus:ring-2 focus:ring-gold/10"
    );

  // Dynamic step transitions (Exit triggers slide up; next step enters from bottom)
  const stepVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
    exit: { opacity: 0, y: -45, transition: { duration: 0.35, ease: "easeIn" } },
  } as const;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-cream rounded-2xl p-6 md:p-10 max-w-xl mx-auto shadow-md border border-gold/10">
        
        {/* Step Indicator Header (HexMark Marks) */}
        <div className="flex items-center justify-between mb-8 border-b border-lightgrey pb-5">
          <div>
            <h3 className="font-display font-bold text-2xl text-navy">
              Event Enquiry
            </h3>
            <p className="text-charcoal/50 text-xs mt-1">
              Step {step} of 3 — Complete details
            </p>
          </div>
          
          {/* Hexagon Mark progress bar indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={clsx(
                  "transition-all duration-300",
                  step >= s ? "text-gold" : "text-gold/20"
                )}
              >
                <HexMark />
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Contact Details */}
            {step === 1 && (
              <motion.div
                key="step-1"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5"
              >
                <div>
                  <label className="block text-navy text-sm font-semibold mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    placeholder="Your full name"
                    className={inputClasses("name")}
                  />
                  {errors.name && touched.name && (
                    <p className="text-error text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-navy text-sm font-semibold mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="your@email.com"
                    className={inputClasses("email")}
                  />
                  {errors.email && touched.email && (
                    <p className="text-error text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-navy text-sm font-semibold mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    placeholder="+91 9XXXXXXXXX"
                    className={inputClasses("phone")}
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-error text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={!isStepValid(1)}
                    onClick={() => setStep(2)}
                    className={clsx(
                      "px-8 py-3.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300",
                      isStepValid(1)
                        ? "bg-navy text-cream hover:bg-navy-light cursor-pointer shadow-md"
                        : "bg-charcoal/30 text-charcoal/50 cursor-not-allowed"
                    )}
                  >
                    Next Step →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Event Details */}
            {step === 2 && (
              <motion.div
                key="step-2"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5"
              >
                <div>
                  <label className="block text-navy text-sm font-semibold mb-1.5">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={form.eventDate}
                    min={today}
                    onChange={(e) => handleChange("eventDate", e.target.value)}
                    onBlur={() => handleBlur("eventDate")}
                    className={inputClasses("eventDate")}
                  />
                  {errors.eventDate && touched.eventDate && (
                    <p className="text-error text-xs mt-1">{errors.eventDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-navy text-sm font-semibold mb-1.5">
                    Type of Event
                  </label>
                  <select
                    name="eventType"
                    value={form.eventType}
                    onChange={(e) => handleChange("eventType", e.target.value)}
                    className="w-full px-4 py-3 rounded-md border border-lightgrey text-sm bg-white transition-all duration-200 outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 text-charcoal"
                  >
                    <option value="">Select event type (optional)</option>
                    <option value="wedding">Wedding</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="family">Family Function</option>
                    <option value="birthday">Birthday Party</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-lightgrey text-navy text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-white/50 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    disabled={!isStepValid(2)}
                    onClick={() => setStep(3)}
                    className={clsx(
                      "px-8 py-3.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300",
                      isStepValid(2)
                        ? "bg-navy text-cream hover:bg-navy-light cursor-pointer shadow-md"
                        : "bg-charcoal/30 text-charcoal/50 cursor-not-allowed"
                    )}
                  >
                    Next Step →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Space & Customization */}
            {step === 3 && (
              <motion.div
                key="step-3"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                {/* Guest Count Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-navy text-sm font-semibold">
                      Approximate Guest Count:
                    </label>
                    <span className="text-gold-dark font-bold text-base bg-gold/10 px-3 py-1 rounded-lg">
                      👥 {form.guestCount} Guests
                    </span>
                  </div>
                  <input
                    type="range"
                    name="guestCount"
                    min="10"
                    max="500"
                    step="5"
                    value={form.guestCount}
                    onChange={(e) => handleChange("guestCount", e.target.value)}
                    className="w-full h-2 bg-lightgrey rounded-lg appearance-none cursor-pointer accent-gold"
                  />
                  <div className="flex justify-between text-[10px] text-charcoal/40 mt-1.5 font-medium">
                    <span>10 guests</span>
                    <span>250 guests</span>
                    <span>500 guests</span>
                  </div>
                </div>

                {/* Live Recommendation Card */}
                <motion.div
                  key={rec.hall}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={clsx("rounded-xl p-4 transition-all duration-300 shadow-sm", rec.badgeColor)}
                >
                  <h4 className="font-display font-bold text-sm tracking-wide mb-1">
                    {rec.hall}
                  </h4>
                  <p className="text-xs opacity-80">
                    {rec.detail}
                  </p>
                </motion.div>

                {/* Message */}
                <div>
                  <label className="block text-navy text-sm font-semibold mb-1.5">
                    Tell us more about your event
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Share details about layout preferences, catering requests, etc. (optional)"
                      rows={3}
                      maxLength={500}
                      className="w-full px-4 py-3 rounded-md border border-lightgrey text-sm bg-white transition-all duration-200 outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 resize-none text-charcoal"
                    />
                    <span className="absolute bottom-2 right-3 text-charcoal/40 text-[10px]">
                      {form.message.length}/500
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border border-lightgrey text-navy text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-white/50 transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                  <MagneticButton>
                    <button
                      type="submit"
                      disabled={!isFormValid() || isSubmitting}
                      className={clsx(
                        "px-8 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 min-w-[180px]",
                        isFormValid() && !isSubmitting
                          ? "bg-[#331E14] text-cream hover:bg-[#4d2d1e] cursor-pointer shadow-md hover:shadow-lg"
                          : "bg-charcoal/30 text-charcoal/50 cursor-not-allowed"
                      )}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        "Send Enquiry"
                      )}
                    </button>
                  </MagneticButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </motion.div>
  );
}
