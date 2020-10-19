import {SCHEDULE_NOTIFICATION_ACTION_NAME, UNSCHEDULE_NOTIFICATION_ACTION_NAME} from '../actions';
import type {Action} from '../actions';
import {UnscheduleActionPayload} from '..';
import reducer from '.';
import type {State} from '.';

describe('Scheduled notifications(reducer)', () => {
  describe('Finish course', () => {
    it('returns the default state if we havent provided one and if action does not match the supported ones', () => {
      const initialState = undefined;
      const expectedResult = {
        'finish-course': [],
        suggestion: [],
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
        suggestion: [],
      };
      const expectedResult = {
        'finish-course': [
          {
            id: 22,
            courseID: 'cha_fake1',
            createdAt,
          },
        ],
        suggestion: [],
      };

      const action: Action = {
        type: SCHEDULE_NOTIFICATION_ACTION_NAME,
        payload: {
          id: 22,
          courseID: 'cha_fake1',
          type: 'finish-course',
          createdAt,
        },
      };

      // @ts-ignore incorrect action
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });

    it('removes all current finish-course scheduled notifications', () => {
      const createdAt = new Date('2020-06-06');
      const initialState: State = {
        'finish-course': [
          {
            id: 22,
            courseID: 'cha_fake1',
            createdAt,
          },
          {
            id: 22,
            courseID: 'cha_fake2',
            createdAt,
          },
        ],
        suggestion: [],
      };
      const expectedResult = {
        'finish-course': [],
        suggestion: [],
      };

      const action: Action<typeof UNSCHEDULE_NOTIFICATION_ACTION_NAME, UnscheduleActionPayload> = {
        type: UNSCHEDULE_NOTIFICATION_ACTION_NAME,
        payload: {
          id: 22,
          type: 'finish-course',
        },
      };

      // @ts-ignore incorrect action
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });
  });
});
