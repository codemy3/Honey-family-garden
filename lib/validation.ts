import { z } from "zod";

export const reviewSchema = z.object({
  name: z
    .string()
    .min(3, "Min 3 characters")
    .max(50, "Max 50 characters"),
  email: z.string().email("Invalid email address"),
  rating: z
    .number()
    .min(1, "Please select a rating")
    .max(5, "Rating must be 1-5"),
  comment: z
    .string()
    .min(10, "Min 10 characters")
    .max(500, "Max 500 characters"),
  eventType: z.string().optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

export const enquirySchema = z.object({
  name: z
    .string()
    .min(3, "Min 3 characters")
    .max(50, "Max 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(
      /^(\+91|0)?[6-9]\d{9}$/,
      "Invalid phone number"
    ),
  eventDate: z.string().refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    { message: "Please select a future date" }
  ),
  guestCount: z
    .number()
    .min(10, "Guest count must be between 10-500")
    .max(500, "Guest count must be between 10-500"),
  eventType: z.string().optional(),
  message: z.string().max(500, "Max 500 characters").optional(),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;

// Mock review type
export interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  eventType?: string;
  approved: boolean;
  createdAt: string;
}

// Mock enquiry type
export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: number;
  eventType?: string;
  message?: string;
  status: "new" | "contacted" | "booked" | "archived";
  createdAt: string;
  notes?: string;
}
