import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import dbConnect from '@/lib/mongodb';
import SentEmail from '@/models/SentEmail';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  const session = await auth();
  if (!resend) {
    return NextResponse.json({ error: 'Resend API key not configured' }, { status: 500 });
  }

  const { to, subject, html, customAttachments, includeBrochure } = await req.json();

  try {
    await dbConnect();

    // 1. Attach rapsora.pdf only if toggled on
    let attachments: { filename: string; content: Buffer }[] = [];
    
    if (includeBrochure !== false) {
      const filePath = path.join(process.cwd(), 'public/rapsora.pdf');
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        attachments.push({
          filename: 'rapsora.pdf',
          content: fileBuffer,
        });
      }
    }

    // 2. Merge custom attachments (base64 → Buffer)
    if (Array.isArray(customAttachments) && customAttachments.length > 0) {
      for (const att of customAttachments) {
        if (att.filename && att.content) {
          // Strip the data URL prefix if present (e.g. "data:application/pdf;base64,...")
          const base64Data = att.content.includes(',') 
            ? att.content.split(',')[1] 
            : att.content;
          attachments.push({
            filename: att.filename,
            content: Buffer.from(base64Data, 'base64'),
          });
        }
      }
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const fromName = 'RapSora Technologies pvt. ltd.';
    const fromField = fromEmail === 'onboarding@resend.dev' ? fromEmail : `${fromName} <${fromEmail}>`;

    const { data, error } = await resend.emails.send({
      from: fromField,
      to: [to],
      subject: subject,
      html: html,
      attachments: attachments,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // Log the transmission
    await SentEmail.create({
      to,
      subject,
      bodyHTML: html,
      resendId: data?.id,
      status: 'transmitted',
      uid: session?.user?.id,
      userName: session?.user?.name
    });

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('[API SendEmail] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
