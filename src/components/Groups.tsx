import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { TeamStanding } from "../types"
import { TeamLink } from "./TeamLink"

interface GroupsProps {
  standings: TeamStanding[]
}

const ROW = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.02 } },
}

const TR = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

function GroupTable({ group, teams }: { group: string; teams: TeamStanding[] }) {
  return (
    <div className="panel overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-xs font-bold text-wc-gold uppercase tracking-wider">{group}</h3>
        <span className="text-[10px] text-white/20">{teams.length} teams</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[480px]">
          <thead>
            <tr className="text-white/25 uppercase tracking-wider border-b border-white/5">
              <th className="px-3 py-2 text-left font-medium">#</th>
              <th className="px-3 py-2 text-left font-medium">Team</th>
              <th className="px-2 py-2 text-center font-medium">MP</th>
              <th className="px-2 py-2 text-center font-medium">W</th>
              <th className="px-2 py-2 text-center font-medium">D</th>
              <th className="px-2 py-2 text-center font-medium">L</th>
              <th className="px-2 py-2 text-center font-medium">GF</th>
              <th className="px-2 py-2 text-center font-medium">GA</th>
              <th className="px-2 py-2 text-center font-medium">GD</th>
              <th className="px-3 py-2 text-center font-bold text-wc-gold">PTS</th>
            </tr>
          </thead>
          <motion.tbody variants={ROW} initial="hidden" animate="show">
            {teams.map((t, i) => {
              const advancing = i < 2
              return (
                <motion.tr
                  key={t.team}
                  variants={TR}
                  className={`table-row transition-colors ${
                    advancing ? "bg-wc-gold/4" : ""
                  }`}
                >
                  <td className={`px-3 py-2 font-mono ${
                    advancing ? "text-wc-gold font-bold" : "text-white/20"
                  }`}>
                    {i + 1}
                  </td>
                  <td className={`px-3 py-2 font-medium ${advancing ? "text-white" : "text-white/70"}`}>
                    <TeamLink name={t.team} />
                  </td>
                  <td className="px-2 py-2 text-center text-white/50">{t.gp}</td>
                  <td className="px-2 py-2 text-center text-wc-green">{t.w}</td>
                  <td className="px-2 py-2 text-center text-wc-gold/60">{t.d}</td>
                  <td className="px-2 py-2 text-center text-wc-red/60">{t.l}</td>
                  <td className="px-2 py-2 text-center text-white/60">{t.gf}</td>
                  <td className="px-2 py-2 text-center text-white/60">{t.ga}</td>
                  <td className="px-2 py-2 text-center font-mono">
                    <div className="flex items-center justify-center gap-1">
                      {t.gd > 0 && <TrendingUp className="w-3 h-3 text-wc-green" />}
                      {t.gd < 0 && <TrendingDown className="w-3 h-3 text-wc-red" />}
                      {t.gd === 0 && <Minus className="w-3 h-3 text-white/20" />}
                      <span className={t.gd > 0 ? "text-wc-green" : t.gd < 0 ? "text-wc-red" : "text-white/30"}>
                        {t.gd > 0 ? `+${t.gd}` : t.gd}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center font-bold text-sm text-white">
                    {t.pts}
                  </td>
                </motion.tr>
              )
            })}
          </motion.tbody>
        </table>
      </div>
    </div>
  )
}

export function Groups({ standings }: GroupsProps) {
  const groups = new Map<string, TeamStanding[]>()
  for (const s of standings) {
    const list = groups.get(s.group) ?? []
    list.push(s)
    groups.set(s.group, list)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {Array.from(groups.entries()).map(([group, teams]) => (
        <GroupTable key={group} group={group} teams={teams} />
      ))}
    </div>
  )
}
