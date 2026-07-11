interface Props {
  id: string;
  title: string;
  icon: string;
  threatLevel: number;
  xpReward: number;
  completed?: boolean;
  locked?: boolean;
  onSelect?: (id: string) => void;
}

export function ScenarioCard({
  id,
  title,
  icon,
  threatLevel,
  xpReward,
  completed,
  locked,
  onSelect,
}: Props) {
  const threatColors = ["", "text-green-400", "text-yellow-400", "text-orange-400", "text-red-400", "text-red-600"];

  return (
    <button
      type="button"
      disabled={locked}
      onClick={() => onSelect?.(id)}
      className={`group relative block w-full text-left rounded-xl border border-slate-700/50 bg-slate-900/60 p-5
        backdrop-blur transition hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]
        ${locked ? "opacity-40 pointer-events-none" : ""}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-3xl">{icon}</span>
        {completed && <span className="text-xs text-green-400">✓ Solved</span>}
      </div>
      <h3 className="mt-3 font-semibold text-white group-hover:text-cyan-300">{title}</h3>
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
        <span className={threatColors[threatLevel]}>Threat Lv.{threatLevel}</span>
        <span>+{xpReward} XP</span>
      </div>
    </button>
  );
}