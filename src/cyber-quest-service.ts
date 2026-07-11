// src/lib/cyber-quest-service.ts
import { supabase } from "./supabase.js";
import type { Scenario } from "@/types/cyber-quest";

export async function fetchScenarios(): Promise<Scenario[]> {
  const { data, error } = await supabase
    .from("scenarios")
    .select("*")
    .eq("published", true)
    .order("threat_level");

  if (error) throw error;
  return data.map(rowToScenario);
}

export async function submitCaseAttempt(payload: {
  scenarioId: string;
  clueIds: string[];
  decisionId: string;
  wasCorrect: boolean;
  xpEarned: number;
  timeSeconds: number;
  mistakeTags: string[];
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error: attemptError } = await supabase.from("case_attempts").insert({
    user_id: user.id,
    scenario_id: payload.scenarioId,
    status: payload.wasCorrect ? "completed" : "failed",
    clues_found: payload.clueIds,
    decision_id: payload.decisionId,
    was_correct: payload.wasCorrect,
    xp_earned: payload.xpEarned,
    time_seconds: payload.timeSeconds,
    mistake_tags: payload.mistakeTags,
    completed_at: new Date().toISOString(),
  });

  if (attemptError) throw attemptError;

  if (payload.wasCorrect) {
    await supabase.rpc("increment_player_xp", {
      p_user_id: user.id,
      p_xp: payload.xpEarned,
    });
  }

  await supabase.rpc("check_achievements", { p_user_id: user.id });
}

function rowToScenario(row: Record<string, unknown>): Scenario {
  return {
    id: row.id as string,
    title: row.title as string,
    icon: row.icon as string,
    difficulty: row.difficulty as Scenario["difficulty"],
    xpReward: row.xp_reward as number,
    threatLevel: row.threat_level as number,
    briefing: row.briefing as Scenario["briefing"],
    evidence: row.evidence as Scenario["evidence"],
    clues: row.clues as Scenario["clues"],
    decisions: row.decisions as Scenario["decisions"],
    correctPath: row.correct_path as Scenario["correctPath"],
    lesson: row.lesson as Scenario["lesson"],
  };
}