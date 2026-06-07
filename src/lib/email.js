import nodemailer from 'nodemailer';

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_ENABLED = SMTP_USER && SMTP_PASS;

let transporter = null;
if (EMAIL_ENABLED) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
}

async function sendEmail({ to, cc, subject, html }) {
  if (!EMAIL_ENABLED || !transporter) {
    console.log('=== EMAIL (DEMO MODE) ===');
    console.log('To:', to, '| CC:', cc || 'none');
    console.log('Subject:', subject);
    console.log('=========================');
    return { success: true, demo: true };
  }
  try {
    await transporter.sendMail({
      from: `"VARROC PLI Portal" <${SMTP_USER}>`,
      to: to,
      cc: cc || undefined,
      subject: subject,
      html: html
    });
    console.log('Email sent to:', to);
    return { success: true };
  } catch (err) {
    console.error('Email failed:', err.message);
    return { success: false, error: err.message };
  }
}

export async function sendPLICreatedEmail({ vendorEmail, vendorName, ccEmail, ccName, pliName, requestId, itemCount, buyerName }) {
  return sendEmail({
    to: vendorEmail,
    cc: ccEmail,
    subject: `New PLI Request - ${pliName} (${requestId})`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;"><div style="background:#1746b6;padding:16px 24px;border-radius:8px 8px 0 0;"><h2 style="color:white;margin:0;">VARROC PLI Portal</h2></div><div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;"><p>Dear ${vendorName},</p><p>A new PLI request has been created and assigned to you. Please review and submit the required documents.</p><table style="border-collapse:collapse;width:100%;margin:16px 0;"><tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;background:#f8fafc;">PLI Name</td><td style="padding:8px;border:1px solid #e2e8f0;">${pliName}</td></tr><tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;background:#f8fafc;">Request ID</td><td style="padding:8px;border:1px solid #e2e8f0;">${requestId}</td></tr><tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;background:#f8fafc;">No. of Items</td><td style="padding:8px;border:1px solid #e2e8f0;">${itemCount}</td></tr><tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;background:#f8fafc;">Raised By</td><td style="padding:8px;border:1px solid #e2e8f0;">${buyerName}</td></tr></table><p>Please login to the <strong>PLI Portal</strong> to view details and submit your signed document.</p><hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/><p style="color:#94a3b8;font-size:12px;">This is an automated email from VARROC PLI Portal. Do not reply to this email.</p></div></div>`
  });
}

export async function sendApprovalEmail({ vendorEmail, vendorName, ccEmail, pliName, requestId, comment }) {
  return sendEmail({
    to: vendorEmail,
    cc: ccEmail,
    subject: `PLI Request Approved - ${pliName} (${requestId})`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;"><div style="background:#22c55e;padding:16px 24px;border-radius:8px 8px 0 0;"><h2 style="color:white;margin:0;">PLI Request Approved</h2></div><div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;"><p>Dear ${vendorName},</p><p>Your submission for PLI request <strong>${requestId}</strong> (${pliName}) has been <strong style="color:#22c55e;">approved</strong>.</p>${comment ? `<p><strong>Comments:</strong> ${comment}</p>` : ''}<p>Thank you for your timely submission.</p><hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/><p style="color:#94a3b8;font-size:12px;">This is an automated email from VARROC PLI Portal.</p></div></div>`
  });
}

export async function sendRejectionEmail({ vendorEmail, vendorName, ccEmail, pliName, requestId, comment }) {
  return sendEmail({
    to: vendorEmail,
    cc: ccEmail,
    subject: `PLI Request Rejected - Resubmission Required - ${pliName} (${requestId})`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;"><div style="background:#ef4444;padding:16px 24px;border-radius:8px 8px 0 0;"><h2 style="color:white;margin:0;">PLI Request Rejected</h2></div><div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;"><p>Dear ${vendorName},</p><p>Your submission for PLI request <strong>${requestId}</strong> (${pliName}) has been <strong style="color:#ef4444;">rejected</strong>.</p>${comment ? `<p><strong>Reason:</strong> ${comment}</p>` : ''}<p>Please login to the PLI Portal to review the comments and resubmit the required documents.</p><hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/><p style="color:#94a3b8;font-size:12px;">This is an automated email from VARROC PLI Portal.</p></div></div>`
  });
}

export async function sendCancellationEmail({ vendorEmail, vendorName, ccEmail, pliName, requestId, comment }) {
  return sendEmail({
    to: vendorEmail,
    cc: ccEmail,
    subject: `PLI Request Cancelled - ${pliName} (${requestId})`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;"><div style="background:#3b82f6;padding:16px 24px;border-radius:8px 8px 0 0;"><h2 style="color:white;margin:0;">PLI Request Cancelled</h2></div><div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;"><p>Dear ${vendorName},</p><p>PLI request <strong>${requestId}</strong> (${pliName}) has been cancelled.</p>${comment ? `<p><strong>Reason:</strong> ${comment}</p>` : ''}<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/><p style="color:#94a3b8;font-size:12px;">This is an automated email from VARROC PLI Portal.</p></div></div>`
  });
}

export async function sendVendorSubmissionEmail({ buyerEmail, buyerName, vendorName, pliName, requestId }) {
  return sendEmail({
    to: buyerEmail,
    subject: `Vendor Submission Received - ${pliName} (${requestId})`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;"><div style="background:#8b5cf6;padding:16px 24px;border-radius:8px 8px 0 0;"><h2 style="color:white;margin:0;">Vendor Submission Received</h2></div><div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;"><p>Dear ${buyerName},</p><p><strong>${vendorName}</strong> has submitted the signed document for PLI request <strong>${requestId}</strong> (${pliName}).</p><p>Please login to the PLI Portal to review and approve/reject the submission.</p><hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/><p style="color:#94a3b8;font-size:12px;">This is an automated email from VARROC PLI Portal.</p></div></div>`
  });
}
