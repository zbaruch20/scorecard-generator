import Competitor from "./competitor";
import GroupFormat from "./group-format";
import PaperSize from "./paper-sizes";

export default interface ScorecardGeneratorData {
  competition: string;
  event: string;
  round: number;
  numAttempts: number;
  paperSize: PaperSize;

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
