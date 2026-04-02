export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      toName,
      customerEmail,
      serviceName,
      appointmentDate,
      appointmentTime,
      sessionMode,
      meetLink,
      rescheduleInfo
    } = req.body;

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'BREVO_API_KEY is not set' });
    }

    const isOnline = sessionMode && sessionMode.toLowerCase().includes('online');
    const sessionBadge = isOnline ? '🌐 Online (Virtual)' : '🏢 In-Person';
    const rescheduleText = rescheduleInfo || 'To reschedule, please reply to this email at least 24 hours in advance.';

    // ── Customer HTML ──────────────────────────────────────────────────────────
    const customerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Booking Confirmed – Intel Counselling</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    body { margin: 0; padding: 0; background: #f4f1eb; font-family: 'Inter', Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a0a2e 0%, #3b1f6e 100%); padding: 40px 48px; text-align: center; }
    .header h1 { margin: 0; color: #e8d5b7; font-size: 22px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
    .header p { margin: 8px 0 0; color: #c4a882; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; }
    .body { padding: 40px 48px; }
    .greeting { font-size: 18px; color: #1a0a2e; font-weight: 600; margin-bottom: 12px; }
    .intro { font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 28px; }
    .card { background: #faf7f2; border: 1px solid #e8ddd0; border-radius: 10px; padding: 24px 28px; margin-bottom: 28px; }
    .card-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ede8e0; font-size: 14px; }
    .card-row:last-child { border-bottom: none; padding-bottom: 0; }
    .card-label { color: #888; font-weight: 500; }
    .card-value { color: #1a0a2e; font-weight: 600; text-align: right; max-width: 60%; }
    .badge { display: inline-block; background: #e8d5b7; color: #3b1f6e; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; letter-spacing: 0.06em; }
    .meet-btn { display: block; text-align: center; background: linear-gradient(135deg, #3b1f6e, #6a3fa5); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; margin: 24px 0; letter-spacing: 0.04em; }
    .note { font-size: 13px; color: #888; line-height: 1.7; background: #f4f1eb; padding: 16px 20px; border-radius: 8px; border-left: 3px solid #c4a882; margin-bottom: 24px; }
    .footer { background: #1a0a2e; padding: 28px 48px; text-align: center; }
    .footer p { margin: 4px 0; color: #8a7a9b; font-size: 12px; }
    .footer a { color: #c4a882; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Intel Counselling</h1>
      <p>Session Confirmation</p>
    </div>
    <div class="body">
      <div class="greeting">Hi ${toName},</div>
      <p class="intro">
        Your session has been successfully booked and payment confirmed. We look forward to connecting with you.
        Please review your appointment details below.
      </p>
      <div class="card">
        <div class="card-row">
          <span class="card-label">Service</span>
          <span class="card-value">${serviceName}</span>
        </div>
        <div class="card-row">
          <span class="card-label">Date</span>
          <span class="card-value">${appointmentDate}</span>
        </div>
        <div class="card-row">
          <span class="card-label">Time</span>
          <span class="card-value">${appointmentTime}</span>
        </div>
        <div class="card-row">
          <span class="card-label">Format</span>
          <span class="card-value"><span class="badge">${sessionBadge}</span></span>
        </div>
        ${isOnline && meetLink ? `
        <div class="card-row">
          <span class="card-label">Meet Link</span>
          <span class="card-value"><a href="${meetLink}" style="color:#3b1f6e;">${meetLink}</a></span>
        </div>` : ''}
      </div>

      ${isOnline && meetLink ? `<a href="${meetLink}" class="meet-btn">Join Your Session →</a>` : ''}

      <div class="note">
        <strong>Rescheduling Policy:</strong><br/>${rescheduleText}
      </div>

      <p class="intro" style="margin-bottom:0;">
        If you have any questions before your session, feel free to reach out to us at
        <a href="mailto:intelcounselling@gmail.com" style="color:#3b1f6e;font-weight:600;">intelcounselling@gmail.com</a>.
      </p>
    </div>
    <div class="footer">
      <p>Intel Counselling &bull; <a href="mailto:intelcounselling@gmail.com">intelcounselling@gmail.com</a></p>
      <p style="margin-top:8px;font-size:11px;color:#5a4a6b;">This is an automated confirmation email. Please do not reply directly to this address.</p>
    </div>
  </div>
</body>
</html>`;

    // ── Admin HTML ─────────────────────────────────────────────────────────────
    const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>New Booking – Intel Counselling</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    body { margin: 0; padding: 0; background: #f0f0f0; font-family: 'Inter', Arial, sans-serif; }
    .wrapper { max-width: 560px; margin: 32px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: #1a0a2e; padding: 28px 36px; }
    .header h1 { margin: 0; color: #e8d5b7; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
    .header p { margin: 6px 0 0; color: #8a7a9b; font-size: 12px; }
    .body { padding: 32px 36px; }
    .section-title { font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; }
    .card { background: #f8f6f2; border: 1px solid #e8ddd0; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ede8e0; font-size: 14px; }
    .row:last-child { border-bottom: none; padding-bottom: 0; }
    .lbl { color: #999; font-weight: 500; }
    .val { color: #1a0a2e; font-weight: 600; }
    .footer { background: #f4f1eb; padding: 16px 36px; text-align: center; font-size: 11px; color: #aaa; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🔔 New Booking Received</h1>
      <p>Intel Counselling — Admin Notification</p>
    </div>
    <div class="body">
      <div class="section-title">Customer Details</div>
      <div class="card">
        <div class="row"><span class="lbl">Name</span><span class="val">${toName}</span></div>
        <div class="row"><span class="lbl">Email</span><span class="val">${customerEmail}</span></div>
      </div>
      <div class="section-title">Appointment Details</div>
      <div class="card">
        <div class="row"><span class="lbl">Service</span><span class="val">${serviceName}</span></div>
        <div class="row"><span class="lbl">Date</span><span class="val">${appointmentDate}</span></div>
        <div class="row"><span class="lbl">Time</span><span class="val">${appointmentTime}</span></div>
        <div class="row"><span class="lbl">Format</span><span class="val">${sessionBadge}</span></div>
        ${isOnline && meetLink ? `<div class="row"><span class="lbl">Meet Link</span><span class="val">${meetLink}</span></div>` : ''}
      </div>
    </div>
    <div class="footer">Intel Counselling Admin Panel — Automated Alert</div>
  </div>
</body>
</html>`;

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': apiKey
    };

    // 1. Send to Customer
    const customerRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to: [{ email: customerEmail, name: toName }],
        sender: { email: 'intelcounselling@gmail.com', name: 'Intel Counselling' },
        subject: `✅ Booking Confirmed – ${serviceName} on ${appointmentDate}`,
        htmlContent: customerHtml
      })
    });

    if (!customerRes.ok) {
      const err = await customerRes.json();
      console.error('Failed to send customer email:', err);
      return res.status(500).json({ error: 'Failed to send customer confirmation email' });
    }

    // 2. Send to Admin
    const adminRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to: [{ email: 'intelcounselling@gmail.com', name: 'Intel Counselling Admin' }],
        sender: { email: 'intelcounselling@gmail.com', name: 'Intel Counselling Bookings' },
        subject: `🔔 New Booking: ${toName} – ${serviceName} on ${appointmentDate}`,
        htmlContent: adminHtml
      })
    });

    if (!adminRes.ok) {
      const err = await adminRes.json();
      console.error('Failed to send admin email:', err);
      return res.status(500).json({ error: 'Failed to send admin notification email' });
    }

    res.status(200).json({ success: true, message: 'Confirmation emails sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
