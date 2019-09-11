module.exports = {
  userId: 'dredd',
  content: {ref: '1.A1', type: 'chapter', version: '1'},
  _id: 'plup',
  meta: {
    createdAt: new Date('2016-12-06T07:46:49.919Z'),
    updatedAt: new Date('2016-12-06T07:46:49.919Z')
  },
  actions: [
    {
      type: 'move',
      createdAt: new Date('2016-12-06T07:46:49.919Z'),
      _id: 'plop',
      payload: {nextContent: {ref: '1.A1.2', type: 'slide'}, instructions: null}
    }
  ],
  engine: {ref: 'microlearning', version: '1'},
  state: {
    livesDisabled: false,
    isCorrect: true,
    slides: [],
    lives: 1,
    step: {current: 1},
    stars: 0,
    requestedClues: [],
    viewedResources: [],
    remainingLifeRequests: 1,
    hasViewedAResourceAtThisStep: false,
    content: undefined,
    nextContent: {ref: '1.A1.2', type: 'slide'},
    allAnswers: [],
    variables: {}
  }
};
