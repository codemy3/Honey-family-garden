// Review type definition (replaces old @/lib/validation)
export interface Review {
  id: string;
  name: string;
  email?: string;
  rating: number;
  comment: string;
  eventType?: string;
  approved?: boolean;
  createdAt: string;
}

// Enquiry type definition
export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventDate?: string;
  guestCount?: number;
  eventType?: string;
  message?: string;
  status: "new" | "contacted" | "booked" | "archived";
  createdAt: string;
}
