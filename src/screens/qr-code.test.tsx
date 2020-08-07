import * as React from 'react';
import renderer from 'react-test-renderer';

import {createNavigation} from '../__fixtures__/navigation';
import {createStoreState, createPermissionsState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {ENGINE, CONTENT_TYPE, PERMISSION_STATUS} from '../const';
import translations from '../translations';
import {devToken} from '../../app';
import type {ConnectedStateProps, Params} from './qr-code';

const createParams = (): Params => ({
  onScan: jest.fn(),
});

describe('QR Code', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('props', () => {
    it('should return the accurate props', () => {
      const {mapStateToProps} = require('./qr-code');

      const progression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: 'foo',
        },
      });

      const store = createStoreState({
        levels: [],
        disciplines: [],
        chapters: [],
        slides: [],
        progression,
        permissions: createPermissionsState({
          camera: PERMISSION_STATUS.GRANTED,
        }),
      });

      const result = mapStateToProps(store);
      const expected: ConnectedStateProps = {
        hasPermission: true,
      };

      expect(result).toEqual(expected);
    });
  });

  it('should handle back', () => {
    const {Component: QRCode} = require('./qr-code');
    const params = createParams();
    const {route, ...navigation} = createNavigation({
      params,
    });

    const requestCameraPermission = jest.fn();
    const component = renderer.create(
      <QRCode
        navigation={navigation}
        route={route}
        requestCameraPermission={requestCameraPermission}
      />,
    );

    const button = component.root.find((el) => el.props.testID === 'qr-code-button-close');
    button.props.onPress();

    expect(navigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('should handle fake scan', () => {
    const {Component: QRCode} = require('./qr-code');
    const params = createParams();
    const {route, ...navigation} = createNavigation({
      params,
    });
    const requestCameraPermission = jest.fn();
    const component = renderer.create(
      <QRCode
        navigation={navigation}
        route={route}
        requestCameraPermission={requestCameraPermission}
      />,
    );

    const touchable = component.root.find((el) => el.props.testID === 'qr-code-area');
    touchable.props.onLongPress();

    expect(params.onScan).toHaveBeenCalledTimes(1);
    expect(params.onScan).toHaveBeenCalledWith(devToken);
  });

  it('should not be able to fake scan in production', () => {
    jest.mock('../modules/environment', () => ({
      __DEV__: false,
      __E2E__: false,
      __TEST__: false,
    }));
    const {Component: QRCode} = require('./qr-code');
    const params = createParams();
    const {route, ...navigation} = createNavigation({
      params,
    });
    const requestCameraPermission = jest.fn();
    const component = renderer.create(
      <QRCode
        navigation={navigation}
        route={route}
        requestCameraPermission={requestCameraPermission}
      />,
    );

    expect(() => component.root.find((el) => el.props.testID === 'qr-code-area')).toThrow();
  });

  it('should handle scan', () => {
    const {Component: QRCode} = require('./qr-code');
    const token = 'foobar';
    const params = createParams();
    const {route, ...navigation} = createNavigation({
      params,
    });
    const requestCameraPermission = jest.fn();
    const component = renderer.create(
      <QRCode
        navigation={navigation}
        route={route}
        requestCameraPermission={requestCameraPermission}
      />,
    );

    const touchable = component.root.find((el) => el.props.testID === 'qr-code-scanner');
    touchable.props.onScan(token);

    expect(params.onScan).toHaveBeenCalledTimes(1);
    expect(params.onScan).toHaveBeenCalledWith(token);
  });

  it('should handle focus', () => {
    const {Component: QRCode} = require('./qr-code');
    const requestCameraPermission = jest.fn((t, cb) => {
      cb();
    });
    const params = createParams();
    const {route, ...navigation} = createNavigation({
      params,
    });
    const component = renderer.create(
      <QRCode
        navigation={navigation}
        route={route}
        requestCameraPermission={requestCameraPermission}
      />,
    );

    component.unmount();

    expect(requestCameraPermission).toHaveBeenCalledTimes(1);
    expect(navigation.goBack).toHaveBeenCalledTimes(1);
    expect(requestCameraPermission).toHaveBeenCalledWith(
      translations.permissionCamera,
      expect.any(Function),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
