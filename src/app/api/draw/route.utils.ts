export const draw = ({
  openDraws,
  results = {},
}: {
  openDraws: { [date: string]: string[] };
  results?: { [childId: string]: string };
}) => {
  if (Object.keys(openDraws).length === 0) {
    return {
      openDraws,
      results,
    };
  }
  const draws = Object.entries(openDraws).filter(([date]) =>
    Object.values(results).includes(date),
  );
  const dateIndex = Math.floor(Math.random() * draws.length);
  const [date, candidates] = draws[dateIndex];
  const filteredCandidates = candidates.filter(
    (candidate) => !Object.keys(results).includes(candidate),
  );
  const childIndex = Math.floor(Math.random() * filteredCandidates.length);
  const selectedChildId = filteredCandidates[childIndex];
  return {
    openDraws: Object.fromEntries(draws.splice(dateIndex, 1)),
    results: { ...results, [selectedChildId]: date },
  };
};

export const preDraw = ({
  openSnackDraws,
  lunchResults,
}: {
  openSnackDraws: { [date: string]: string[] };
  lunchResults: { [childId: string]: string };
}) => {
  return Object.entries(openSnackDraws).reduce<{
    openDraws: { [date: string]: string[] };
    results: { [childId: string]: string };
  }>(
    (acc, [date, candidates]) => {
      const lunchWinner = lunchResults[date];
      if (candidates.includes(lunchWinner)) {
        return {
          ...acc,
          openDraws: acc.openDraws,
          results: {
            ...acc.results,
            [date]: lunchWinner,
          },
        };
      }
      return {
        ...acc,
        openDraws: { ...acc.openDraws, [date]: candidates },
      };
    },
    { openDraws: {}, results: {} },
  );
};
