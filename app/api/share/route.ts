import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await request.json();
    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    // Verify ownership
    const { data: roadmap, error: fetchErr } = await supabase
      .from('roadmaps')
      .select('id, is_shared, share_token')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (fetchErr || !roadmap) {
      return NextResponse.json({ error: 'Roadmap not found or unauthorized' }, { status: 404 });
    }

    let token = roadmap.share_token;
    if (!token) {
      // Generate unguessable random token
      token = crypto.randomUUID();
      await supabase
        .from('roadmaps')
        .update({
          is_shared: true,
          share_token: token,
        })
        .eq('id', projectId);
    } else {
      await supabase
        .from('roadmaps')
        .update({
          is_shared: true,
        })
        .eq('id', projectId);
    }

    const { origin } = new URL(request.url);
    const shareUrl = `${origin}/shared/${token}`;

    return NextResponse.json({ shareUrl, token, isShared: true });
  } catch (error: any) {
    console.error('Share error:', error);
    return NextResponse.json({ error: error.message || 'Failed to share roadmap' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await request.json();

    await supabase
      .from('roadmaps')
      .update({
        is_shared: false,
        share_token: null,
      })
      .eq('id', projectId)
      .eq('user_id', user.id);

    return NextResponse.json({ success: true, isShared: false });
  } catch (error: any) {
    console.error('Revoke share error:', error);
    return NextResponse.json({ error: error.message || 'Failed to revoke share' }, { status: 500 });
  }
}
