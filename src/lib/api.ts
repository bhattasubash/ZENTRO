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

// ─── API Generation & Retrieval (Routed 100% through Server) ────────

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
  try {
    const res = await fetch('/api/roadmaps');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.roadmaps)) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.roadmaps));
          } catch {
            // ignore
          }
        }
        return data.roadmaps;
      }
    }
  } catch {
    // network fallback
  }

  return getLocalRoadmaps();
}

export async function deleteRoadmap(projectId: string): Promise<boolean> {
  try {
    await fetch(`/api/roadmap/${projectId}`, {
      method: 'DELETE',
    });
  } catch {
    // ignore
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
  const result = await generateRoadmap(duplicatedIdea);
  return {
    projectId: result.projectId,
    idea: result.idea,
    data: result.data,
    createdAt: new Date().toISOString(),
    isPro: result.isPro,
  };
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
