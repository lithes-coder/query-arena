// src/hooks/useCaseEngine.ts
import { useCallback, useReducer } from "react";
import type { CasePhase, CaseState, Scenario } from "@/types/cyber-quest";

type Action =
  | { type: "FOUND_CLUE"; clueId: string }
  | { type: "SELECT_DECISION"; decisionId: string }
  | { type: "ADVANCE" };

function reducer(state: CaseState, action: Action): CaseState {
  switch (action.type) {
    case "FOUND_CLUE":
      return {
        ...state,
        foundClues: new Set(state.foundClues).add(action.clueId),
      };
    case "SELECT_DECISION":
      return { ...state, selectedDecision: action.decisionId };
    case "ADVANCE": {
      const next: Record<CasePhase, CasePhase> = {
        briefing: "investigate",
        investigate: "decide",
        decide: "consequence",
        consequence: "debrief",
        debrief: "debrief",
      };
      return { ...state, phase: next[state.phase] };
    }
    default:
      return state;
  }
}

export function useCaseEngine(scenario: Scenario) {
  const [state, dispatch] = useReducer(reducer, {
    phase: "briefing" as CasePhase,
    foundClues: new Set<string>(),
    selectedDecision: null,
    startedAt: Date.now(),
  });

  const requiredClues = scenario.clues.filter((c) => c.severity === "critical");
  const canDecide = requiredClues.every((c) => state.foundClues.has(c.id));

  const selectedDecision = scenario.decisions.find(
    (d) => d.id === state.selectedDecision
  );

  const submitAttempt = useCallback(async () => {
    const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
    const wasCorrect = selectedDecision?.isCorrect ?? false;

    // supabase insert — see service below
    return { wasCorrect, xp: selectedDecision?.consequence.xpDelta ?? 0, elapsed };
  }, [state, selectedDecision]);

  return {
    state,
    canDecide,
    selectedDecision,
    foundCount: state.foundClues.size,
    totalClues: scenario.clues.length,
    dispatch,
    submitAttempt,
  };
}