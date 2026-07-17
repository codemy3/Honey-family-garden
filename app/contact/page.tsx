import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact — Get in Touch",
  description:
    "Contact Honey Family Garden Restaurant for event bookings, enquiries, and venue tours. Located in Shimoga, Karnataka. Call us or fill out our enquiry form.",
};

export default function ContactPage() {
  return <ContactContent />;
}
