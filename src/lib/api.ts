import { createClient } from '@/lib/supabase/client';

// ─── Types ──────────────────────────────────────────────────────────

export interface RoadmapStep {
  day: string;
  title: string;
  task: string;
}

export interface RoadmapData {
  idea_summary?: string;
  target_user?: string[];
  problem?: string[];
  solution?: string;
  unique_angle?: string;
  market_insight?: string[];
  features?: string[];
  monetization?: string[];
  distribution?: string[];
  risks?: string[];
  tech_stack?: string[];
  execution_plan?: {
    goal?: string;
    daily_checklist?: {
      day: number;
      task: string;
      locked?: boolean;
    }[];
  };
  is_gated?: boolean;
  [key: string]: any;
}

export interface SavedProject {
  projectId: string;
  idea: string;
  data: RoadmapData;
  createdAt: string;
  isShared?: boolean;
  shareToken?: string | null;
  isPro?: boolean;
}

const LOCAL_STORAGE_KEY = 'zentro_projects';

// ─── API Generation & Retrieval (Routed through Server) ──────────────

export async function generateRoadmap(
  idea: string
): Promise<{ projectId: string; idea: string; data: RoadmapData; isPro?: boolean }> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea }),
  });

  const result = await res.json();
  if (!res.ok || !result.success) {
    throw new Error(result.error || 'Failed to generate roadmap');
  }

  // Cache locally
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('zentro_plan', JSON.stringify(result.data));
      localStorage.setItem('zentro_plan_idea', idea);

      const local = getLocalRoadmaps();
      const filtered = local.filter((p) => p.projectId !== result.projectId);
      filtered.unshift({
        projectId: result.projectId,
        idea,
        data: result.data,
        createdAt: new Date().toISOString(),
        isPro: result.isPro,
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  }

  return { projectId: result.projectId, idea, data: result.data, isPro: result.isPro };
}

export async function getRoadmap(projectId: string): Promise<SavedProject | null> {
  try {
    const res = await fetch(`/api/roadmap/${projectId}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // network fallback to localStorage
  }

  const local = getLocalRoadmaps();
  return local.find((p) => p.projectId === projectId) ?? null;
}

export async function getAllRoadmaps(): Promise<SavedProject[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const projects: SavedProject[] = data.map((row) => ({
        projectId: row.id,
        idea: row.idea,
        data: row.data,
        createdAt: row.created_at,
        isShared: row.is_shared,
        shareToken: row.share_token,
      }));

      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
      }

      return projects;
    }
  }

  return getLocalRoadmaps();
}

export async function saveRoadmap(
  idea: string,
  data: RoadmapData,
  existingProjectId?: string
): Promise<SavedProject> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const projectId = existingProjectId || crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const project: SavedProject = {
    projectId,
    idea,
    data,
    createdAt,
  };

  if (user) {
    const { data: inserted, error } = await supabase
      .from('roadmaps')
      .insert({
        id: projectId,
        user_id: user.id,
        idea,
        data,
      })
      .select()
      .single();

    if (!error && inserted) {
      project.projectId = inserted.id;
      project.createdAt = inserted.created_at;
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const local = getLocalRoadmaps();
      const filtered = local.filter((p) => p.projectId !== project.projectId);
      filtered.unshift(project);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      localStorage.setItem('zentro_plan', JSON.stringify(data));
      localStorage.setItem('zentro_plan_idea', idea);
    } catch {
      // ignore
    }
  }

  return project;
}

export async function deleteRoadmap(projectId: string): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from('roadmaps').delete().eq('id', projectId);
  }

  if (typeof window !== 'undefined') {
    try {
      const local = getLocalRoadmaps();
      const updated = local.filter((p) => p.projectId !== projectId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  return true;
}

export async function duplicateRoadmap(projectId: string): Promise<SavedProject | null> {
  const original = await getRoadmap(projectId);
  if (!original) return null;

  const duplicatedIdea = `${original.idea} (Copy)`;
  return await saveRoadmap(duplicatedIdea, original.data);
}

// ─── LocalStorage Helpers ───────────────────────────────────────────

export function getLocalRoadmaps(): SavedProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
