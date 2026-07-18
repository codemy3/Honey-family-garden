import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch ONLY published reviews from Sanity (Drafts are excluded automatically by the unauthenticated client)
    const query = `*[_type == "review"] | order(createdAt desc) {
      _id,
      name,
      rating,
      eventType,
      comment,
      "images": images[].asset->url,
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
      images: r.images || [],
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
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const rating = Number(formData.get("rating") || 5);
    const comment = formData.get("comment") as string;
    const eventType = formData.get("eventType") as string;
    
    // Get all uploaded files
    const files = formData.getAll("images") as File[];

    // Create a new review document in Sanity (Requires SANITY_API_TOKEN)
    const token = process.env.SANITY_API_TOKEN;
    if (!token) {
      console.warn("No SANITY_API_TOKEN found! Submitting a mock response for now.");
      return NextResponse.json(
        { message: "Simulated submission because API token is missing", review: { name, email, phone, rating, comment } },
        { status: 201 }
      );
    }

    const writeClient = client.withConfig({ token });

    // Upload images if any
    const imageReferences = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const asset = await writeClient.assets.upload('image', buffer, {
        filename: file.name,
      });
      imageReferences.push({
        _key: crypto.randomUUID(),
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      });
    }

    const newReview = await writeClient.create({
      _type: "review",
      _id: `drafts.${crypto.randomUUID()}`, // Native Sanity Draft
      name,
      email,
      phone,
      rating,
      eventType,
      comment,
      images: imageReferences.length > 0 ? imageReferences : undefined,
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
