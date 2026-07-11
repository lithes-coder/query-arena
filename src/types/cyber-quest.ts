export type EvidenceType =
  | "sms"
  | "call"
  | "email"
  | "whatsapp"
  | "qr"
  | "bank_notification"
  | "upi_screen";

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  label: string;
  data: Record<string, unknown>;
}

export interface Clue {
  id: string;
  label: string;
  evidenceId: string;
  region?: string;
  severity: "low" | "medium" | "critical";
}

export interface Decision {
  id: string;
  label: string;
  consequence: {
    narrative: string;
    moneyLost?: number;
    outcome: "safe" | "partial" | "scammed";
    xpDelta: number;
  };
  isCorrect: boolean;
  mistakeTag?: string;
}

export interface Scenario {
  id: string;
  title: string;
  icon: string;
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  threatLevel: number;
  briefing: { narrative: string; victimContext?: string };
  evidence: EvidenceItem[];
  clues: Clue[];
  decisions: Decision[];
  correctPath: { clueIds: string[]; decisionId: string };
  lesson: { title: string; bullets: string[]; realWorldTip: string };
}

export type CasePhase =
  | "briefing"
  | "investigate"
  | "decide"
  | "consequence"
  | "debrief";

export interface CaseState {
  phase: CasePhase;
  foundClues: Set<string>;
  selectedDecision: string | null;
  startedAt: number;
}
