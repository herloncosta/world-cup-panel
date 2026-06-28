import { motion } from "framer-motion"
import { Info, MapPin, Clock } from "lucide-react"
import type { Match } from "../types"
import { TeamLink } from "./TeamLink"

interface KnockoutProps {
  matches: Match[]
}

const STAGES = [
  "Round of 32",
  "Round of 16",
  "Quarter-final",
  "Semi-final",
  "Match for third place",
  "Final",
]

const STAGE_COLORS: Record<string, string> = {
  "Round of 32": "#004b87",
  "Round of 16": "#00d4ff",
  "Quarter-final": "#c4007a",
  "Semi-final": "#e4002b",
  "Match for third place": "#00a651",
  "Final": "#c8a951",
}

const STAGE = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const ITEM = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

function isPlaceholder(name: string): boolean {
  return /^\d[ABCDFGHIJKL](?:\/[A-Z]+)*$/.test(name) || /^[WLR]\d+/.test(name)
}

export function Knockout({ matches }: KnockoutProps) {
  const koMatches = matches.filter((m) => !m.round.startsWith("Matchday"))

  const grouped = new Map<string, Match[]>()
  for (const stage of STAGES) {
    const stageMatches = koMatches.filter((m) => m.round === stage)
    if (stageMatches.length > 0) {
      grouped.set(stage, stageMatches)
    }
  }

  return (
    <div className="space-y-4">
      <div className="panel p-3 flex flex-wrap items-center gap-x-3 sm:gap-x-5 gap-y-1.5 text-xs">
        <Info className="w-3.5 h-3.5 text-white/20 shrink-0" />
        <span className="text-white/30 font-medium uppercase tracking-wider text-[10px]">Legend</span>
        {[
          ["1A", "Group A winner"],
          ["2B", "Group B runner-up"],
          ["W74", "Winner of match 74"],
          ["3A/B", "3rd-place from A or B"],
        ].map(([code, label]) => (
          <span key={code} className="text-white/30 flex items-center gap-1.5">
            <code className="bg-tech-700 px-1.5 py-0.5 text-[10px] font-mono text-wc-cyan">{code}</code>
            <span>{label}</span>
          </span>
        ))}
      </div>

      <motion.div variants={STAGE} initial="hidden" animate="show" className="space-y-4">
        {Array.from(grouped.entries()).map(([stage, stageMatches]) => {
          const color = STAGE_COLORS[stage] ?? "#ffffff"
          return (
            <motion.div key={stage} variants={ITEM}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4" style={{ background: color }} />
                <h2 className={`text-xs font-bold uppercase tracking-wider ${
                  stage === "Final" ? "gradient-text" : "text-white/60"
                }`}>
                  {stage}
                </h2>
                <span className="text-[10px] text-white/15">({stageMatches.length})</span>
                {stage === "Final" && (
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 bg-wc-gold"
                  />
                )}
              </div>

              <div className="panel overflow-hidden">
                <div className="divide-y divide-white/4">
                  {stageMatches.map((m) => {
                    const t1Placeholder = isPlaceholder(m.team1)
                    const t2Placeholder = isPlaceholder(m.team2)
                    return (
                      <div key={m.num ?? m.team1} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3">
                        {m.num && (
                          <span className="hidden sm:inline w-8 text-[10px] text-white/15 font-mono shrink-0">#{m.num}</span>
                        )}
                        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-white/30 font-mono w-12 sm:w-16 shrink-0">
                          <Clock className="w-3 h-3 hidden sm:block" />
                          {m.date}
                        </div>

                        <div className="flex-1 text-right truncate">
                          {t1Placeholder ? <span className="text-xs sm:text-sm font-medium text-white/80">{m.team1}</span> : <TeamLink name={m.team1} className="text-xs sm:text-sm font-medium text-white/80" />}
                        </div>

                        <div className="shrink-0 px-2 sm:px-3 py-1 bg-tech-700 text-[10px] sm:text-[11px] font-mono text-white/40 min-w-[44px] sm:min-w-[52px] text-center">
                          {m.score ? `${m.score.ft[0]} — ${m.score.ft[1]}` : "VS"}
                        </div>

                        <div className="flex-1 truncate">
                          {t2Placeholder ? <span className="text-xs sm:text-sm font-medium text-white/80">{m.team2}</span> : <TeamLink name={m.team2} className="text-xs sm:text-sm font-medium text-white/80" />}
                        </div>

                        <div className="hidden sm:flex items-center gap-1 text-[11px] text-white/15 truncate w-36 text-right shrink-0">
                          <MapPin className="w-3 h-3" />
                          {m.ground}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
