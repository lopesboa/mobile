import type {Action, State} from '.';
import reducer, {toggleFullscreen, ACTION_NAME} from '.';

describe('Video', () => {
  describe('reducer', () => {
    describe('FullScreen', () => {
      const expectedInitialState: State = {
        isFullScreen: false,
      };

      it('returns the default state if we pass an invalid action', () => {
        const action = {
          type: 'FAKE_ACTION',
        };
        // @ts-ignore we are trying to emulate something else
        const result = reducer(undefined, action);
        expect(result).toEqual(expectedInitialState);
      });

      it('returns the new state if we pass a valid action', () => {
        const action: Action = {
          type: ACTION_NAME,
          payload: false,
        };
        const result = reducer(undefined, action);
        const expected: State = {
          ...expectedInitialState,
          isFullScreen: false,
        };
        expect(result).toEqual(expected);
      });
    });
  });

  describe('action', () => {
    describe('FullScreen', () => {
      it('toggles the isFullSccreen property of the video state if we pass a valid action', () => {
        const result = toggleFullscreen(true);
        const expected: Action = {
          type: ACTION_NAME,
          payload: true,
        };
        expect(result).toEqual(expected);
      });
    });
  });
});
