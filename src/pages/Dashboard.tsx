import { useCopaData } from "../hooks/useCopaData"
import { computeStandings } from "../utils/standings"
import { computeScorers } from "../utils/scorers"
import { Groups } from "../components/Groups"
import { Matches } from "../components/Matches"
import { Knockout } from "../components/Knockout"
import { Scorers } from "../components/Scorers"
import type { TabId } from "../types"
import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  LayoutGrid,
  Calendar,
  Trophy,
  Users,
  CircleDot,
  Goal,
  Shield,
  TrendingUp,
  Crown,
  Activity,
} from "lucide-react"

const TABS: { id: TabId; label: string; icon: typeof LayoutGrid }[] = [
  { id: "groups", label: "Groups", icon: LayoutGrid },
  { id: "matches", label: "Matches", icon: Calendar },
  { id: "knockout", label: "Knockout", icon: Trophy },
  { id: "scorers", label: "Top Scorers", icon: Users },
]

const TAB_CONTENT = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-tech-950 flex items-center justify-center">
      <div className="text-center space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-wc-gold/20 border-t-wc-gold mx-auto"
        />
        <div className="space-y-1">
          <p className="text-white/70 font-medium text-sm tracking-wide">Loading World Cup 2026</p>
          <p className="text-white/25 text-xs">Fetching tournament data...</p>
        </div>
      </div>
    </div>
  )
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-tech-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="panel p-8 text-center max-w-sm space-y-4 w-full"
      >
        <Shield className="w-10 h-10 text-wc-red mx-auto" />
        <p className="text-wc-red font-bold text-lg">Failed to load data</p>
        <p className="text-white/35 text-sm">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-wc-red hover:bg-wc-red/80 text-white text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </motion.div>
    </div>
  )
}

function StatsBar({ matches, scorers }: { matches: import("../types").Match[]; scorers: import("../types").ScorerEntry[] }) {
  const stats = useMemo(() => {
    const played = matches.filter((m) => m.score)
    const totalGoals = played.reduce((acc, m) => acc + (m.score!.ft[0] + m.score!.ft[1]), 0)
    const totalTeams = new Set(matches.flatMap((m) => [m.team1, m.team2])).size
    const avgGoals = played.length > 0 ? (totalGoals / played.length).toFixed(2) : "0.00"
    return [
      { label: "Matches Played", value: played.length, accent: "accent-gold", icon: CircleDot },
      { label: "Total Goals", value: totalGoals, accent: "accent-red", icon: Goal },
      { label: "Teams", value: totalTeams, accent: "accent-cyan", icon: Shield },
      { label: "Goals / Match", value: avgGoals, accent: "accent-green", icon: TrendingUp },
      { label: "Top Scorer", value: scorers[0]?.name ?? "—", accent: "accent-gold", icon: Crown, small: true },
    ]
  }, [matches, scorers])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-6">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`stat-card stat-card-accent ${s.accent} p-3 sm:p-4`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/30 text-[10px] sm:text-[11px] uppercase tracking-wider font-medium">{s.label}</span>
            <s.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/20" />
          </div>
          <div className={`font-bold text-white ${s.small ? "text-xs sm:text-sm truncate" : "text-lg sm:text-2xl"}`}>
            {s.value}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function Sidebar({ tab, setTab }: { tab: TabId; setTab: (t: TabId) => void }) {
  return (
    <aside className="hidden md:flex w-56 bg-tech-900 border-r border-white/5 flex-col shrink-0">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-wc-gold" />
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">FIFA World Cup</h1>
            <p className="text-[10px] text-wc-gold font-medium tracking-widest uppercase">2026</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {TABS.map((t) => {
          const active = tab === t.id
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors text-left ${
                active
                  ? "bg-wc-gold/10 text-wc-gold border-l-2 border-wc-gold"
                  : "text-white/40 hover:text-white/70 hover:bg-white/3 border-l-2 border-transparent"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {t.label}
            </button>
          )
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2 text-[11px] text-white/20">
          <span className="w-1.5 h-1.5 bg-wc-green" />
          Live Data
        </div>
      </div>
    </aside>
  )
}

function MobileHeader({ tab }: { tab: TabId }) {
  const title = TABS.find((t) => t.id === tab)?.label ?? ""
  return (
    <header className="md:hidden flex items-center gap-2.5 px-4 py-3 bg-tech-900 border-b border-white/5 shrink-0">
      <Activity className="w-4 h-4 text-wc-gold shrink-0" />
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-bold text-white tracking-tight truncate">FIFA World Cup 2026</span>
        <span className="text-white/15">·</span>
        <span className="text-xs text-white/40 truncate">{title}</span>
      </div>
    </header>
  )
}

function BottomTabs({ tab, setTab }: { tab: TabId; setTab: (t: TabId) => void }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-tech-900 border-t border-white/5 z-50 safe-area-pb">
      <div className="flex items-stretch">
        {TABS.map((t) => {
          const active = tab === t.id
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
                active ? "text-wc-gold" : "text-white/30"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-medium uppercase tracking-wider">{t.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export function Dashboard() {
  const { data, loading, error } = useCopaData()
  const [tab, setTab] = useState<TabId>("groups")

  if (loading) return <LoadingScreen />
  if (error) return <ErrorScreen message={error} />
  if (!data) return null

  const standings = computeStandings(data.matches)
  const scorers = computeScorers(data.matches)

  return (
    <div className="min-h-screen bg-tech-950 flex flex-col md:flex-row">
      <MobileHeader tab={tab} />
      <Sidebar tab={tab} setTab={setTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex h-12 border-b border-white/5 bg-tech-900/50 backdrop-blur-sm items-center px-6 shrink-0">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-sm font-semibold text-white/70">
              {tab === "groups" && "Group Stage Standings"}
              {tab === "matches" && "All Matches"}
              {tab === "knockout" && "Knockout Bracket"}
              {tab === "scorers" && "Top Scorers"}
            </h2>
            <span className="text-[11px] text-white/20">{data.name}</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 pb-20 md:pb-6">
          <StatsBar matches={data.matches} scorers={scorers} />

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              variants={TAB_CONTENT}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {tab === "groups" && <Groups standings={standings} />}
              {tab === "matches" && <Matches matches={data.matches} />}
              {tab === "knockout" && <Knockout matches={data.matches} />}
              {tab === "scorers" && <Scorers scorers={scorers} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <BottomTabs tab={tab} setTab={setTab} />
    </div>
  )
}
