export interface Goal {
  name: string
  minute: string
  penalty?: boolean
  owngoal?: boolean
}

export interface Score {
  ft: [number, number]
  ht: [number, number]
}

export interface Match {
  round: string
  date: string
  time: string
  team1: string
  team2: string
  score?: Score
  goals1?: Goal[]
  goals2?: Goal[]
  group?: string
  ground: string
  num?: number
}

export interface CopaData {
  name: string
  matches: Match[]
}

export interface TeamStanding {
  team: string
  group: string
  gp: number
  w: number
  d: number
  l: number
  gf: number
  ga: number
  gd: number
  pts: number
}

export interface ScorerEntry {
  name: string
  goals: number
  penalties: number
  owngoals: number
  teams: string[]
}

export type TabId = "groups" | "matches" | "knockout" | "scorers"
