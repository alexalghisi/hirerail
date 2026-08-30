export const STAGES = ["applied", "screen", "interview", "offer", "hired", "rejected"] as const;
export type Stage = (typeof STAGES)[number];

const FORWARD: Record<string, Stage> = {
  applied: "screen",
  screen: "interview",
  interview: "offer",
  offer: "hired",
};

export function advance(stage: Stage): Stage | null {
  return FORWARD[stage] ?? null;
}

export function averageScore(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
