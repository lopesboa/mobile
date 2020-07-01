import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress, createFakeAnalytics} from '../utils/tests';
import {AUTHENTICATION_TYPE, ANALYTICS_EVENT_TYPE} from '../const';
import {__TEST__} from '../modules/environment';
import {Component as AuthenticationSteps} from './authentication-steps';

storiesOf('AuthenticationSteps', module)
  .add('QR code', () => (
    <AuthenticationSteps
      type={AUTHENTICATION_TYPE.QR_CODE}
      currentIndex={0}
      onChange={handleFakePress}
    />
  ))
  .add('Magic link', () => (
    <AuthenticationSteps
      type={AUTHENTICATION_TYPE.MAGIC_LINK}
      currentIndex={1}
      onChange={handleFakePress}
    />
  ));

if (__TEST__) {
  describe('AuthenticationSteps', () => {
    it('should handle onChange', () => {
      const handleChange = jest.fn();
      const analytics = createFakeAnalytics();
      const component = renderer.create(
        <AuthenticationSteps
          type={AUTHENTICATION_TYPE.QR_CODE}
          currentIndex={0}
          onChange={handleChange}
          analytics={analytics}
        />,
      );
      const authenticationSteps = component.root.find(
        (el) => el.props.testID === 'authentication-steps',
      );
      authenticationSteps.props.onChange(1);
      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.SWIPE, {
        id: 'authentication-step',
        from: 0,
        to: 1,
      });
      expect(handleChange).toHaveBeenCalled();
    });
  });
}
