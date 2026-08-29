import type { RoadmapData } from '@/lib/api';

export function redactRoadmapForFreeTier(data: RoadmapData): RoadmapData {
  if (!data) return data;

  const checklist = data.execution_plan?.daily_checklist || [];

  const redactedChecklist = checklist.map((item) => {
    if (item.day <= 3) {
      return {
        ...item,
        locked: false,
      };
    }
    return {
      day: item.day,
      task: `🔒 Day ${item.day} Execution Step — Upgrade to PRO to unlock complete daily breakdown.`,
      locked: true,
    };
  });

  return {
    ...data,
    features: data.features ? data.features.slice(0, 3) : [],
    monetization: data.monetization ? data.monetization.slice(0, 2) : [],
    risks: data.risks ? data.risks.slice(0, 2) : [],
    execution_plan: {
      ...data.execution_plan,
      daily_checklist: redactedChecklist,
    },
    is_gated: true,
  };
}
