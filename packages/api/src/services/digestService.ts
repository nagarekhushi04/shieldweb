import nodemailer from 'nodemailer';
import cron from 'node-cron';
import Threat from '../models/Threat';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  auth: { 
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS 
  }
});

async function buildDigest() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const threats = await Threat.find({ createdAt: { $gte: since } });
  
  if (threats.length === 0) return null;

  const verified = threats.filter(t => t.verified).length;
  const critical = threats.filter(t => t.severity >= 3).length;
  const byType = threats.reduce((acc, t) => {
    acc[t.threatType] = (acc[t.threatType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return { total: threats.length, verified, critical, byType, since };
}

export async function sendDigest() {
  try {
    const digest = await buildDigest();
    if (!digest || digest.total === 0) return;
    
    if (!process.env.DIGEST_RECIPIENT) {
      console.warn('⚠️ DIGEST_RECIPIENT not configured, skipping email.');
      return;
    }

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e3a8a;">🛡️ ShieldWeb3 Daily Threat Digest</h2>
        <p style="color: #64748b;">Summary of activity in the last 24 hours.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="font-size: 24px; font-weight: bold; margin: 0;">${digest.total}</p>
          <p style="color: #64748b; margin: 0;">Total Threats Detected</p>
        </div>

        <ul style="list-style: none; padding: 0;">
          <li style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">✅ <strong>Verified on-chain:</strong> ${digest.verified}</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">🚨 <strong>Critical severity (Lvl 3+):</strong> ${digest.critical}</li>
        </ul>

        <h3 style="margin-top: 20px;">Breakdown by Type:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${Object.entries(digest.byType).map(([k, v]) => `
            <tr>
              <td style="padding: 6px 0; color: #475569;">${k}</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold;">${v}</td>
            </tr>
          `).join('')}
        </table>

        <div style="margin-top: 30px; text-align: center;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/metrics" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            View Live Dashboard
          </a>
        </div>
        
        <p style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">
          ShieldWeb3 Analytics Service — Powered by Stellar Ecosystem
        </p>
      </div>
    `;
    
    await transporter.sendMail({
      from: '"ShieldWeb3" <noreply@shieldweb3.app>',
      to: process.env.DIGEST_RECIPIENT,
      subject: `ShieldWeb3 Daily Digest — ${digest.total} threats (${new Date().toDateString()})`,
      html
    });
    
    console.log('✅ Daily digest email sent successfully to', process.env.DIGEST_RECIPIENT);
  } catch (err) {
    console.error('❌ Error sending daily digest:', err);
  }
}

export function startDigestScheduler() {
  // Schedule: every day at 8am UTC
  cron.schedule('0 8 * * *', sendDigest, { timezone: 'UTC' });
  console.log('📅 Digest scheduler started (08:00 UTC Daily)');
}
