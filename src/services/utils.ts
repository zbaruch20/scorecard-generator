import { Content } from "pdfmake/interfaces";
import PdfNameProps from "../models/pdf-name-props";
import { isConstructorDeclaration } from "typescript";

export const CURRENT_YEAR = new Date().getFullYear();
export const NEW_COMPETITOR = "New competitor";

export const pdfName = (
  name: string,
  { swapLatinWithLocalNames, short }: PdfNameProps = {} as PdfNameProps
): Content => {
  /* Note: support normal and fullwidth parentheses. */
  const [, latinName, localName] = name.match(/(.+)\s*[(（](.+)[)）]/) || [
    null,
    name,
    null,
  ];
  if (!localName) return latinName;
  const pdfNames: [string, Content] = [
    latinName,
    { text: localName, font: determineFont(localName) },
  ];
  const [first, second] = swapLatinWithLocalNames
    ? pdfNames.reverse()
    : pdfNames;
  return short ? first : [first, " (", second, ")"];
};

const determineFont = (text: string) => {
  const code = text.charCodeAt(0);
  /* Based on https://en.wikipedia.org/wiki/Unicode_block */
  if (inRange(code, 0x0000, 0x052f)) {
    return "Roboto";
  } else if (inRange(code, 0x0600, 0x06ff) || inRange(code, 0x0750, 0x077f)) {
    return "NotoSansArabic";
  } else if (inRange(code, 0x0e00, 0x0e7f)) {
    return "NotoSansThai";
  } else if (inRange(code, 0x0530, 0x058f)) {
    return "NotoSansArmenian";
  } else if (inRange(code, 0x10a0, 0x10ff)) {
    return "NotoSansGeorgian";
  } else if (inRange(code, 0x0900, 0x097f)) {
    return "NotoSansDevanagari";
  } else if (inRange(code, 0x0d00, 0x0d7f)) {
    return "NotoSansMalayalam";
  } else if (inRange(code, 0x0c80, 0x0cff)) {
    return "NotoSansKannada";
  } else {
    /* Default to WenQuanYiZenHei as it supports the most characters (mostly CJK). */
    return "WenQuanYiZenHei";
  }
};

export const inRange = (x: number, a: number, b: number) => a <= x && x <= b;

export const shuffle = <T, U>(arr: T[], start: number = 0): void => {
  if (arr.length > 1 && start < arr.length - 1) {
    shuffle(arr, start + 1);
    const toReplace = arr[start];
    arr.splice(start, 1);
    const i = Math.floor(Math.random() * (arr.length - start - 1)) + start;
    arr.splice(i, 0, toReplace);
  }
};

export const chunk = <T>(arr: T[], size: number): T[][] => {
  return arr.length <= size
    ? [arr]
    : [arr.slice(0, size), ...chunk(arr.slice(size), size)];
};

export const times = <T>(n: number, fn: (x: number) => T): T[] =>
  Array.from({ length: n }, (_, i) => fn(i));

export const slugify = (s: string) =>
  s.replace(/['.:&]/g, "").replace(/\s+(-+\s+)+|\s+/g, "-");

export const getMinutes = (n: number) =>
  n < 60 ? n : `${Math.floor(n / 60)}:${getSeconds(n % 60, false)}`;

export const getSeconds = (n: number, decimal = true) =>
  `${n < 10 ? 0 : ""}${n}${decimal ? ".00" : ""}`;
