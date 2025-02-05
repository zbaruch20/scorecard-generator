enum PaperSize {
  Letter = "letter",
  A4 = "a4",
  A6 = "a6",
}

export default PaperSize;

export type PaperSizeStrings = keyof typeof PaperSize;
