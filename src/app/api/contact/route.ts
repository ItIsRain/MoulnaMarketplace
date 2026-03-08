import { createAdminClient } from "@/lib/supabase/admin";
import { resend, FROM_EMAIL } from "@/lib/email/resend";
import { NextRequest, NextResponse } from "next/server";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, department, message } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { error: "Subject is required" },
        { status: 400 }
      );
    }
    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Try to insert into contact_submissions table
    const { error: dbError } = await admin
      .from("contact_submissions")
      .insert({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        department: department || "general",
        message: message.trim(),
      });

    if (dbError) {
      // Table might not exist — fallback to sending email via Resend
      console.warn(
        "contact_submissions insert failed, falling back to email:",
        dbError.message
      );

      const { error: emailError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: "support@moulna.ae",
        subject: `[Contact Form] ${escapeHtml(subject.trim())}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
          <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
          <p><strong>Department:</strong> ${escapeHtml(department || "general")}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject.trim())}</p>
          <hr />
          <p>${escapeHtml(message.trim()).replace(/\n/g, "<br />")}</p>
        `,
        replyTo: email.trim(),
      });

      if (emailError) {
        console.error("Failed to send contact email:", emailError);
        return NextResponse.json(
          { error: "Failed to submit your message. Please try again later." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ message: "Message sent successfully" });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
