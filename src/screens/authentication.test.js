// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import {assistanceEmail} from '../../app';
import {createToken} from '../__fixtures__/tokens';
import {createNavigation} from '../__fixtures__/navigation';
import {createStoreState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {ENGINE, CONTENT_TYPE, AUTHENTICATION_TYPE} from '../const';
import type {ConnectedStateProps} from './authentication';

jest.useFakeTimers();

jest.mock('../containers/error-listener', () => 'Mock$ErrorListener');
jest.mock('../utils/local-token', () => ({
  get: jest.fn(() => Promise.resolve(null))
}));

describe('Authentication', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('props', () => {
    it('should return the accurate props', () => {
      const {mapStateToProps} = require('./authentication');

      const progression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: 'foo'
        },
        state: {
          nextContent: {
            type: CONTENT_TYPE.SLIDE,
            ref: 'bar'
          }
        }
      });

      const store = createStoreState({
        levels: [],
        disciplines: [],
        chapters: [],
        slides: [],
        progression
      });

      const result = mapStateToProps(store);
      const expected: ConnectedStateProps = {
        isAuthenticated: true
      };
      expect(expected).toEqual(result);
    });
  });

  it('should hide the splashscreen', async () => {
    const {Component: Authentication} = require('./authentication');

    const signIn = jest.fn();
    const navigation = createNavigation({});
    await renderer.create(<Authentication navigation={navigation} signIn={signIn} />);

    expect(navigation.navigate).toHaveBeenCalledTimes(0);
    expect(signIn).toHaveBeenCalledTimes(0);
  });

  it('should sign in automatically', async () => {
    const {get: getToken} = require('../utils/local-token');
    const {Component: Authentication} = require('./authentication');

    const token = createToken({});
    // $FlowFixMe mocked function
    getToken.mockReturnValueOnce(token);

    const signIn = jest.fn();
    const navigation = createNavigation({});
    await renderer.create(<Authentication navigation={navigation} signIn={signIn} />);

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Home');
    expect(signIn).toHaveBeenCalledTimes(1);
    expect(signIn).toHaveBeenCalledWith(AUTHENTICATION_TYPE.RECONNECTION, token);
  });

  it('should sign out automatically', () => {
    const {Component: Authentication} = require('./authentication');

    const navigation = createNavigation({});
    const component = renderer.create(<Authentication navigation={navigation} isAuthenticated />);

    component.update(<Authentication navigation={navigation} />);

    expect(navigation.popToTop).toHaveBeenCalledTimes(1);
  });

  it('should handle demo press', async () => {
    const {Component: Authentication} = require('./authentication');

    const signIn = jest.fn();
    const navigation = createNavigation({});
    const component = await renderer.create(
      <Authentication navigation={navigation} signIn={signIn} />
    );

    const authentication = component.root.find(el => el.props.testID === 'authentication');
    authentication.props.onDemoPress();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Home');
    expect(signIn).toHaveBeenCalledTimes(1);
    expect(signIn).toHaveBeenCalledWith(AUTHENTICATION_TYPE.DEMO, undefined);
  });

  it('should handle help press', async () => {
    const {Linking} = require('react-native');
    const {Component: Authentication} = require('./authentication');

    const openURL = jest.spyOn(Linking, 'openURL');

    const signIn = jest.fn();
    const navigation = createNavigation({});
    const component = await renderer.create(
      <Authentication navigation={navigation} signIn={signIn} />
    );

    const authentication = component.root.find(el => el.props.testID === 'authentication');
    authentication.props.onHelpPress();

    expect(openURL).toHaveBeenCalledTimes(1);
    expect(openURL).toHaveBeenCalledWith(`mailto:${assistanceEmail}`);
  });

  it('should handle desktop button press', async () => {
    const {Component: Authentication} = require('./authentication');

    const navigation = createNavigation({});
    const component = await renderer.create(<Authentication navigation={navigation} />);

    const authentication = component.root.find(el => el.props.testID === 'authentication');
    authentication.props.onDesktopButtonPress();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('AuthenticationDetails', {
      type: AUTHENTICATION_TYPE.QR_CODE,
      onHelpPress: expect.any(Function),
      onDemoPress: expect.any(Function),
      onSignIn: expect.any(Function)
    });
  });

  it('should handle mobile button press', async () => {
    const {Component: Authentication} = require('./authentication');

    const navigation = createNavigation({});
    const component = await renderer.create(<Authentication navigation={navigation} />);

    const authentication = component.root.find(el => el.props.testID === 'authentication');
    authentication.props.onMobileButtonPress();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('AuthenticationDetails', {
      type: AUTHENTICATION_TYPE.MAGIC_LINK,
      onHelpPress: expect.any(Function),
      onDemoPress: expect.any(Function),
      onSignIn: expect.any(Function)
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
