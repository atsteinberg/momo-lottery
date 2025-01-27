export const draw = ({
  openDraws,
  results = {},
}: {
  openDraws: { [date: string]: { childId: string; mealRequestId: string }[] };
  results?: { [childId: string]: { date: string; mealRequestId: string } };
}) => {
  if (Object.keys(openDraws).length === 0) {
    return {
      openDraws,
      results,
    };
  }
  const draws = Object.entries(openDraws).filter(
    ([date]) => !Object.values(results).some((result) => result.date === date),
  );
  if (draws.length === 0) {
    return {
      openDraws: {},
      results,
    };
  }
  const dateIndex = Math.floor(Math.random() * draws.length);
  const [date, candidates] = draws[dateIndex];
  const filteredCandidates = candidates.filter(
    ({ childId }) => !Object.keys(results).includes(childId),
  );
  if (filteredCandidates.length === 0) {
    return {
      openDraws: Object.fromEntries(draws.toSpliced(dateIndex, 1)),
      results,
    };
  }
  const childIndex = Math.floor(Math.random() * filteredCandidates.length);
  const { childId, mealRequestId } = filteredCandidates[childIndex];
  return {
    openDraws: Object.fromEntries(draws.toSpliced(dateIndex, 1)),
    results: { ...results, [childId]: { date, mealRequestId } },
  };
};

export const preDraw = ({
  openSnackDraws,
  lunchResults,
}: {
  openSnackDraws: {
    [date: string]: { childId: string; mealRequestId: string }[];
  };
  lunchResults: { [childId: string]: { date: string; mealRequestId: string } };
}) => {
  return Object.entries(openSnackDraws).reduce<{
    openDraws: { [date: string]: { childId: string; mealRequestId: string }[] };
    results: { [childId: string]: { date: string; mealRequestId: string } };
  }>(
    (acc, [date, candidates]) => {
      const [lunchWinnerId] =
        Object.entries(lunchResults).find(([_, { date: resultDate }]) => {
          return resultDate === date;
        }) ?? [];
      const { mealRequestId } =
        candidates.find(({ childId }) => childId === lunchWinnerId) ?? {};
      if (lunchWinnerId && mealRequestId) {
        return {
          ...acc,
          openDraws: acc.openDraws,
          results: {
            ...acc.results,
            [lunchWinnerId]: {
              date,
              mealRequestId,
            },
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
