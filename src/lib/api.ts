// ─── Types ──────────────────────────────────────────────────────────

export interface RoadmapStep {
  day: string;
  title: string;
  task: string;
}

export interface RoadmapData {
  roadmap: RoadmapStep[];
  checklist: string[];
  features: string[];
  target_user: string;
}

export interface SavedProject {
  projectId: string;
  idea: string;
  data: RoadmapData;
  createdAt: string;
}

// ─── User ID ────────────────────────────────────────────────────────

const USER_ID_KEY = "zentro_user_id";
const PROJECTS_KEY = "zentro_projects";

export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "";
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

// ─── API ────────────────────────────────────────────────────────────

const API_URL = "https://your-worker-url/generate";

export async function generateRoadmap(idea: string): Promise<{ projectId: string; data: RoadmapData }> {
  const userId = getOrCreateUserId();

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea, userId }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data: RoadmapData = await res.json();
  const projectId = crypto.randomUUID();

  saveRoadmap(projectId, idea, data);

  return { projectId, data };
}

// ─── localStorage CRUD ──────────────────────────────────────────────

export function saveRoadmap(projectId: string, idea: string, data: RoadmapData): void {
  const projects = getAllRoadmaps();
  const project: SavedProject = {
    projectId,
    idea,
    data,
    createdAt: new Date().toISOString(),
  };
  projects.unshift(project);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function getRoadmap(projectId: string): SavedProject | null {
  const projects = getAllRoadmaps();
  return projects.find((p) => p.projectId === projectId) ?? null;
}

export function getAllRoadmaps(): SavedProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
