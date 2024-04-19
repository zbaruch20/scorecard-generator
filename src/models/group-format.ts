enum GroupFormat {
  Random = "Random",
  Manual = "Manual",
  Blank = "Blank"
}

export default GroupFormat

export type GroupFormatStrings = keyof typeof GroupFormat