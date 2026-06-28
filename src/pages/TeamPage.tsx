import { useParams, Link } from "react-router-dom"
import { useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, TrendingUp, TrendingDown, Minus, MapPin, Clock } from "lucide-react"
import { useCopaData } from "../hooks/useCopaData"
import { computeStandings } from "../utils/standings"
import { computeScorers } from "../utils/scorers"
import { getFlag } from "../utils/flags"
import type { Match, TeamStanding, ScorerEntry } from "../types"

function getTeamMatches(matches: Match[], team: string): Match[] {
  return matches.filter((m) => m.team1 === team || m.team2 === team)
}

function getTeamStanding(standings: TeamStanding[], team: string): TeamStanding | undefined {
  return standings.find((s) => s.team === team)
}

function getTeamScorers(scorers: ScorerEntry[], team: string): ScorerEntry[] {
  return scorers.filter((s) => s.teams.includes(team))
}

function getResult(match: Match, team: string): "W" | "D" | "L" | null {
  if (!match.score) return null
  const isTeam1 = match.team1 === team
  const scored = isTeam1 ? match.score.ft[0] : match.score.ft[1]
  const conceded = isTeam1 ? match.score.ft[1] : match.score.ft[0]
  if (scored > conceded) return "W"
  if (scored === conceded) return "D"
  return "L"
}

const RESULT_STYLES = {
  W: "bg-wc-green/15 text-wc-green border-wc-green/30",
  D: "bg-wc-gold/15 text-wc-gold border-wc-gold/30",
  L: "bg-wc-red/15 text-wc-red border-wc-red/30",
}

export function TeamPage() {
  const { teamName } = useParams<{ teamName: string }>()
  const team = decodeURIComponent(teamName ?? "")
  const { data, loading, error } = useCopaData()

  const standings = useMemo(() => data ? computeStandings(data.matches) : [], [data])
  const scorers = useMemo(() => data ? computeScorers(data.matches) : [], [data])

  if (loading) {
    return (
      <div className="min-h-screen bg-tech-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-wc-gold/20 border-t-wc-gold animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-tech-950 flex items-center justify-center">
        <p className="text-wc-red">Failed to load data</p>
      </div>
    )
  }

  const teamMatches = getTeamMatches(data.matches, team)
  const standing = getTeamStanding(standings, team)
  const teamScorers = getTeamScorers(scorers, team)
  const played = teamMatches.filter((m) => m.score)
  const wins = played.filter((m) => getResult(m, team) === "W").length
  const draws = played.filter((m) => getResult(m, team) === "D").length
  const losses = played.filter((m) => getResult(m, team) === "L").length
  const goalsFor = played.reduce((acc, m) => {
    const isTeam1 = m.team1 === team
    return acc + (isTeam1 ? m.score!.ft[0] : m.score!.ft[1])
  }, 0)
  const goalsAgainst = played.reduce((acc, m) => {
    const isTeam1 = m.team1 === team
    return acc + (isTeam1 ? m.score!.ft[1] : m.score!.ft[0])
  }, 0)

  return (
    <div className="min-h-screen bg-tech-950">
      <div className="border-b border-white/5 bg-tech-900/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-4">
            <ArrowLeft className="w-3 h-3" />
            Back to Dashboard
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 sm:gap-4"
          >
            <span className="text-3xl sm:text-4xl">{getFlag(team)}</span>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{team}</h1>
              {standing && (
                <p className="text-xs text-white/40 mt-0.5">
                  {standing.group} · Position {standings.filter((s) => s.group === standing.group).indexOf(standing) + 1}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {[
            { label: "Played", value: played.length },
            { label: "Wins", value: wins, color: "text-wc-green" },
            { label: "Draws", value: draws, color: "text-wc-gold" },
            { label: "Losses", value: losses, color: "text-wc-red" },
            { label: "GF", value: goalsFor },
            { label: "GA", value: goalsAgainst },
          ].map((s) => (
            <div key={s.label} className="stat-card p-2.5 sm:p-3">
              <div className="text-[9px] sm:text-[10px] text-white/30 uppercase tracking-wider mb-1">{s.label}</div>
              <div className={`text-lg sm:text-xl font-bold ${s.color ?? "text-white"}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {standing && (
          <div className="panel p-4">
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Group Standing</h3>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              <div>
                <div className="text-[10px] text-white/30 uppercase mb-1">Points</div>
                <div className="text-xl sm:text-2xl font-bold text-wc-gold">{standing.pts}</div>
              </div>
              <div>
                <div className="text-[10px] text-white/30 uppercase mb-1">Goal Diff</div>
                <div className="flex items-center justify-center gap-1">
                  {standing.gd > 0 && <TrendingUp className="w-4 h-4 text-wc-green" />}
                  {standing.gd < 0 && <TrendingDown className="w-4 h-4 text-wc-red" />}
                  {standing.gd === 0 && <Minus className="w-4 h-4 text-white/20" />}
                  <span className={`text-lg sm:text-xl font-bold ${standing.gd > 0 ? "text-wc-green" : standing.gd < 0 ? "text-wc-red" : "text-white/40"}`}>
                    {standing.gd > 0 ? `+${standing.gd}` : standing.gd}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-white/30 uppercase mb-1">GF</div>
                <div className="text-lg sm:text-xl font-bold text-white">{standing.gf}</div>
              </div>
              <div>
                <div className="text-[10px] text-white/30 uppercase mb-1">GA</div>
                <div className="text-lg sm:text-xl font-bold text-white">{standing.ga}</div>
              </div>
            </div>
          </div>
        )}

        {teamScorers.length > 0 && (
          <div className="panel overflow-hidden">
            <div className="px-4 py-2.5 border-b border-white/5">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Goalscorers</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[320px]">
                <thead>
                  <tr className="text-white/25 uppercase tracking-wider border-b border-white/5">
                    <th className="px-3 sm:px-4 py-2 text-left font-medium">Player</th>
                    <th className="px-3 sm:px-4 py-2 text-center font-medium">Goals</th>
                    <th className="px-3 sm:px-4 py-2 text-center font-medium">PK</th>
                    <th className="px-3 sm:px-4 py-2 text-center font-medium">OG</th>
                  </tr>
                </thead>
                <tbody>
                  {teamScorers.map((s) => (
                    <tr key={s.name} className="table-row">
                      <td className="px-3 sm:px-4 py-2 font-medium text-white/80">{s.name}</td>
                      <td className="px-3 sm:px-4 py-2 text-center font-bold text-white">{s.goals}</td>
                      <td className="px-3 sm:px-4 py-2 text-center text-wc-magenta/60">{s.penalties || "—"}</td>
                      <td className="px-3 sm:px-4 py-2 text-center text-wc-red/50">{s.owngoals || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Match Results</h3>
          <div className="space-y-2">
            {teamMatches.map((m, i) => {
              const result = getResult(m, team)
              const isTeam1 = m.team1 === team
              const score = m.score
                ? `${m.score.ft[0]} — ${m.score.ft[1]}`
                : "TBD"
              return (
                <motion.div
                  key={`${m.date}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="panel flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-3"
                >
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-white/30 font-mono w-14 sm:w-20 shrink-0">
                    <Clock className="w-3 h-3 hidden sm:block" />
                    {m.date}
                  </div>

                  {result && (
                    <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 border ${RESULT_STYLES[result]}`}>
                      {result}
                    </span>
                  )}

                  <div className="flex-1 flex items-center justify-end gap-1.5 sm:gap-2 min-w-0">
                    <span className={`text-xs sm:text-sm font-medium ${isTeam1 ? "text-white" : "text-white/60"} truncate`}>{m.team1}</span>
                    <span className="text-sm leading-none shrink-0">{getFlag(m.team1)}</span>
                  </div>

                  <div className="shrink-0 px-2 sm:px-3 py-1 bg-tech-800 border border-white/5 text-xs sm:text-sm font-bold text-white font-mono min-w-[48px] sm:min-w-[60px] text-center">
                    {score}
                  </div>

                  <div className="flex-1 flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="text-sm leading-none shrink-0">{getFlag(m.team2)}</span>
                    <span className={`text-xs sm:text-sm font-medium ${!isTeam1 ? "text-white" : "text-white/60"} truncate`}>{m.team2}</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 text-[11px] text-white/15 w-32 shrink-0 truncate text-right">
                    <MapPin className="w-3 h-3" />
                    {m.ground}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
