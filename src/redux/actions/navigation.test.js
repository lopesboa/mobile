// @flow strict

import {NAVIGATION_SCREEN_CHANGE, changeScreen} from './navigation';
import type {Action} from './navigation';

describe('Navigation', () => {
  describe('changeScreen', () => {
    const expected: Action = {
      type: NAVIGATION_SCREEN_CHANGE,
      payload: {
        currentNavigatorName: 'Foo',
        currentAppScreenName: 'Bar',
        currentScreenName: 'Baz'
      }
    };
    const {currentNavigatorName, currentAppScreenName, currentScreenName} = expected.payload;

    it('default', async () => {
      const dispatch: Dispatch = jest.fn();
      const getState: GetState = jest.fn();
      // $FlowFixMe we don't want to mock the entire object
      const options: Options = {
        services: {
          Analytics: {
            setCurrentScreen: jest.fn()
          }
        }
      };
      // $FlowFixMe missing callable signature
      await changeScreen(currentNavigatorName, currentAppScreenName, currentScreenName)(
        dispatch,
        getState,
        options
      );
      expect(dispatch).toHaveBeenCalledWith(expected);
      expect(options.services.Analytics.setCurrentScreen).toHaveBeenCalledWith(currentScreenName);
    });

    it('with tab', async () => {
      const dispatch: Dispatch = jest.fn();
      const getState: GetState = jest.fn();
      // $FlowFixMe we don't want to mock the entire object
      const options: Options = {
        services: {
          Analytics: {
            setCurrentScreen: jest.fn()
          }
        }
      };
      const currentTabName = 'Qux';
      // $FlowFixMe missing callable signature
      await changeScreen(
        currentNavigatorName,
        currentAppScreenName,
        currentScreenName,
        currentTabName
      )(dispatch, getState, options);
      expect(dispatch).toHaveBeenCalledWith({
        ...expected,
        payload: {...expected.payload, currentTabName}
      });
      expect(options.services.Analytics.setCurrentScreen).toHaveBeenCalledWith(currentTabName);
    });
  });
});
