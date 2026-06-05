// ============================================================
// EMAIL UTILITY FOR PLI PORTAL
// Currently in DEMO MODE - logs emails to console
// To enable real emails, ask IT team to provide SMTP details
// and update .env.local with:
//   SMTP_HOST=smtp.office365.com
//   SMTP_PORT=587
//   SMTP_USER=pli-noreply@varroc.com
//   SMTP_PASS=your-email-password
//   SMTP_FROM=PLI Portal <pli-noreply@varroc.com>
// Then set EMAIL_ENABLED=true in .env.local
// ============================================================

const EMAIL_ENABLED = process.env.EMAIL_ENABLED === 'true';

async function sendEmail({ to, cc, subject, html }) {
  if (!EMAIL_ENABLED) {
    console.log('=== EMAIL (DEMO MODE) ===');
    console.log('To:', to);
    console.log('CC:', cc || 'none');
    console.log('Subject:', subject);
    console.log('Body preview:', html.substring(0, 200));
    console.log('=========================');
    return { success: true, demo: true };
  }

  // REAL EMAIL - uncomment when IT provides SMTP details
  // Uses nodemailer - add "nodemailer": "^6.9.8" to package.json
  // const nodemailer = require('nodemailer');
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: parseInt(process.env.SMTP_PORT),
  //   secure: false,
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASS,
  //   },
  // });
  // await transporter.sendMail({
  //   from: process.env.SMTP_FROM,
  //   to,
  //   cc,
  //   subject,
  //   html,
  // });
  // return { success: true };

  return { success: true, demo: true };
}

// --- EMAIL TEMPLATES ---

export async function sendPLICreatedEmail({ vendorEmail, vendorName, buyerEmail, buyerName, pliName, requestId, itemCount }) {
  return sendEmail({
    to: vendorEmail,
    cc: buyerEmail,
    subject: `PLI Request Created - ${pliName} (${requestId})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #1746b6;">New PLI Request</h2>
        <p>Dear ${vendorName},</p>
        <p>A new PLI request has been created and assigned to you. Please review and submit the required documents.</p>
        <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
          <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">PLI Name</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${pliName}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Request ID</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${requestId}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">No. of Items</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${itemCount}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Category Manager</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${buyerName}</td></tr>
        </table>
        <p>Please login to the PLI Portal to view details and submit your signed document.</p>
        <p style="color: #64748b; font-size: 12px;">This is an automated email from PLI Portal. Do not reply.</p>
      </div>
    `,
  });
}

export async function sendRateEditedEmail({ vendorEmail, vendorName, buyerEmail, buyerName, pliName, requestId }) {
  return sendEmail({
    to: vendorEmail,
    cc: buyerEmail,
    subject: `PLI Effective Rate Updated - ${pliName} (${requestId})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #1746b6;">Effective Rate Updated</h2>
        <p>Dear ${vendorName},</p>
        <p>The effective rate for PLI request <strong>${requestId}</strong> (${pliName}) has been updated by ${buyerName}.</p>
        <p>Please login to the PLI Portal to review the updated rates and submit your signed document.</p>
        <p style="color: #64748b; font-size: 12px;">This is an automated email from PLI Portal. Do not reply.</p>
      </div>
    `,
  });
}

export async function sendApprovalEmail({ vendorEmail, vendorName, pliName, requestId, comment }) {
  return sendEmail({
    to: vendorEmail,
    subject: `PLI Request Approved - ${pliName} (${requestId})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #22c55e;">PLI Request Approved</h2>
        <p>Dear ${vendorName},</p>
        <p>Your submission for PLI request <strong>${requestId}</strong> (${pliName}) has been <strong style="color: #22c55e;">approved</strong>.</p>
        ${comment ? `<p><strong>Comments:</strong> ${comment}</p>` : ''}
        <p style="color: #64748b; font-size: 12px;">This is an automated email from PLI Portal. Do not reply.</p>
      </div>
    `,
  });
}

export async function sendRejectionEmail({ vendorEmail, vendorName, pliName, requestId, comment }) {
  return sendEmail({
    to: vendorEmail,
    subject: `PLI Request Rejected - ${pliName} (${requestId})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #ef4444;">PLI Request Rejected</h2>
        <p>Dear ${vendorName},</p>
        <p>Your submission for PLI request <strong>${requestId}</strong> (${pliName}) has been <strong style="color: #ef4444;">rejected</strong>.</p>
        ${comment ? `<p><strong>Reason:</strong> ${comment}</p>` : ''}
        <p>Please login to the PLI Portal to review the comments and resubmit the required documents.</p>
        <p style="color: #64748b; font-size: 12px;">This is an automated email from PLI Portal. Do not reply.</p>
      </div>
    `,
  });
}

export async function sendVendorSubmissionEmail({ buyerEmail, buyerName, vendorName, pliName, requestId }) {
  return sendEmail({
    to: buyerEmail,
    subject: `Vendor Submission Received - ${pliName} (${requestId})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #1746b6;">Vendor Submission Received</h2>
        <p>Dear ${buyerName},</p>
        <p>${vendorName} has submitted the signed document for PLI request <strong>${requestId}</strong> (${pliName}).</p>
        <p>Please login to the PLI Portal to review and approve/reject the submission.</p>
        <p style="color: #64748b; font-size: 12px;">This is an automated email from PLI Portal. Do not reply.</p>
      </div>
    `,
  });
}

export async function sendCancellationEmail({ vendorEmail, vendorName, pliName, requestId, comment }) {
  return sendEmail({
    to: vendorEmail,
    subject: `PLI Request Cancelled - ${pliName} (${requestId})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #3b82f6;">PLI Request Cancelled</h2>
        <p>Dear ${vendorName},</p>
        <p>PLI request <strong>${requestId}</strong> (${pliName}) has been cancelled by the buyer.</p>
        ${comment ? `<p><strong>Reason:</strong> ${comment}</p>` : ''}
        <p style="color: #64748b; font-size: 12px;">This is an automated email from PLI Portal. Do not reply.</p>
      </div>
    `,
  });
}
