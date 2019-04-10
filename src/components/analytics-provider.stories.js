// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import {TestContextProvider} from '../utils/tests';
import {__TEST__} from '../modules/environment';
import AnalyticsProvider, {AnalyticsContext} from './analytics-provider';

if (__TEST__) {
  describe('AnalyticsProvider', () => {
    it('should provide analytics functions', () => {
      const component = jest.fn();
      renderer.create(
        <TestContextProvider>
          <AnalyticsProvider>
            <AnalyticsContext.Consumer>{component}</AnalyticsContext.Consumer>
          </AnalyticsProvider>
        </TestContextProvider>
      );
      const expected = {
        logEvent: expect.any(Function),
        setCurrentScreen: expect.any(Function),
        setUserProperty: expect.any(Function)
      };
      expect(component.mock.calls[0][0]).toMatchObject(expected);
    });
  });
}
