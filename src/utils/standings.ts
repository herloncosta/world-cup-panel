import type { Match, TeamStanding } from "../types"

const GROUP_NAMES = [
  "Group A", "Group B", "Group C", "Group D", "Group E",
  "Group F", "Group G", "Group H", "Group I", "Group J",
  "Group K", "Group L",
]

export function computeStandings(matches: Match[]): TeamStanding[] {
  const teams = new Map<string, TeamStanding>()

  for (const groupName of GROUP_NAMES) {
    const groupMatches = matches.filter((m) => m.group === groupName && m.score)

    const teamSet = new Set<string>()
    for (const m of groupMatches) {
      teamSet.add(m.team1)
      teamSet.add(m.team2)
    }

    for (const team of teamSet) {
      teams.set(`${groupName}:${team}`, {
        team,
        group: groupName,
        gp: 0,
        w: 0,
        d: 0,
        l: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        pts: 0,
      })
    }

    for (const m of groupMatches) {
      if (!m.score) continue
      const [g1, g2] = m.score.ft
      for (const t of [m.team1, m.team2]) {
        const s = teams.get(`${groupName}:${t}`)
        if (!s) continue
        const isTeam1 = t === m.team1
        const scored = isTeam1 ? g1 : g2
        const conceded = isTeam1 ? g2 : g1
        s.gp += 1
        s.gf += scored
        s.ga += conceded
        s.gd = s.gf - s.ga
        if (scored > conceded) {
          s.w += 1
          s.pts += 3
        } else if (scored === conceded) {
          s.d += 1
          s.pts += 1
        } else {
          s.l += 1
        }
      }
    }
  }

  return Array.from(teams.values()).sort((a, b) => {
    if (a.group !== b.group) return a.group.localeCompare(b.group)
    if (b.pts !== a.pts) return b.pts - a.pts
    if (b.gd !== a.gd) return b.gd - a.gd
    return b.gf - a.gf
  })
}

export function groupStandings(standings: TeamStanding[]): Map<string, TeamStanding[]> {
  const map = new Map<string, TeamStanding[]>()
  for (const s of standings) {
    const list = map.get(s.group) ?? []
    list.push(s)
    map.set(s.group, list)
  }
  return map
}
