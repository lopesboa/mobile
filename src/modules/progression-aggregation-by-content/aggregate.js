import {mapValue, reduce as reducer} from '.';

const aggregate = progressions => {
  const records = progressions.map(p => ({content: p}));
  const values = records.map(mapValue);
  return values.reduce(reducer, null);
};

module.exports = aggregate;
