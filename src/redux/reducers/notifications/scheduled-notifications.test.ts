import {
  SCHEDULE_NOTIFICATION,
  UNSCHEDULE_NOTIFICATION,
} from '../../actions/notifications/scheduled-notifications';
import type {Action} from '../../actions/notifications/scheduled-notifications';
import reducer from './scheduled-notifications';
import type {State} from './scheduled-notifications';

describe('Scheduled notifications(reducer)', () => {
  describe('Finish course', () => {
    it('returns the default state if we havent provided one and if action does not match the supported ones', () => {
      const initialState = undefined;
      const expectedResult = {
        'finish-course': [],
      };

      const action = {
        type: 'fake',
        payload: {},
      };

      // @ts-ignore incorrect action
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });

    it('adds a new notification to the scheduled ones', () => {
      const createdAt = new Date('2020-06-06');
      const initialState: State = {
        'finish-course': [],
      };
      const expectedResult = {
        'finish-course': [
          {
            id: 'cha_fake1',
            createdAt,
          },
        ],
      };

      const action: Action = {
        type: SCHEDULE_NOTIFICATION,
        payload: {
          id: 'cha_fake1',
          type: 'finish-course',
          createdAt,
        },
      };

      // @ts-ignore incorrect action
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });
    it('removes all current scheduled notifications', () => {
      const createdAt = new Date('2020-06-06');
      const initialState: State = {
        'finish-course': [
          {
            id: 'cha_fake1',
            createdAt,
          },
          {
            id: 'cha_fake2',
            createdAt,
          },
        ],
      };
      const expectedResult = {
        'finish-course': [],
      };

      const action: Action = {
        type: UNSCHEDULE_NOTIFICATION,
        payload: {
          id: 'cha_fake1',
          type: 'finish-course',
        },
      };

      // @ts-ignore incorrect action
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });
  });
});
