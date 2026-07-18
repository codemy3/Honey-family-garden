import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch approved reviews from Sanity
    const query = `*[_type == "review" && isApproved == true] | order(createdAt desc) {
      _id,
      name,
      rating,
      eventType,
      comment,
      createdAt
    }`;
    
    const reviews = await client.fetch(query);
    
    // Map to frontend expected format
    const formattedReviews = reviews.map((r: any) => ({
      id: r._id,
      name: r.name,
      rating: r.rating,
      eventType: r.eventType,
      comment: r.comment,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({ reviews: formattedReviews });
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Create a new review document in Sanity (Requires SANITY_API_TOKEN)
    const token = process.env.SANITY_API_TOKEN;
    if (!token) {
      console.warn("No SANITY_API_TOKEN found! Submitting a mock response for now.");
      return NextResponse.json(
        { message: "Simulated submission because API token is missing", review: body },
        { status: 201 }
      );
    }

    const writeClient = client.withConfig({ token });

    const newReview = await writeClient.create({
      _type: "review",
      name: body.name,
      rating: body.rating,
      eventType: body.eventType,
      comment: body.comment,
      isApproved: false, // Default to false so the owner must approve it
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Review submitted successfully as draft", review: newReview },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sanity Submit Error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
