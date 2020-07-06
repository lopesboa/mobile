import {TOGGLE, toggle} from './finish-course';
import type {Action} from './finish-course';

const createStore = (isActive: boolean) => ({
  getState: jest.fn(() => ({
    notifications: {
      finishCourse: {
        type: 'finish-course',
        label: 'Finish course',
        isActive: isActive,
      },
    },
  })),
  dispatch: jest.fn(),
});

describe('Finish Course Notification', () => {
  describe('toggle', () => {
    it('enables the property', async () => {
      const {getState, dispatch} = createStore(false);
      const expected: Action = {
        type: TOGGLE,
        payload: true,
      };
      // @ts-ignore missing callable signature
      await toggle()(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });

    it('disables the property', async () => {
      const {getState, dispatch} = createStore(true);
      const expected: Action = {
        type: TOGGLE,
        payload: false,
      };
      // @ts-ignore missing callable signature
      await toggle()(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });
  });
});
