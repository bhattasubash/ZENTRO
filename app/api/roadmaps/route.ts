import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redactRoadmapForFreeTier } from '@/lib/redaction';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ roadmaps: [] });
    }

    // Check user plan
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    const isPro = profile?.plan === 'pro';

    // Fetch user roadmaps
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return NextResponse.json({ roadmaps: [] });
    }

    const roadmaps = data.map((row) => ({
      projectId: row.id,
      idea: row.idea,
      data: isPro ? row.data : redactRoadmapForFreeTier(row.data),
      createdAt: row.created_at,
      isShared: row.is_shared,
      shareToken: row.share_token,
      isPro,
    }));

    return NextResponse.json({ roadmaps });
  } catch (err: any) {
    console.error('API /roadmaps error:', err);
    return NextResponse.json({ error: err.message || 'Failed to list roadmaps' }, { status: 500 });
  }
}
