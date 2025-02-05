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
import { slugify, times } from "./utils";

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

  console.log("generateScorecards() called at: ", new Date());
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

// TODO - maybe try doing full random
const assignGroups = (competitors: Competitor[], numGroups: number): void => {
  for (let i = 0; i < competitors.length; i++) {
    competitors[i].group = i + (1 % numGroups) + 1;
  }
};

const addBlanks = (
  competitors: Competitor[],
  numBlanksPerGroup: number,
  numGroups: number
): void => {
  for (let i = 0; i < numBlanksPerGroup * numGroups; i++) {
    competitors.push({ ...newCompetitor(), group: i + (1 % numGroups) + 1 });
  }
};

const sortByGroups = (competitors: Competitor[]): void => {
  competitors.sort((a, b) => a.group - b.group || a.name.localeCompare(b.name));
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
    content: "hello world",
  };
};

const scorecardList = (data: ScorecardGeneratorData) => {
  const paperInfo = scorecardPaperSizeInfos[data.paperSize];

  return data.competitors.map((c, num) => {});
};

const scorecardContent = (
  competitor: Competitor,
  num: number,
  { pageWidth, pageHeight, horizontalMargin }: ScorecardPaperSizeInfo,
  {
    competition,
    event,
    round,
    hasCutoff,
    cutoffMinutes,
    cutoffSeconds,
    timeLimitMinutes,
    timeLimitSeconds,
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
      body: [],
    },
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
) => {
  const numCutoffAttempts = numAttempts <= 3 ? 1 : 2;

  return times(numAttempts, (attemptIndex) =>
    attemptRow(attemptIndex + 1)
  ).reduce(
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

const attemptRow = (attemptNumber: number): TableCell[] => [
  {
    text: attemptNumber,
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
