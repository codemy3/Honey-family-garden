import { NextRequest, NextResponse } from "next/server";
import { Review } from "@/lib/validation";

// In-memory store (replace with Firebase/Supabase in production)
const reviews: Review[] = [
  {
    id: "r1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    rating: 5,
    comment:
      "Absolutely wonderful venue! The garden was perfect for our wedding reception. The catering was excellent and the staff made our special day unforgettable. Highly recommend Honey Garden!",
    eventType: "wedding",
    approved: true,
    createdAt: "2024-10-15T10:30:00Z",
  },
  {
    id: "r2",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    rating: 5,
    comment:
      "We hosted our annual corporate retreat here and it was fantastic. The AC hall was comfortable, the food was delicious, and the team was incredibly professional.",
    eventType: "corporate",
    approved: true,
    createdAt: "2024-10-08T14:00:00Z",
  },
  {
    id: "r3",
    name: "Priya Sharma",
    email: "priya@example.com",
    rating: 4,
    comment:
      "Beautiful garden setting for my daughter's birthday party. The decoration team did a wonderful job. Only minor issue was parking during peak hours, but overall a great experience.",
    eventType: "birthday",
    approved: true,
    createdAt: "2024-09-28T09:15:00Z",
  },
  {
    id: "r4",
    name: "Arun Patel",
    email: "arun@example.com",
    rating: 5,
    comment:
      "Our family reunion at Honey Garden was perfect! The open garden accommodated 180 guests comfortably. The multi-cuisine buffet had something for everyone. Will definitely come back!",
    eventType: "family",
    approved: true,
    createdAt: "2024-09-20T11:30:00Z",
  },
  {
    id: "r5",
    name: "Meena Iyer",
    email: "meena@example.com",
    rating: 4,
    comment:
      "Lovely venue with great ambiance. We celebrated our 25th wedding anniversary here. The lighting and decoration were top-notch. The staff was attentive and helpful throughout.",
    eventType: "family",
    approved: true,
    createdAt: "2024-09-15T16:00:00Z",
  },
  {
    id: "r6",
    name: "Vikram Reddy",
    email: "vikram@example.com",
    rating: 5,
    comment:
      "Best venue in Shimoga! Hosted my sister's wedding reception and everything was perfect — from the garden setup to the catering to the guest rooms. A truly premium experience.",
    eventType: "wedding",
    approved: true,
    createdAt: "2024-09-10T12:00:00Z",
  },
];

export async function GET() {
  // Return only approved reviews, sorted by date desc
  const approvedReviews = reviews
    .filter((r) => r.approved)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return NextResponse.json({ reviews: approvedReviews });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newReview: Review = {
      id: `r${Date.now()}`,
      name: body.name,
      email: body.email,
      rating: body.rating,
      comment: body.comment,
      eventType: body.eventType || undefined,
      approved: false,
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);

    return NextResponse.json(
      { message: "Review submitted successfully", review: newReview },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
