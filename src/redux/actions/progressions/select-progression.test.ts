import {selectCurrentProgression} from './select-progression';

jest.mock('@coorpacademy/player-store', () => ({
  selectProgression: jest.fn(),
  getCurrentProgressionId: jest.fn((state) => state.ui.current.progressionId),
}));

const playerStore = require('@coorpacademy/player-store');

describe('selectProgression', () => {
  it('should select current progression if progressionId is defined', async () => {
    const getState = () => ({
      ui: {current: {progressionId: 'foo'}},
    });

    // @ts-ignore
    playerStore.selectProgression.mockImplementationOnce((id) => {
      expect(id).toEqual('foo');
      return {type: '@@mock/SELECT_PROGRESSION', meta: {id}};
    });

    const dispatch = jest.fn().mockImplementationOnce((action) => {
      expect(action).toEqual({type: '@@mock/SELECT_PROGRESSION', meta: {id: 'foo'}});
      return action;
    });

    await selectCurrentProgression()(dispatch, getState);
  });

  it('should do nothing if progressionId is not defined', async () => {
    const getState = () => ({
      ui: {current: {progressionId: null}},
    });
    const dispatch = jest.fn();
    await selectCurrentProgression()(dispatch, getState);
  });
});
