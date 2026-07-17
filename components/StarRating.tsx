"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  error?: string;
}

export default function StarRating({ value, onChange, error }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            className="text-2xl transition-colors duration-150 focus:outline-none"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <span
              className={
                star <= (hovered || value)
                  ? "text-gold drop-shadow-sm"
                  : "text-lightgrey"
              }
            >
              ★
            </span>
          </motion.button>
        ))}

        {value > 0 && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-2 text-charcoal/60 text-xs"
          >
            {value} star{value > 1 ? "s" : ""} selected
          </motion.span>
        )}
      </div>

      {error && (
        <p className="text-error text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
