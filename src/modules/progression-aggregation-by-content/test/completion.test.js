const {pipe, set} = require('lodash/fp');
const {mapValue, reduce} = require('..');
const PROGRESSION = require('./fixtures/progression');

const COMPLETION = pipe(
  mapValue,
  set('stars', 12),
  set('latestNbQuestions', 2)
)({content: PROGRESSION});

describe('progression-aggregation-by-content | aggregation', () => {
  it('should reduce aggregation', () => {
    expect(COMPLETION).toEqual(reduce(null, COMPLETION));
    expect(COMPLETION).toEqual(reduce(COMPLETION, COMPLETION));

    const SUCCESS_COMPLETION = set('success', true, COMPLETION);
    const FAILED_COMPLETION = set('success', false, COMPLETION);

    expect(SUCCESS_COMPLETION).toEqual(reduce(SUCCESS_COMPLETION, FAILED_COMPLETION));
  });

  it('should keep latest best completion', () => {
    const SUCCESS_COMPLETION = pipe(set('success', true))(COMPLETION);

    const SUCCESS_DAY_1_COMPLETION = set('updatedAt', new Date(0, 0, 1), SUCCESS_COMPLETION);
    const SUCCESS_DAY_2_COMPLETION = set('updatedAt', new Date(0, 0, 2), SUCCESS_COMPLETION);

    expect(SUCCESS_DAY_2_COMPLETION).toEqual(
      reduce(SUCCESS_DAY_1_COMPLETION, SUCCESS_DAY_2_COMPLETION)
    );
    expect(SUCCESS_DAY_2_COMPLETION).toEqual(
      reduce(SUCCESS_DAY_2_COMPLETION, SUCCESS_DAY_1_COMPLETION)
    );
  });

  it('should reduce ongoing completion', () => {
    const HIGHER_COMPLETION = set('latestNbQuestions', 5, COMPLETION);
    expect(HIGHER_COMPLETION).toEqual(reduce(COMPLETION, HIGHER_COMPLETION));

    const FAILURE_COMPLETION = pipe(
      set('latestNbQuestions', 0),
      set('success', false)
    )(COMPLETION);

    expect(FAILURE_COMPLETION).toEqual(reduce(COMPLETION, FAILURE_COMPLETION));

    const SUCCESS_COMPLETION = pipe(
      set('latestNbQuestions', 5),
      set('success', true)
    )(COMPLETION);

    expect(SUCCESS_COMPLETION).toEqual(reduce(COMPLETION, SUCCESS_COMPLETION));

    const LOWER_COMPLETION = set('latestNbQuestions', 1, COMPLETION);
    expect(COMPLETION).toEqual(reduce(COMPLETION, LOWER_COMPLETION));

    const NEW_VERSION_COMPLETION = pipe(
      set('latestNbQuestions', 1),
      set('content.version', '2')
    )(COMPLETION);

    expect(NEW_VERSION_COMPLETION).toEqual(reduce(COMPLETION, NEW_VERSION_COMPLETION));
    expect(NEW_VERSION_COMPLETION).toEqual(reduce(NEW_VERSION_COMPLETION, COMPLETION));
  });

  it('should reduce success completion', () => {
    const SUCCESS_COMPLETION = {
      content: COMPLETION.content,
      latestNbQuestions: 4,
      success: true,
      stars: 5,
      updatedAt: COMPLETION.updatedAt
    };

    expect(SUCCESS_COMPLETION).toEqual(reduce(SUCCESS_COMPLETION, COMPLETION));

    const SUCCESS_COMPLETION_WITH_MORE_STARS = {
      content: COMPLETION.content,
      latestNbQuestions: 1,
      success: true,
      stars: 20,
      updatedAt: COMPLETION.updatedAt
    };

    expect(SUCCESS_COMPLETION_WITH_MORE_STARS).toEqual(
      reduce(SUCCESS_COMPLETION, SUCCESS_COMPLETION_WITH_MORE_STARS)
    );

    const SUCCESS_COMPLETION_WITH_LESS_STARS = set('stars', 0, SUCCESS_COMPLETION);
    expect(SUCCESS_COMPLETION).toEqual(
      reduce(SUCCESS_COMPLETION, SUCCESS_COMPLETION_WITH_LESS_STARS)
    );
  });

  it('should reduce ongoing completion on success completion', () => {
    const ONGOING_COMPLETION = {
      ...COMPLETION,
      latestNbQuestions: 2
    };
    const SUCCESS_COMPLETION = {
      ...COMPLETION,
      latestNbQuestions: 4,
      success: true
    };

    expect(SUCCESS_COMPLETION).toEqual(reduce(SUCCESS_COMPLETION, ONGOING_COMPLETION));
  });
});
