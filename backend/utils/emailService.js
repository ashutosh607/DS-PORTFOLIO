const nodemailer = require("nodemailer");

/**
 * Sends automated commission inquiry email directly to the studio admin
 */
async function sendInquiryEmail(inquiryData) {
  const recipient = process.env.STUDIO_RECIPIENT_EMAIL || process.env.EMAIL_USER;
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS; // 16-character Google App Password

  if (!emailPass || !emailUser || !recipient) {
    console.warn(
      "⚠️ [Email Service] EMAIL_USER, EMAIL_PASS, or STUDIO_RECIPIENT_EMAIL is not fully configured in environment variables. Email notification skipped."
    );
    return {
      sent: false,
      reason: "Missing email credentials in environment variables",
    };
  }

  // Create Nodemailer Transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass.replace(/\s+/g, ""), // strip any spaces
    },
  });

  const {
    inquiryId,
    name,
    email,
    phone,
    eventType,
    eventDate,
    duration,
    location,
    collectionTitle,
    disciplines,
    budget,
    message,
    source,
    channel,
  } = inquiryData;

  const disciplinesFormatted =
    Array.isArray(disciplines) && disciplines.length > 0
      ? disciplines.map((d) => `<li>${d}</li>`).join("")
      : "<li>Standard Collection Deliverables</li>";

  const mailOptions = {
    from: `"DS Photography & Films" <${emailUser}>`,
    to: recipient,
    replyTo: email,
    subject: `New Commission Inquiry: ${name} — ${eventType} (${collectionTitle || "Signature"})`,
    text: `
NEW COMMISSION INQUIRY RECEIVED
Ref ID: ${inquiryId || "N/A"}
Channel: ${channel ? channel.toUpperCase() : "EMAIL"}

CLIENT DETAILS:
- Name: ${name}
- Email: ${email}
- Phone: ${phone || "Not provided"}

EVENT DETAILS:
- Event: ${eventType}
- Target Date: ${eventDate || "Not provided"}
- Duration: ${duration || "Not provided"}
- Location: ${location || "Not provided"}

COLLECTION:
- Collection: ${collectionTitle || "Signature"}
- Budget: ${budget || "Not provided"}

VISION & NOTES:
${message || "No additional notes provided"}

Found Us Through: ${source || "Website"}
    `,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F5; border: 1px solid #E5DCD0; border-radius: 12px; overflow: hidden; color: #1E1B18;">
        <div style="background-color: #101010; color: #FDFCF8; padding: 24px 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500;">DS Photography & Films</h1>
          <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #CBB9A4;">Atelier Commission Notification</p>
        </div>

        <div style="padding: 32px;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #E3D9CA; padding-bottom: 12px; margin-bottom: 20px; font-size: 12px; color: #7A6E5D;">
            <span>REFERENCE: <strong>${inquiryId || "N/A"}</strong></span>
            <span>CHANNEL: <strong>${(channel || "EMAIL").toUpperCase()}</strong></span>
          </div>

          <h2 style="font-size: 16px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.08em; color: #101010;">Client Information</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #7A6E5D; width: 120px;">Name:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #101010;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #7A6E5D;">Email:</td>
              <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #9E8159; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #7A6E5D;">Phone / WA:</td>
              <td style="padding: 6px 0; color: #101010;">${phone || "Not provided"}</td>
            </tr>
          </table>

          <h2 style="font-size: 16px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.08em; color: #101010;">Event Specifications</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #7A6E5D; width: 120px;">Event Type:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #101010;">${eventType}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #7A6E5D;">Target Date:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #101010;">${eventDate || "TBD"}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #7A6E5D;">Duration:</td>
              <td style="padding: 6px 0; color: #101010;">${duration || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #7A6E5D;">Location:</td>
              <td style="padding: 6px 0; color: #101010;">${location || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #7A6E5D;">Collection:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #101010;">${collectionTitle || "Signature"}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #7A6E5D;">Budget:</td>
              <td style="padding: 6px 0; color: #101010;">${budget || "Not provided"}</td>
            </tr>
          </table>

          <h2 style="font-size: 16px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.08em; color: #101010;">Client Vision & Notes</h2>
          <div style="background-color: #FFFFFF; border: 1px solid #E3D9CA; border-radius: 8px; padding: 16px; font-size: 13.5px; line-height: 1.6; color: #333333; margin-bottom: 24px;">
            ${message ? message.replace(/\n/g, "<br/>") : "<em>No additional vision notes entered.</em>"}
          </div>

          <div style="text-align: center; margin-top: 28px;">
            <a href="mailto:${email}?subject=Regarding Your Commission Inquiry with DS Photography" style="display: inline-block; background-color: #101010; color: #FDFCF8; padding: 12px 28px; border-radius: 999px; text-decoration: none; font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;">
              Reply Directly to Client
            </a>
          </div>
        </div>

        <div style="background-color: #EFE8DA; padding: 16px; text-align: center; font-size: 11px; color: #8A7E6F; border-top: 1px solid #E3D9CA;">
          DS Photography & Films · Automated Inquiry Notification Dispatch
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Email Service] Inquiry email dispatched successfully! MessageId: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ [Email Service] Failed to send email via SMTP:", error.message);
    return { sent: false, error: error.message };
  }
}

module.exports = { sendInquiryEmail };
