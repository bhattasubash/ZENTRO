"use client";

import { useState } from "react";
import { generateRoadmap, type RoadmapData } from "@/lib/api";

interface UseRoadmapReturn {
  generate: (idea: string) => Promise<string | null>;
  loading: boolean;
  error: string | null;
  data: RoadmapData | null;
}

export function useRoadmap(): UseRoadmapReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RoadmapData | null>(null);

  const generate = async (idea: string): Promise<string | null> => {
    if (!idea.trim()) {
      setError("Please describe your idea first.");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateRoadmap(idea);
      setData(result.data);
      return result.projectId;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error, data };
}
