import {
  CanvasLine,
  Column,
  Content,
  ContentCanvas,
  StyleReference,
  TDocumentDefinitions,
  TableCell,
  TableCellProperties,
} from "pdfmake/interfaces";
import Competitor, { newCompetitor } from "../models/competitor";
import GroupFormat from "../models/group-format";
import ScorecardGeneratorData from "../models/scorecard-generator-data";
import ScorecardPaperSizeInfo from "../models/scorecard-paper-size-info";
import pdfMakeSG from "./pdfmake";
import {
  chunk,
  getMinutes,
  getSeconds,
  pdfName,
  shuffle,
  slugify,
  times,
} from "./utils";

// Scorecard generation adapted from Groupfier by Jonatan Kłosko https://github.com/jonatanklosko/groupifier

/* See: https://github.com/bpampuch/pdfmake/blob/3da11bd8148b190808b06f7bc27883102bf82917/src/standardPageSizes.js#L10 */
const scorecardPaperSizeInfos: { [name: string]: ScorecardPaperSizeInfo } = {
  a4: {
    pageWidth: 595.28,
    pageHeight: 841.89,
    scorecardsPerRow: 2,
    scorecardsPerPage: 4,
    horizontalMargin: 15,
    verticalMargin: 15,
  },
  a6: {
    pageWidth: 297.64,
    pageHeight: 419.53,
    scorecardsPerRow: 1,
    scorecardsPerPage: 1,
    horizontalMargin: 15,
    verticalMargin: 15,
  },
  letter: {
    pageWidth: 612.0,
    pageHeight: 792.0,
    scorecardsPerRow: 2,
    scorecardsPerPage: 4,
    horizontalMargin: 15,
    verticalMargin: 10,
  },
};

const generateScorecards = (data: ScorecardGeneratorData): void => {
  const definition = scorecardsPdfDefinition(processCompetitors(data));
  pdfMakeSG.createPdf(definition).open();
};

const processCompetitors = (
  data: ScorecardGeneratorData
): ScorecardGeneratorData => {
  const competitors = [...data.competitors]; // make a copy
  if (GroupFormat.Random == data.groupFormat) {
    assignGroups(competitors, data.numGroups);
  }
  addBlanks(competitors, data.numBlanksPerGroup, data.numGroups);
  sortByGroups(competitors);

  return { ...data, competitors };
};

const assignGroups = (competitors: Competitor[], numGroups: number): void => {
  shuffle(competitors, 0)
  for (let i = 0; i < competitors.length; i++) {
    competitors[i] ||= newCompetitor();
    competitors[i].group = ((i + 1) % numGroups) + 1;
  }
};

const addBlanks = (
  competitors: Competitor[],
  numBlanksPerGroup: number,
  numGroups: number
): void => {
  for (let i = 0; i < numBlanksPerGroup * numGroups; i++) {
    competitors.push({ ...newCompetitor(), group: ((i + 1) % numGroups) + 1 });
  }
};

const sortByGroups = (competitors: Competitor[]): void => {
  competitors.sort((a, b) => a.group - b.group || compareNames(a.name, b.name));
};

const compareNames = (a: string, b: string): number => {
  if (!a || a.length === 0) return Number.MAX_SAFE_INTEGER;
  if (!b || b.length === 0) return Number.MIN_SAFE_INTEGER;
  return a.localeCompare(b);
};

// This assumes data.competitors has been properly processed (e.g. assigned groups and sorted)
const scorecardsPdfDefinition = (
  data: ScorecardGeneratorData
): TDocumentDefinitions => {
  const {
    pageWidth,
    pageHeight,
    scorecardsPerRow,
    scorecardsPerPage,
    horizontalMargin,
    verticalMargin,
  } = scorecardPaperSizeInfos[data.paperSize];

  const cutLines: ContentCanvas = {
    canvas:
      scorecardsPerPage === 4
        ? [
            cutLine({
              type: "line",
              x1: horizontalMargin,
              y1: pageHeight / 2,
              x2: pageWidth - horizontalMargin,
              y2: pageHeight / 2,
            }),
            cutLine({
              type: "line",
              x1: pageWidth / 2,
              y1: verticalMargin,
              x2: pageWidth / 2,
              y2: pageHeight - verticalMargin,
            }),
          ]
        : [],
  };

  return {
    info: {
      title: slugify(
        `${data.event}-round-${data.round}-scorecards-${data.competition}`
      ),
    },
    background: cutLines,
    pageSize: { width: pageWidth, height: pageHeight },
    pageMargins: [horizontalMargin, verticalMargin],
    content: {
      layout: {
        /* Outer margin is done using pageMargins, we use padding for the remaining inner margins. */
        paddingLeft: (i) => (i % scorecardsPerRow === 0 ? 0 : horizontalMargin),
        paddingRight: (i) =>
          i % scorecardsPerRow === scorecardsPerRow - 1 ? 0 : horizontalMargin,
        paddingTop: (i) => (i % scorecardsPerRow === 0 ? 0 : verticalMargin),
        paddingBottom: (i) =>
          i % scorecardsPerRow === scorecardsPerRow - 1 ? 0 : verticalMargin,
        /* Get rid of borders. */
        hLineWidth: () => 0,
        vLineWidth: () => 0,
      },
      table: {
        widths: times(scorecardsPerRow, () => "*"),
        heights: pageHeight / scorecardsPerRow - 2 * verticalMargin,
        dontBreakRows: true,
        body: chunk(scorecardList(data), scorecardsPerRow),
      },
    },
  };
};

const scorecardList = (data: ScorecardGeneratorData): Content[] => {
  const paperInfo = scorecardPaperSizeInfos[data.paperSize];

  return data.competitors.map((c, num) =>
    scorecardContent(c, num, paperInfo, data)
  );
};

const scorecardContent = (
  competitor: Competitor,
  num: number,
  { pageWidth, horizontalMargin, scorecardsPerRow }: ScorecardPaperSizeInfo,
  {
    competition,
    event,
    round,
    numAttempts,
    hasCutoff,
    cutoffMinutes,
    cutoffSeconds,
    timeLimitMinutes,
    timeLimitSeconds,
    groupFormat,
  }: ScorecardGeneratorData
): Content => [
  {
    fontSize: 10,
    text: num + 1,
    alignment: "left",
  },
  {
    text: competition,
    bold: true,
    fontSize: 15,
    marginBottom: 10,
    alignment: "center",
  },
  {
    marginLeft: 25,
    table: {
      widths: ["*", 30, 30],
      body: [
        columnLabels([
          "Event",
          { text: "Round", alignment: "center" },
          { text: "Group", alignment: "center" },
        ]),
        [
          event,
          { text: round, alignment: "center" },
          {
            text: GroupFormat.Blank !== groupFormat ? competitor.group : " ",
            alignment: "center",
          },
        ],
      ],
    },
  },
  {
    marginLeft: 25,
    table: {
      widths: [30, "*"],
      body: [
        columnLabels([
          "ID",
          [
            { text: "Name", alignment: "left", width: "auto" },
            { text: competitor.wcaId, alignment: "right" },
          ],
        ]),
        [
          { text: competitor.regId || " ", alignment: "center" },
          {
            text: pdfName(competitor.name || " "),
            maxHeight: 20 /* See: https://github.com/bpampuch/pdfmake/issues/264#issuecomment-108347567 */,
          },
        ],
      ],
    },
  },
  {
    marginTop: 10,
    table: {
      /* Note: 16 (width) + 4 + 4 (defult left and right padding) + 1 (left border) = 25 */
      widths: [16, 25, "*", 25, 25],
      body: [
        columnLabels(["", "Scr", "Result", "Judge", "Comp"], {
          alignment: "center",
        }),
        ...attemptRows(
          hasCutoff,
          numAttempts,
          pageWidth / scorecardsPerRow - 2 * horizontalMargin
        ),
        [
          {
            text: "Extra" + " (" + "Delegate initials" + " _______)",
            ...noBorder,
            colSpan: 5,
            margin: [0, 1],
            fontSize: 10,
          },
        ],
        attemptRow("_"),
        [{ text: "", ...noBorder, colSpan: 5, margin: [0, 1] }],
      ],
    },
  },
  {
    fontSize: 10,
    columns: [
      hasCutoff
        ? {
            text: `Cutoff: < ${getMinutes(cutoffMinutes)}:${getSeconds(
              cutoffSeconds
            )}`,
            alignment: "center",
          }
        : ({} as Column),
      {
        text: `Time limit: ${getMinutes(timeLimitMinutes)}:${getSeconds(
          timeLimitSeconds
        )}`,
      },
    ],
  },
];

const columnLabels = (
  labels: TableCell[],
  style?: StyleReference
): TableCell[] => {
  return labels.map((label) => ({
    style,
    ...noBorder,
    fontSize: 9,
    ...(Array.isArray(label) ? { columns: label } : { text: label }),
  }));
};

const attemptRows = (
  hasCutoff: boolean,
  numAttempts: number,
  scorecardWidth: number
): TableCell[][] => {
  const numCutoffAttempts = numAttempts <= 3 ? 1 : 2;

  return times(numAttempts, (attemptIndex) =>
    attemptRow(attemptIndex + 1)
  ).reduce<TableCell[][]>(
    (rows, attemptRow, attemptIndex) =>
      attemptIndex + 1 === numAttempts
        ? [...rows, attemptRow]
        : [
            ...rows,
            attemptRow,
            attemptsSeparator(
              hasCutoff && attemptIndex + 1 === numCutoffAttempts,
              scorecardWidth
            ),
          ],
    []
  );
};

const attemptsSeparator = (
  cutoffLine: boolean,
  scorecardWidth: number
): TableCell[] => [
  {
    ...noBorder,
    colSpan: 5,
    margin: [0, 1],
    columns: !cutoffLine
      ? []
      : [
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: scorecardWidth,
                y2: 0,
                dash: { length: 5 },
              },
            ],
          },
        ],
  },
];

const attemptRow = (text: any): TableCell[] => [
  {
    text,
    ...noBorder,
    fontSize: 20,
    bold: true,
    alignment: "center",
  },
  {},
  {},
  {},
  {},
];

const noBorder: TableCellProperties = { border: [false, false, false, false] };

const cutLine = (properties: CanvasLine): CanvasLine => ({
  ...properties,
  type: "line",
  lineWidth: 0.1,
  dash: { length: 10 },
  lineColor: "#888888",
});

export default generateScorecards;
