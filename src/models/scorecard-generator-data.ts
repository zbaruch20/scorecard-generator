import Competitor from "./competitor";
import GroupFormat from "./group-format";

export default interface ScorecardGeneratorData {
  competition: string;
  event: string;
  round: number;
  numAttempts: number;

  hasCutoff: boolean;
  cutoffMinutes: number;
  cutoffSeconds: number;

  timeLimitMinutes: number;
  timeLimitSeconds: number;

  groupFormat: GroupFormat;
  numBlanksPerGroup: number;
  numGroups: number;

  competitors: Competitor[];
}
