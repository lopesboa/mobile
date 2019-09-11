const aggregate = require('../aggregate');
const allProgressions = require('./fixtures/progressions');

const useMocks = ids => allProgressions.map(p => p.content).filter(mock => ids.includes(mock._id));

describe('aggregate', () => {
  it('shoud return an aggregation from progressions', () => {
    const progressions = useMocks(['5abd06d4987d78001c38d8a8', '5abd069d987d78001c38d89c']);
    const agg = aggregate(progressions);

    expect(agg).toEqual({
      content: {version: '1', ref: 'mod_4JGW7S08E', type: 'level'},
      latestNbQuestions: progressions[0].state.step.current - 1,
      success: false,
      stars: 4,
      updatedAt: progressions[0].meta.updatedAt
    });
  });

  it('shoud return an aggregation from progressions', () => {
    const progressions = useMocks([
      '5abd06d4987d78001c38d8a8',
      '5abd069d987d78001c38d89c',
      '5abd069d987d78001c38d89c2'
    ]);
    const agg = aggregate(progressions);

    expect(agg).toEqual({
      content: {version: '1', ref: 'mod_4JGW7S08E', type: 'level'},
      latestNbQuestions: progressions[2].state.step.current - 1,
      success: true,
      stars: 4,
      updatedAt: progressions[0].meta.updatedAt
    });
  });
});
