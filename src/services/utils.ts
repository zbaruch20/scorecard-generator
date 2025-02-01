const determineFont = (text: string) => {
  const code = text.charCodeAt(0);
  /* Based on https://en.wikipedia.org/wiki/Unicode_block */
  if (inRange(code, 0x0000, 0x052f)) {
    return 'Roboto';
  } else if (inRange(code, 0x0600, 0x06ff) || inRange(code, 0x0750, 0x077f)) {
    return 'NotoSansArabic';
  } else if (inRange(code, 0x0e00, 0x0e7f)) {
    return 'NotoSansThai';
  } else if (inRange(code, 0x0530, 0x058f)) {
    return 'NotoSansArmenian';
  } else if (inRange(code, 0x10a0, 0x10ff)) {
    return 'NotoSansGeorgian';
  } else if (inRange(code, 0x0900, 0x097f)) {
    return 'NotoSansDevanagari';
  } else if (inRange(code, 0x0d00, 0x0d7f)) {
    return 'NotoSansMalayalam';
  } else if (inRange(code, 0x0c80, 0x0cff)) {
    return 'NotoSansKannada';
  } else {
    /* Default to WenQuanYiZenHei as it supports the most characters (mostly CJK). */
    return 'WenQuanYiZenHei';
  }
};

export const pdfName = (
  name: string,
  { swapLatinWithLocalNames = false, short = false } = {}
) => {
  /* Note: support normal and fullwidth parentheses. */
  const [, latinName, localName] = name.match(/(.+)\s*[(（](.+)[)）]/) || [
    null,
    name,
    null,
  ];
  if (!localName) return latinName;
  const pdfNames = [
    latinName,
    { text: localName, font: determineFont(localName) },
  ];
  const [first, second] = swapLatinWithLocalNames
    ? pdfNames.reverse()
    : pdfNames;
  return short ? first : [first, ' (', second, ')'];
};

export const inRange = (x: number, a: number, b: number) => a <= x && x <= b;