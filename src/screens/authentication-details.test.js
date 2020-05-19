// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import {createNavigation} from '../__fixtures__/navigation';
import type {AuthenticationType} from '../types';
import {AUTHENTICATION_TYPE} from '../const';
import type {Params} from './authentication-details';
import type {Params as QrCodeParams} from './qr-code';

const createParams = (type?: AuthenticationType = AUTHENTICATION_TYPE.DEMO): Params => ({
  type,
  onSignIn: jest.fn(),
  onHelpPress: jest.fn(),
  onDemoPress: jest.fn()
});

describe('AuthenticationDetails', () => {
  it('should handle demo press', () => {
    const AuthenticationDetails = require('./authentication-details').default;

    const params = createParams();
    const navigation = createNavigation({
      params
    });
    const component = renderer.create(<AuthenticationDetails navigation={navigation} />);

    const footer = component.root.find(
      el => el.props.testID === 'authentication-details-demo-footer'
    );
    footer.props.onDemoPress();

    expect(params.onDemoPress).toHaveBeenCalledTimes(1);
  });

  it('should handle help press', () => {
    const AuthenticationDetails = require('./authentication-details').default;

    const params = createParams();
    const navigation = createNavigation({
      params
    });
    const component = renderer.create(<AuthenticationDetails navigation={navigation} />);

    const footer = component.root.find(
      el => el.props.testID === 'authentication-details-demo-footer'
    );
    footer.props.onHelpPress();

    expect(params.onHelpPress).toHaveBeenCalledTimes(1);
  });

  describe('onPress', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.mock('../modules/inbox', () => ({
        openInbox: jest.fn()
      }));
    });

    it('should handle press on QR code', () => {
      const {openInbox} = require('../modules/inbox');
      const AuthenticationDetails = require('./authentication-details').default;

      const params = createParams(AUTHENTICATION_TYPE.QR_CODE);
      const navigation = createNavigation({
        params
      });
      const component = renderer.create(<AuthenticationDetails navigation={navigation} />);

      const button = component.root.find(
        el => el.props.testID === 'authentication-details-qr-code-button'
      );

      navigation.navigate.mockImplementationOnce((screen: string, _params: QrCodeParams) => {
        expect(screen).toEqual('QRCodeModal');
        expect(_params).toEqual({
          onScan: expect.any(Function)
        });

        const {onScan} = _params;
        const {onSignIn} = navigation.state.params;

        const token = '__TOKEN__';
        onScan(token);

        expect(onSignIn).toHaveBeenCalledTimes(1);
        expect(onSignIn).toHaveBeenCalledWith(AUTHENTICATION_TYPE.QR_CODE, token);
      });

      button.props.onPress();

      expect(navigation.navigate).toHaveBeenCalledTimes(1);
      expect(openInbox).toHaveBeenCalledTimes(0);
    });

    it('should handle press on magic link', () => {
      const {openInbox} = require('../modules/inbox');
      const AuthenticationDetails = require('./authentication-details').default;

      const params = createParams(AUTHENTICATION_TYPE.MAGIC_LINK);
      const navigation = createNavigation({
        params
      });
      const component = renderer.create(<AuthenticationDetails navigation={navigation} />);

      const button = component.root.find(
        el => el.props.testID === 'authentication-details-magic-link-button'
      );
      button.props.onPress();

      expect(navigation.navigate).toHaveBeenCalledTimes(0);
      expect(openInbox).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  it('should handle back', () => {
    const AuthenticationDetails = require('./authentication-details').default;

    const params = createParams();
    const navigation = createNavigation({
      params
    });
    const component = renderer.create(<AuthenticationDetails navigation={navigation} />);

    const button = component.root.find(
      el => el.props.testID === 'authentication-details-demo-button-close'
    );
    button.props.onPress();

    expect(navigation.dispatch).toHaveBeenCalledTimes(1);
    expect(navigation.dispatch).toHaveBeenCalledWith('Mock$ReactNavigation$NavigationActions$Back');
  });

  it('should handle Android BackHandler', () => {
    const AuthenticationDetails = require('./authentication-details').default;
    const {TestBackHandler, BackHandler} = require('../modules/back-handler');

    const params = createParams();
    const navigation = createNavigation({
      params
    });
    const component = renderer.create(<AuthenticationDetails navigation={navigation} />);

    TestBackHandler.fireEvent('hardwareBackPress');
    component.unmount();

    expect(BackHandler.addEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function)
    );
    expect(BackHandler.removeEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function)
    );
  });
});
