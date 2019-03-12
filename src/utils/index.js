// @flow strict

export const values = <O>(map: {[key: string]: O}): Array<O> =>
  Object.keys(map).map(key => map[key]);

export const uniqBy = <O>(mapper: (obj: O) => string, array: Array<O>): Array<O> => [
  ...array
    .reduce((acc, cur) => {
      const key = mapper(cur);
      if (!acc.has(key)) acc.set(key, cur);
      return acc;
    }, new Map())
    .values()
];
