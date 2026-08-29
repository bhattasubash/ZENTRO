import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redactRoadmapForFreeTier } from '@/lib/redaction';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Fetch roadmap from database
    const { data: roadmap, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !roadmap) {
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }

    // If shared, check if public viewing is allowed
    if (roadmap.is_shared && roadmap.share_token) {
      return NextResponse.json({
        projectId: roadmap.id,
        idea: roadmap.idea,
        data: roadmap.data,
        createdAt: roadmap.created_at,
        isShared: roadmap.is_shared,
      });
    }

    if (!user || roadmap.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user plan
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    const isPro = profile?.plan === 'pro';
    const clientData = isPro ? roadmap.data : redactRoadmapForFreeTier(roadmap.data);

    return NextResponse.json({
      projectId: roadmap.id,
      idea: roadmap.idea,
      data: clientData,
      createdAt: roadmap.created_at,
      isShared: roadmap.is_shared,
      shareToken: roadmap.share_token,
      isPro,
    });
  } catch (err: any) {
    console.error('API /roadmap/[id] error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch roadmap' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await supabase.from('roadmaps').delete().eq('id', id).eq('user_id', user.id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API /roadmap/[id] DELETE error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to delete roadmap' },
      { status: 500 }
    );
  }
}
