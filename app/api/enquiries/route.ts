import { NextRequest, NextResponse } from "next/server";
import { Enquiry } from "@/lib/validation";
import { sendEnquiryNotification } from "@/lib/email";

// In-memory store (replace with Firebase/Supabase in production)
const enquiries: Enquiry[] = [];

export async function GET() {
  const sorted = [...enquiries].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({ enquiries: sorted });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newEnquiry: Enquiry = {
      id: `e${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      eventDate: body.eventDate,
      guestCount: parseInt(body.guestCount),
      eventType: body.eventType || undefined,
      message: body.message || undefined,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    enquiries.push(newEnquiry);

    // Send email notification to admin
    await sendEnquiryNotification(newEnquiry);

    return NextResponse.json(
      { message: "Enquiry submitted successfully", enquiry: newEnquiry },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
