import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, MapPin, Clock } from "lucide-react"
import type { Match } from "../types"
import { TeamLink } from "./TeamLink"
import { Pagination } from "./Pagination"

const ROUNDS_PER_PAGE = 3

interface MatchesProps {
  matches: Match[]
}

function FilterBtn({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium transition-all ${
        active
          ? "bg-wc-gold/15 text-wc-gold border border-wc-gold/30"
          : "text-white/50 hover:text-white/70 border border-white/5 hover:border-white/10"
      }`}
    >
      {label}
      <span className={`text-[9px] sm:text-[10px] px-1 py-0.5 ${active ? "bg-wc-gold/20 text-wc-gold" : "bg-white/5 text-white/30"}`}>
        {count}
      </span>
    </button>
  )
}

function MatchCard({ match }: { match: Match }) {
  const [expanded, setExpanded] = useState(false)
  const hasScore = !!match.score
  const hasGoals = hasScore && ((match.goals1?.length ?? 0) > 0 || (match.goals2?.length ?? 0) > 0)

  const resultBg = (() => {
    if (!hasScore) return ""
    const [s1, s2] = match.score!.ft
    if (s1 > s2) return "bg-wc-green/8"
    if (s1 < s2) return "bg-wc-red/8"
    return "bg-wc-gold/5"
  })()

  const resultBorder = (() => {
    if (!hasScore) return "border-l-3 border-l-white/10"
    const [s1, s2] = match.score!.ft
    if (s1 > s2) return "border-l-3 border-l-wc-green"
    if (s1 < s2) return "border-l-3 border-l-wc-red"
    return "border-l-3 border-l-wc-gold"
  })()

  return (
    <div className={`panel overflow-hidden transition-all hover:border-white/10 ${resultBg}`}>
      <div
        onClick={() => hasGoals && setExpanded(!expanded)}
        className={`px-3 sm:px-4 py-3 sm:py-3.5 ${resultBorder} ${hasGoals ? "cursor-pointer" : ""}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-white/30" />
            <span className="text-xs text-white/50 font-mono">{match.date}</span>
            <span className="text-white/20">·</span>
            <span className="text-xs text-white/50">{match.time}</span>
          </div>
          {match.group && (
            <span className="text-[10px] font-bold text-wc-cyan bg-wc-cyan/10 px-2 py-0.5 uppercase tracking-wider">
              {match.group}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 text-right truncate">
            <TeamLink name={match.team1} className="text-sm font-semibold text-white/90 hover:text-wc-cyan" />
          </div>

          <div className="shrink-0">
            {hasScore ? (
              <div className="flex items-center gap-1.5 bg-tech-800 border border-white/5 px-3 py-1.5">
                <span className="text-base font-bold text-white font-mono">{match.score!.ft[0]}</span>
                <span className="text-white/20 text-xs">—</span>
                <span className="text-base font-bold text-white font-mono">{match.score!.ft[1]}</span>
              </div>
            ) : (
              <div className="px-3 py-1.5 border border-white/5">
                <span className="text-[11px] text-white/30 font-mono tracking-widest">TBD</span>
              </div>
            )}
          </div>

          <div className="flex-1 truncate">
            <TeamLink name={match.team2} className="text-sm font-semibold text-white/90 hover:text-wc-cyan" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-1 text-[11px] text-white/30">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{match.ground}</span>
          </div>
          {hasGoals && (
            <div className="flex items-center gap-1 text-[11px] text-white/30 shrink-0 ml-2">
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              <span>Goals</span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && hasGoals && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 bg-tech-900/50 px-3 sm:px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {match.goals1 && match.goals1.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-wc-green uppercase tracking-wider mb-1.5">
                    <TeamLink name={match.team1} className="text-wc-green" />
                  </p>
                  {match.goals1.map((g, i) => (
                    <div key={i} className="text-xs flex items-center gap-2 py-1">
                      <span className="text-white/70 font-medium">{g.name}</span>
                      <span className="text-white/35 font-mono text-[11px]">{g.minute}'</span>
                      {g.penalty && (
                        <span className="text-[9px] text-wc-magenta font-mono font-bold bg-wc-magenta/10 px-1">PK</span>
                      )}
                      {g.owngoal && (
                        <span className="text-[9px] text-wc-red font-mono font-bold bg-wc-red/10 px-1">OG</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {match.goals2 && match.goals2.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-wc-green uppercase tracking-wider mb-1.5">
                    <TeamLink name={match.team2} className="text-wc-green" />
                  </p>
                  {match.goals2.map((g, i) => (
                    <div key={i} className="text-xs flex items-center gap-2 py-1">
                      <span className="text-white/70 font-medium">{g.name}</span>
                      <span className="text-white/35 font-mono text-[11px]">{g.minute}'</span>
                      {g.penalty && (
                        <span className="text-[9px] text-wc-magenta font-mono font-bold bg-wc-magenta/10 px-1">PK</span>
                      )}
                      {g.owngoal && (
                        <span className="text-[9px] text-wc-red font-mono font-bold bg-wc-red/10 px-1">OG</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Matches({ matches }: MatchesProps) {
  const [filter, setFilter] = useState<"all" | "played" | "upcoming">("all")
  const [page, setPage] = useState(1)

  const playedCount = matches.filter((m) => m.score).length
  const upcomingCount = matches.length - playedCount

  const filtered = matches.filter((m) => {
    if (filter === "played") return !!m.score
    if (filter === "upcoming") return !m.score
    return true
  })

  const groups = new Map<string, Match[]>()
  for (const m of filtered) {
    const key = m.round.startsWith("Matchday") ? m.round : "Knockout"
    const list = groups.get(key) ?? []
    list.push(m)
    groups.set(key, list)
  }

  const rounds = Array.from(groups.entries())
  const totalPages = Math.ceil(rounds.length / ROUNDS_PER_PAGE)
  const paged = rounds.slice((page - 1) * ROUNDS_PER_PAGE, page * ROUNDS_PER_PAGE)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <FilterBtn label="All" count={matches.length} active={filter === "all"} onClick={() => { setFilter("all"); setPage(1) }} />
        <FilterBtn label="Played" count={playedCount} active={filter === "played"} onClick={() => { setFilter("played"); setPage(1) }} />
        <FilterBtn label="Upcoming" count={upcomingCount} active={filter === "upcoming"} onClick={() => { setFilter("upcoming"); setPage(1) }} />
      </div>

      <div className="space-y-6">
        {paged.map(([round, roundMatches]) => (
          <section key={round}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-wc-gold" />
              <h2 className="text-xs font-bold text-white/70 uppercase tracking-wider">{round}</h2>
              <span className="text-[10px] text-white/25 bg-white/5 px-1.5 py-0.5">{roundMatches.length}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {roundMatches.map((m, i) => (
                <MatchCard key={`${m.date}-${m.team1}-${m.team2}-${i}`} match={m} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
