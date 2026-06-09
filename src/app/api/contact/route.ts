import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, projectType, budgetRange, message } = body;

    // Validate request fields
    if (!name || !email || !phone || !projectType || !budgetRange || !message) {
      return NextResponse.json(
        { error: "Missing required fields in submission." },
        { status: 400 }
      );
    }

    // Format HTML email body for lead notification
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; color: #0F172A; line-height: 1.5; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #0F172A; padding: 24px; text-align: center;">
          <h2 style="color: #FFFFFF; margin: 0; font-size: 20px; letter-spacing: 0.05em; font-weight: 800;">FIFTH ORBIT</h2>
          <p style="color: #0A84FF; margin: 4px 0 0 0; font-size: 11px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase;">New Proposal Request Received</p>
        </div>
        
        <div style="padding: 24px; background-color: #FFFFFF;">
          <p style="margin-top: 0; font-size: 14px; color: #475569;">A new prospect has submitted the inquiry form on the Fifth Orbit website.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
            <tr style="border-bottom: 1px solid #F1F5F9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569; width: 140px;">Contact Name</td>
              <td style="padding: 10px 0; color: #0F172A;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F1F5F9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Company Name</td>
              <td style="padding: 10px 0; color: #0F172A;">${company || "Individual / None"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F1F5F9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Email Address</td>
              <td style="padding: 10px 0; color: #0F172A;"><a href="mailto:${email}" style="color: #0A84FF; text-decoration: none;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #F1F5F9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Phone Number</td>
              <td style="padding: 10px 0; color: #0F172A;">${phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F1F5F9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Project Type</td>
              <td style="padding: 10px 0; color: #0F172A; font-weight: 600;">${projectType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F1F5F9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Budget Range</td>
              <td style="padding: 10px 0; color: #10B981; font-weight: 600;">${budgetRange}</td>
            </tr>
          </table>
          
          <div style="margin-top: 24px; padding: 16px; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px;">
            <h4 style="margin-top: 0; margin-bottom: 8px; color: #0F172A; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Project Brief Overview:</h4>
            <p style="white-space: pre-wrap; margin: 0; font-size: 13.5px; color: #334155; line-height: 1.6;">${message}</p>
          </div>
        </div>
        
        <div style="background-color: #F8FAFC; padding: 16px; text-align: center; border-top: 1px solid #E2E8F0;">
          <p style="margin: 0; font-size: 10px; color: #94A3B8;">This email was sent dynamically from the FIFTH ORBIT landing page lead engine.</p>
        </div>
      </div>
    `;

    // Retrieve SMTP variables from runtime environment
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const destinationInbox = "fifthorbitofficial@gmail.com";

    // If SMTP details are configured, attempt real email transmission
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Fifth Orbit Leads" <${smtpUser}>`,
        to: destinationInbox,
        replyTo: email,
        subject: `[Lead Alert] ${projectType} - ${name} (${company || "N/A"})`,
        html: emailHtml,
      });

      console.log(`Contact Lead successfully forwarded to ${destinationInbox}`);
    } else {
      // Local development fallback - print to server logs
      console.log("\n========================================================");
      console.log(`[FORWARDED LEAD] Destination: ${destinationInbox}`);
      console.log(`[CLIENT EMAIL] From: ${email} | Phone: ${phone}`);
      console.log(`[SCOPE] Project: ${projectType} | Budget: ${budgetRange}`);
      console.log(`[BRIEF] ${message}`);
      console.log("========================================================\n");
    }

    return NextResponse.json({ success: true, message: "Proposal request forwarded successfully." });
  } catch (error: any) {
    console.error("Error routing contact request:", error);
    return NextResponse.json(
      { error: "Internal server error. Failed to forward proposal request." },
      { status: 500 }
    );
  }
}
