import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redactRoadmapForFreeTier } from '@/lib/redaction';

export async function POST(request: Request) {
  try {
    const { idea } = await request.json();

    if (!idea || typeof idea !== 'string' || !idea.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please describe your idea first.' },
        { status: 400 }
      );
    }

    // Call Cloudflare Worker with server-only secret header
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (process.env.ZENTRO_WORKER_SECRET) {
      headers['X-Zentro-Secret'] = process.env.ZENTRO_WORKER_SECRET;
    }

    const workerRes = await fetch('https://zentroapi.iamsubash2064.workers.dev/generate', {
      method: 'POST',
      headers,
      body: JSON.stringify({ idea }),
    });

    const result = await workerRes.json();
    if (!workerRes.ok || !result.success) {
      throw new Error(result.error || result.message || 'Worker generation failed');
    }

    const fullData = result.data;
    const projectId = crypto.randomUUID();

    // Check user plan
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let isPro = false;

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();

      if (profile?.plan === 'pro') {
        isPro = true;
      }

      // ALWAYS store the full unredacted roadmap in the database
      await supabase.from('roadmaps').insert({
        id: projectId,
        user_id: user.id,
        idea,
        data: fullData,
      });
    }

    // Gating response for client
    const clientData = isPro ? fullData : redactRoadmapForFreeTier(fullData);

    return NextResponse.json({
      success: true,
      projectId,
      idea,
      data: clientData,
      isPro,
    });
  } catch (err: any) {
    console.error('API /generate error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate roadmap' },
      { status: 500 }
    );
  }
}
