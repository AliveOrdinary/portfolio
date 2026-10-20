// Screenshots of Sortlog, taken from a demo company with made-up crew and parts.
// A file listed here only shows on the page once it exists in src/assets/sortlog/.
export const sortlogShots: { file: string; alt: string; caption: string }[] = [
  {
    file: 'day-top.png',
    alt: 'The day page: totals for skids, parts sorted, suspect and missing, and hours; who worked with start and end times; and the first skid, read from its label photo.',
    caption: 'The end of a shift starts here: who worked, then the skids read from their label photos.',
  },
  {
    file: 'times.png',
    alt: 'A part without skids with its hours and crew, the times worked out for each person, and a per-person check that everyone’s eight hours are on parts.',
    caption: 'Times are filled in from the skids, and every person’s day is checked against their shift.',
  },
  {
    file: 'day-reports.png',
    alt: 'Reports for the day: a sorting report per customer group and per part as PDF or Excel, daily hours and monthly hours.',
    caption: 'One tick per report, or all of them as a zip.',
  },
  {
    file: 'reports.png',
    alt: 'Reports page: parts and date filters, totals for skids, parts sorted, rejects and hours, and a table per part.',
    caption: 'Any date range, any parts: skids, rejects, reject rate and hours.',
  },
];
