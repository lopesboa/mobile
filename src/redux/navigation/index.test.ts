import {ANALYTICS_EVENT_TYPE} from '../../const';
import {createFakeAnalytics} from '../../utils/tests';
import type {Action, State} from '.';
import reducer, {changeScreen, ACTION_NAME} from '.';

describe('Navigation', () => {
  describe('reducer', () => {
    const expectedInitialState: State = {
      currentNavigatorName: 'App',
      currentAppScreenName: 'Authentication',
      currentScreenName: 'Authentication',
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
        payload: {
          currentNavigatorName: 'Foo',
          currentAppScreenName: 'Bar',
          currentScreenName: 'Baz',
          currentTabName: 'Qux',
        },
      };
      const result = reducer(undefined, action);
      const expected: State = {
        ...expectedInitialState,
        currentNavigatorName: 'Foo',
        currentAppScreenName: 'Bar',
        currentScreenName: 'Baz',
        currentTabName: 'Qux',
      };
      expect(result).toEqual(expected);
    });
  });

  describe('action', () => {
    describe('changeScreen', () => {
      const expected: Action = {
        type: ACTION_NAME,
        payload: {
          currentNavigatorName: 'Foo',
          currentAppScreenName: 'Bar',
          currentScreenName: 'Baz',
        },
      };
      const {currentNavigatorName, currentAppScreenName, currentScreenName} = expected.payload;

      it('default', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        // @ts-ignore we don't want to mock the entire object
        const options: Options = {
          services: {
            Analytics: createFakeAnalytics(),
          },
        };
        // @ts-ignore missing callable signature
        await changeScreen(currentNavigatorName, currentAppScreenName, currentScreenName)(
          dispatch,
          getState,
          options,
        );
        expect(dispatch).toHaveBeenCalledWith(expected);
        expect(options.services.Analytics.logEvent).toHaveBeenCalledWith(
          ANALYTICS_EVENT_TYPE.NAVIGATE,
          {
            screenName: currentScreenName,
          },
        );
      });

      it('with tab', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        // @ts-ignore we don't want to mock the entire object
        const options: Options = {
          services: {
            Analytics: createFakeAnalytics(),
          },
        };
        const currentTabName = 'Qux';
        // @ts-ignore missing callable signature
        await changeScreen(
          currentNavigatorName,
          currentAppScreenName,
          currentScreenName,
          currentTabName,
        )(dispatch, getState, options);
        expect(dispatch).toHaveBeenCalledWith({
          ...expected,
          payload: {...expected.payload, currentTabName},
        });
        expect(options.services.Analytics.logEvent).toHaveBeenCalledWith(
          ANALYTICS_EVENT_TYPE.NAVIGATE,
          {
            screenName: currentTabName,
          },
        );
      });
    });
  });
});
