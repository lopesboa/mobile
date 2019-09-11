const {pipe, map, reduce, reverse} = require('lodash/fp');
const {mapValue, reduce: reduceValue} = require('..');
const allProgressions = require('./fixtures/progressions');

const useMocks = ids => allProgressions.filter(mock => ids.includes(mock.content._id));

describe('progression-aggregation-by-content | non regression', () => {
  it("should select completion only if it's the most recent", () => {
    const progressions = useMocks(['5abd06d4987d78001c38d8a8', '5abd069d987d78001c38d89c']);

    const actual = pipe(
      map(mapValue),
      reduce(reduceValue, null)
    )(progressions);

    const expected = {
      content: {ref: 'mod_4JGW7S08E', type: 'level', version: '1'},
      latestNbQuestions: 13,
      success: false,
      stars: 4,
      updatedAt: '2018-03-29T15:31:53.849Z'
    };

    expect(expected).toEqual(actual);
  });

  it("should select completion only if it's the most recent, in whatever order", () => {
    const progressions = useMocks(['5abd06d4987d78001c38d8a8', '5abd069d987d78001c38d89c']);

    const actual = pipe(
      reverse,
      map(mapValue),
      reduce(reduceValue, null)
    )(progressions);

    const expected = {
      content: {ref: 'mod_4JGW7S08E', type: 'level', version: '1'},
      latestNbQuestions: 13,
      success: false,
      stars: 4,
      updatedAt: '2018-03-29T15:31:53.849Z'
    };

    expect(expected).toEqual(actual);
  });

  it('should overwrite new state of progression over old state', () => {
    const FIRST_STATE = useMocks(['5c18d95750ffcb0019108cec']);
    const SECOND_STATE = useMocks(['5c18d95750ffcb0019108cec2']);

    const firstActual = pipe(
      reverse,
      map(mapValue),
      reduce(reduceValue, null)
    )(FIRST_STATE);

    const firstExpected = {
      content: {ref: 'cha_Ny1BTxRp~', type: 'chapter', version: '1'},
      latestNbQuestions: 0,
      success: false,
      stars: 0,
      updatedAt: '2018-12-18T11:26:15.780Z'
    };

    expect(firstExpected).toEqual(firstActual);

    const secondActual = pipe(
      reverse,
      map(mapValue),
      reduce(reduceValue, firstActual)
    )(SECOND_STATE);

    const secondExpected = {
      content: {ref: 'cha_Ny1BTxRp~', type: 'chapter', version: '1'},
      latestNbQuestions: 1,
      success: false,
      stars: 4,
      updatedAt: '2018-12-18T11:26:46.137Z'
    };

    expect(secondExpected).toEqual(secondActual);
  });
});
