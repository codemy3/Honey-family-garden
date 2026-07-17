"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";
import { gsap } from "gsap";
import MagneticButton from "@/components/MagneticButton";
import StarRating from "@/components/StarRating";
import clsx from "clsx";

interface FormState {
  name: string;
  email: string;
  rating: number;
  comment: string;
  eventType: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  rating?: string;
  comment?: string;
}

export default function ReviewForm({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    rating: 0,
    comment: "",
    eventType: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const validateField = (name: string, value: string | number): string | undefined => {
    switch (name) {
      case "name":
        if (!value || (typeof value === "string" && value.length < 3))
          return "Min 3 characters";
        break;
      case "email":
        if (!value || !/\S+@\S+\.\S+/.test(value as string))
          return "Invalid email address";
        break;
      case "rating":
        if (!value || value === 0) return "Please select a rating";
        break;
      case "comment":
        if (!value || (typeof value === "string" && value.length < 10))
          return "Min 10 characters";
        if (typeof value === "string" && value.length > 500)
          return "Max 500 characters";
        break;
    }
    return undefined;
  };

  const handleChange = (
    name: string,
    value: string | number
  ) => {
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

  const isFormValid = () => {
    return (
      form.name.length >= 3 &&
      /\S+@\S+\.\S+/.test(form.email) &&
      form.rating > 0 &&
      form.comment.length >= 10 &&
      form.comment.length <= 500
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    (["name", "email", "rating", "comment"] as const).forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ name: true, email: true, rating: true, comment: true });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          approved: false,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      // Custom GSAP gold/navy particle burst
      const triggerConfetti = () => {
        const colors = ["#D4AF37", "#102E4A", "#FFF7E6", "#8BA89B"];
        const container = document.body;
        const total = 45;

        for (let i = 0; i < total; i++) {
          const p = document.createElement("div");
          p.className = "fixed pointer-events-none z-[120] rounded-full";
          const size = gsap.utils.random(6, 12);
          p.style.width = `${size}px`;
          p.style.height = `${size}px`;
          p.style.backgroundColor = gsap.utils.random(colors);
          
          // Spawn center
          const startX = window.innerWidth / 2;
          const startY = window.innerHeight * 0.45;
          p.style.left = `${startX}px`;
          p.style.top = `${startY}px`;
          container.appendChild(p);

          const angle = gsap.utils.random(0, Math.PI * 2);
          const velocity = gsap.utils.random(150, 320);
          const destX = Math.cos(angle) * velocity;
          const destY = Math.sin(angle) * velocity - 100; // float upwards initially

          gsap.to(p, {
            x: destX,
            y: destY + 300, // fall downwards with gravity effect
            opacity: 0,
            scale: 0.4,
            duration: gsap.utils.random(1.4, 2.0),
            ease: "power2.out",
            onComplete: () => p.remove(),
          });
        }
      };

      triggerConfetti();

      toast.success("Thank you! Your review will be published after approval.");
      setForm({ name: "", email: "", rating: 0, comment: "", eventType: "" });
      setErrors({});
      setTouched({});
      onSubmitSuccess?.();
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldStatus = (name: string) => {
    if (!touched[name]) return null;
    if (errors[name as keyof FormErrors]) return "error";
    return "valid";
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-cream rounded-xl p-6 md:p-8 max-w-xl mx-auto shadow-sm">
        <h3 className="font-display font-bold text-2xl text-navy mb-2 text-center">
          Share Your Experience
        </h3>
        <p className="text-charcoal/60 text-sm text-center mb-6">
          Your feedback helps others discover Honey Garden
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-navy text-sm font-semibold mb-1.5">
              Your Name *
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="Your name"
                className={clsx(
                  "w-full px-4 py-3 rounded-md border text-sm bg-white transition-all duration-200 outline-none",
                  getFieldStatus("name") === "error"
                    ? "border-error"
                    : getFieldStatus("name") === "valid"
                    ? "border-success/40"
                    : "border-lightgrey",
                  "focus:border-gold focus:ring-2 focus:ring-gold/10"
                )}
              />
              {getFieldStatus("name") === "valid" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-success text-sm">✓</span>
              )}
              {getFieldStatus("name") === "error" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-error text-sm">✕</span>
              )}
            </div>
            {errors.name && touched.name && (
              <p className="text-error text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-navy text-sm font-semibold mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="your@email.com"
                className={clsx(
                  "w-full px-4 py-3 rounded-md border text-sm bg-white transition-all duration-200 outline-none",
                  getFieldStatus("email") === "error"
                    ? "border-error"
                    : getFieldStatus("email") === "valid"
                    ? "border-success/40"
                    : "border-lightgrey",
                  "focus:border-gold focus:ring-2 focus:ring-gold/10"
                )}
              />
              {getFieldStatus("email") === "valid" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-success text-sm">✓</span>
              )}
              {getFieldStatus("email") === "error" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-error text-sm">✕</span>
              )}
            </div>
            {errors.email && touched.email && (
              <p className="text-error text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-navy text-sm font-semibold mb-1.5">
              Rating *
            </label>
            <StarRating
              value={form.rating}
              onChange={(rating) => {
                handleChange("rating", rating);
                setTouched((prev) => ({ ...prev, rating: true }));
              }}
              error={touched.rating ? errors.rating : undefined}
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-navy text-sm font-semibold mb-1.5">
              Your Experience *
            </label>
            <div className="relative">
              <textarea
                name="comment"
                value={form.comment}
                onChange={(e) => handleChange("comment", e.target.value)}
                onBlur={() => handleBlur("comment")}
                placeholder="Share your experience... (min 10 chars)"
                rows={4}
                className={clsx(
                  "w-full px-4 py-3 rounded-md border text-sm bg-white transition-all duration-200 outline-none resize-none",
                  getFieldStatus("comment") === "error"
                    ? "border-error"
                    : getFieldStatus("comment") === "valid"
                    ? "border-success/40"
                    : "border-lightgrey",
                  "focus:border-gold focus:ring-2 focus:ring-gold/10"
                )}
              />
              <span className="absolute bottom-2 right-3 text-charcoal/40 text-xs">
                {form.comment.length}/500
              </span>
            </div>
            {errors.comment && touched.comment && (
              <p className="text-error text-xs mt-1">{errors.comment}</p>
            )}
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-navy text-sm font-semibold mb-1.5">
              Event Type
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
              <option value="birthday">Birthday</option>
            </select>
          </div>

          {/* Submit */}
          <MagneticButton className="w-full">
            <motion.button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              whileHover={isFormValid() && !isSubmitting ? { scale: 1.02 } : {}}
              whileTap={isFormValid() && !isSubmitting ? { scale: 0.98 } : {}}
              className={clsx(
                "w-full py-3 rounded-md text-sm font-semibold transition-all duration-200",
                isFormValid() && !isSubmitting
                  ? "bg-navy text-cream hover:bg-navy-light shadow-md hover:shadow-lg cursor-pointer"
                  : "bg-charcoal/30 text-charcoal/50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Review"
              )}
            </motion.button>
          </MagneticButton>
        </form>
      </div>
    </motion.div>
  );
}
