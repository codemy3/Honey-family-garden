import type { Metadata } from "next";
import ReviewsContent from "./ReviewsContent";

export const metadata: Metadata = {
  title: "Reviews — Guest Reviews & Testimonials",
  description:
    "Read genuine guest reviews and share your experience at Honey Family Garden Restaurant. See what others say about our venue, catering, and event services in Shimoga.",
};

export default function ReviewsPage() {
  return <ReviewsContent />;
}
