import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// In-memory cooldown tracker (5 seconds per user)
const exportCooldowns = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Please log in to export your plan.' }, { status: 401 });
    }

    // Check user plan
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    if (profile?.plan !== 'pro') {
      return NextResponse.json(
        { error: 'PDF Export is a PRO feature. Upgrade to unlock.' },
        { status: 403 }
      );
    }

    // Cooldown rate-limiting: 5 seconds
    const now = Date.now();
    const lastExport = exportCooldowns.get(user.id) || 0;
    if (now - lastExport < 5000) {
      return NextResponse.json(
        { error: 'Please wait a few seconds before exporting again.' },
        { status: 429 }
      );
    }
    exportCooldowns.set(user.id, now);

    const body = await request.json();
    const { idea, data } = body;

    if (!data) {
      return NextResponse.json({ error: 'No roadmap data provided.' }, { status: 400 });
    }

    // Create PDF with pdf-lib
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
    const { width, height } = page.getSize();

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Dark theme background
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(19 / 255, 19 / 255, 19 / 255),
    });

    let y = height - 50;

    // Brand header
    page.drawText('ZENTRO', {
      x: 50,
      y,
      size: 24,
      font: fontBold,
      color: rgb(0, 51 / 255, 1),
    });
    y -= 18;

    page.drawText('14-DAY EXECUTION ROADMAP', {
      x: 50,
      y,
      size: 10,
      font: fontBold,
      color: rgb(196 / 255, 197 / 255, 218 / 255),
    });
    y -= 30;

    // Idea Title
    page.drawText(`Project: ${(idea || 'Execution Plan').slice(0, 50)}`, {
      x: 50,
      y,
      size: 13,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    y -= 25;

    // Core Features
    if (data.features && data.features.length > 0) {
      page.drawText('CORE FEATURES', {
        x: 50,
        y,
        size: 10,
        font: fontBold,
        color: rgb(0, 51 / 255, 1),
      });
      y -= 15;

      for (const feature of data.features.slice(0, 5)) {
        const safeFeature = feature.length > 70 ? feature.slice(0, 67) + '...' : feature;
        page.drawText(`• ${safeFeature}`, {
          x: 55,
          y,
          size: 9,
          font: fontRegular,
          color: rgb(229 / 255, 226 / 255, 225 / 255),
        });
        y -= 14;
      }
      y -= 10;
    }

    // Daily Checklist
    const checklist = data.execution_plan?.daily_checklist || [];
    if (checklist.length > 0) {
      page.drawText('14-DAY SPRINT SCHEDULE', {
        x: 50,
        y,
        size: 10,
        font: fontBold,
        color: rgb(0, 51 / 255, 1),
      });
      y -= 18;

      for (const item of checklist) {
        if (y < 60) {
          page = pdfDoc.addPage([595.28, 841.89]);
          page.drawRectangle({
            x: 0,
            y: 0,
            width,
            height,
            color: rgb(19 / 255, 19 / 255, 19 / 255),
          });
          y = height - 50;
        }

        page.drawText(`Day ${item.day}:`, {
          x: 50,
          y,
          size: 9,
          font: fontBold,
          color: rgb(0, 51 / 255, 1),
        });

        const safeTask = item.task.length > 80 ? item.task.slice(0, 77) + '...' : item.task;
        page.drawText(safeTask, {
          x: 95,
          y,
          size: 9,
          font: fontRegular,
          color: rgb(229 / 255, 226 / 255, 225 / 255),
        });
        y -= 16;
      }
    }

    const pdfBytes = await pdfDoc.save();

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="zentro-roadmap.pdf"',
      },
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json({ error: error.message || 'Export failed' }, { status: 500 });
  }
}
