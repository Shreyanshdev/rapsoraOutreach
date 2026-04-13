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

  const { to, subject, html } = await req.json();

  try {
    await dbConnect();
    const filePath = path.join(process.cwd(), 'public/rapsora.pdf');
    let attachments = [];
    
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      attachments.push({
        filename: 'rapsora.pdf',
        content: fileBuffer,
      });
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
