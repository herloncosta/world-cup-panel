import type { Match, ScorerEntry } from "../types"

export function computeScorers(matches: Match[]): ScorerEntry[] {
  const scorerMap = new Map<string, ScorerEntry>()

  for (const match of matches) {
    if (!match.score) continue

    for (const goal of [...(match.goals1 ?? []), ...(match.goals2 ?? [])]) {
      const entry = scorerMap.get(goal.name) ?? {
        name: goal.name,
        goals: 0,
        penalties: 0,
        owngoals: 0,
        teams: [],
      }
      entry.goals += 1
      if (goal.penalty) entry.penalties += 1
      if (goal.owngoal) entry.owngoals += 1

      const team = match.goals1?.includes(goal)
        ? match.team1
        : match.goals2?.includes(goal)
          ? match.team2
          : ""
      if (team && !entry.teams.includes(team)) {
        entry.teams.push(team)
      }

      scorerMap.set(goal.name, entry)
    }
  }

  return Array.from(scorerMap.values())
    .sort((a, b) => b.goals - a.goals)
}
