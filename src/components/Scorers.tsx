import { useState } from "react"
import { motion } from "framer-motion"
import { Target } from "lucide-react"
import type { ScorerEntry } from "../types"
import { TeamLink } from "./TeamLink"
import { getFlag } from "../utils/flags"
import { Pagination } from "./Pagination"

const ROWS_PER_PAGE = 15

interface ScorersProps {
  scorers: ScorerEntry[]
}

export function Scorers({ scorers }: ScorersProps) {
  const [page, setPage] = useState(1)

  if (scorers.length === 0) {
    return (
      <div className="panel p-12 text-center">
        <Target className="w-8 h-8 text-white/15 mx-auto mb-3" />
        <p className="text-white/30 text-sm">No goals scored yet</p>
        <p className="text-white/15 text-xs mt-1">Match data with scores will appear here</p>
      </div>
    )
  }

  const maxGoals = scorers[0]?.goals ?? 1
  const totalPages = Math.ceil(scorers.length / ROWS_PER_PAGE)
  const paged = scorers.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {scorers.slice(0, 3).map((s, i) => {
          const medals = ["🥇", "🥈", "🥉"]
          const borders = ["border-wc-gold", "border-white/30", "border-amber-700"]
          return (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`panel p-4 border-l-2 ${borders[i]}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{medals[i]}</span>
                  <span className="text-[10px] text-white/25 uppercase tracking-wider font-medium">
                    {i === 0 ? "1st" : i === 1 ? "2nd" : "3rd"}
                  </span>
                </div>
                {s.teams[0] && <span className="text-lg">{getFlag(s.teams[0])}</span>}
              </div>
              <div className="font-semibold text-white text-sm truncate mb-1">{s.name}</div>
              <div className="text-2xl font-black text-white mb-1">{s.goals}</div>
              <div className="text-[11px] text-white/30">
                {s.penalties > 0 && <span className="text-wc-magenta">{s.penalties} PK</span>}
                {s.penalties > 0 && s.owngoals > 0 && <span className="mx-1">·</span>}
                {s.owngoals > 0 && <span className="text-wc-red">{s.owngoals} OG</span>}
                {s.penalties === 0 && s.owngoals === 0 && <span>goals</span>}
              </div>
              {s.teams.length > 0 && (
                <div className="text-[10px] text-white/15 mt-1.5 truncate">
                  {s.teams.map((t, idx) => (
                    <span key={t}>
                      {idx > 0 && ", "}
                      <TeamLink name={t} className="text-white/15 hover:text-wc-cyan" />
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[520px]">
            <thead>
              <tr className="text-white/25 uppercase tracking-wider border-b border-white/5">
                <th className="px-3 sm:px-4 py-2.5 text-left font-medium">#</th>
                <th className="px-3 sm:px-4 py-2.5 text-left font-medium">Player</th>
                <th className="px-3 sm:px-4 py-2.5 text-left font-medium">Goals</th>
                <th className="px-3 sm:px-4 py-2.5 text-center font-medium">PK</th>
                <th className="px-3 sm:px-4 py-2.5 text-center font-medium">OG</th>
                <th className="px-3 sm:px-4 py-2.5 text-right font-medium">Team(s)</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((s, i) => {
                const rank = (page - 1) * ROWS_PER_PAGE + i + 1
                return (
                  <tr key={s.name} className="table-row">
                    <td className="px-3 sm:px-4 py-2 text-white/20 font-mono">{rank}</td>
                    <td className="px-3 sm:px-4 py-2 font-medium text-white/80">{s.name}</td>
                    <td className="px-3 sm:px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-tech-700 max-w-[80px] sm:max-w-[100px]">
                          <div
                            className="h-full bg-wc-gold"
                            style={{ width: `${(s.goals / maxGoals) * 100}%` }}
                          />
                        </div>
                        <span className="font-bold text-white text-sm w-4 text-right">{s.goals}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-2 text-center text-wc-magenta/60">{s.penalties || "—"}</td>
                    <td className="px-3 sm:px-4 py-2 text-center text-wc-red/50">{s.owngoals || "—"}</td>
                    <td className="px-3 sm:px-4 py-2 text-right text-[11px] text-white/25 truncate max-w-[140px]">
                      <div className="flex items-center justify-end gap-1.5">
                        {s.teams.map((t, idx) => (
                          <span key={t}>
                            {idx > 0 && ", "}
                            <TeamLink name={t} className="text-white/25 hover:text-wc-cyan" />
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
