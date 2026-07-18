import nodemailer from "nodemailer";
import { Enquiry } from "./validation";

// Ensure environment variables are set
const email = process.env.GMAIL_EMAIL;
const pass = process.env.GMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: pass,
  },
});

export async function sendEnquiryNotification(enquiry: Enquiry) {
  if (!email || !pass) {
    console.warn("Skipping email notification: GMAIL_EMAIL or GMAIL_APP_PASSWORD not set.");
    return;
  }

  const mailOptions = {
    from: `"Honey Family Garden" <${email}>`,
    to: email, // Send to the admin's email
    subject: `New Enquiry from ${enquiry.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #102E4A;">New Event Enquiry</h2>
        <p>You have received a new enquiry through the website.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;">${enquiry.name}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;">${enquiry.email}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;">${enquiry.phone}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;"><strong>Event Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;">${enquiry.eventType || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;"><strong>Event Date:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;">${enquiry.eventDate || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;"><strong>Guests:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;">${enquiry.guestCount || 'Not specified'}</td></tr>
        </table>
        ${enquiry.message ? `
          <div style="margin-top: 20px; background-color: #f9f9f9; padding: 15px; border-radius: 4px;">
            <strong>Message:</strong><br/>
            ${enquiry.message}
          </div>
        ` : ''}
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Enquiry notification email sent!");
  } catch (error) {
    console.error("Error sending enquiry email:", error);
  }
}

export async function sendReviewNotification(review: { name: string; email?: string; phone?: string; rating: number; eventType?: string; comment: string; hasImages: boolean }) {
  if (!email || !pass) {
    console.warn("Skipping email notification: GMAIL_EMAIL or GMAIL_APP_PASSWORD not set.");
    return;
  }

  const mailOptions = {
    from: `"Honey Family Garden" <${email}>`,
    to: email, // Send to the admin's email
    subject: `New ${review.rating}-Star Review Draft!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #102E4A;">New Review Submitted</h2>
        <p>A customer just left a <strong>${review.rating}-star</strong> review!</p>
        <p>It is currently saved as a <strong>Draft</strong>. To publish it to the website, go to your Sanity Studio, open the Drafts, and click "Publish".</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;">${review.name}</td></tr>
          ${review.email ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;">${review.email}</td></tr>` : ''}
          ${review.phone ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;">${review.phone}</td></tr>` : ''}
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;"><strong>Event Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;">${review.eventType || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;"><strong>Has Photos:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;">${review.hasImages ? "Yes 📸" : "No"}</td></tr>
        </table>
        
        <div style="margin-top: 20px; background-color: #f9f9f9; padding: 15px; border-radius: 4px;">
          <strong>Review Comment:</strong><br/>
          ${review.comment}
        </div>
        
        <div style="margin-top: 25px; text-align: center;">
          <a href="https://honey-family-garden.vercel.app/studio" style="background-color: #D4AF37; color: #102E4A; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Open Sanity Studio</a>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Review notification email sent!");
  } catch (error) {
    console.error("Error sending review email:", error);
  }
}
