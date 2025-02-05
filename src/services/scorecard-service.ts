import { TDocumentDefinitions } from "pdfmake/interfaces";
import Competitor, { newCompetitor } from "../models/competitor";
import GroupFormat from "../models/group-format";
import ScorecardGeneratorData from "../models/scorecard-generator-data";
import ScorecardPaperSizeInfo from "../models/scorecard-paper-size-info";
import pdfMakeSG from "./pdfmake";
import { slugify } from "./utils";

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
    assignGroups(data.competitors, data.numGroups);
  }
  addBlanks(data.competitors, data.numBlanksPerGroup, data.numGroups);
  sortByGroups(data.competitors);

  return { ...data, competitors };
};

// TODO - maybe try doing full random
const assignGroups = (competitors: Competitor[], numGroups: number): void => {
  for (let i = 0; i < competitors.length; i++) {
    competitors[i].group = (i + 1 % numGroups) + 1;
  }
};

const addBlanks = (
  competitors: Competitor[],
  numBlanksPerGroup: number,
  numGroups: number
): void => {
  for (let i = 0; i < numBlanksPerGroup * numGroups; i++) {
    competitors.push({ ...newCompetitor(), group: (i + 1 % numGroups) + 1 });
  }
};

const sortByGroups = (competitors: Competitor[]): void => {
  competitors.sort((a, b) => a.group - b.group || a.name.localeCompare(b.name));
};

// This assumes data.competitors has been properly processed (e.g. assigned groups and sorted)
const scorecardsPdfDefinition = (
  data: ScorecardGeneratorData
): TDocumentDefinitions => {
  return {
    info: {
      title: slugify(`${data.event}-round-${data.round}-scorecards-${data.competition}`)
    },
    content: "hello world",
  };
};

export default generateScorecards;
