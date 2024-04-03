import Competitor from "./competitor"

export default interface ScorecardData {
  competition: string
  event: string
  round: number
  numAttempts: number

  hasCutoff: boolean
  cutoffMinutes: number
  cutoffSeconds: number

  timeLimitMinutes: number
  timeLimitSeconds: number

  numGroups: number
  numBlanksPerGroup: number

  competitors: Competitor[]
}