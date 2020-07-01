jest.mock('@coorpacademy/player-store', () => ({
  getClue: jest.fn(),
}));

describe('Clues', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should get clue', async () => {
    const playerStore = require('@coorpacademy/player-store');
    const {fetchClue} = require('./clues');

    const dispatch = jest.fn();
    const getState = jest.fn();

    await fetchClue()(dispatch, getState);

    expect(playerStore.getClue).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
