import * as React from 'react';
import renderer from 'react-test-renderer';

import {createProgression} from '../__fixtures__/progression';
import {createNetworkState, createStoreState} from '../__fixtures__/store';
import translations from '../translations';
import theme from '../modules/theme';
import {ENGINE, CONTENT_TYPE} from '../const';
import type {ConnectedStateProps} from './connection-listener';

describe('ConnectionListener', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('mapStateToProps', () => {
    it('should get all props', () => {
      const {mapStateToProps} = require('./connection-listener');

      const isConnected = true;
      const progression = createProgression({
        engine: ENGINE.MICROLEARNING,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'foo',
        },
      });

      const mockedStore = createStoreState({
        levels: [],
        disciplines: [],
        chapters: [],
        slides: [],
        progression,
        network: createNetworkState({isConnected}),
      });

      const result = mapStateToProps(mockedStore);
      const expected: ConnectedStateProps = {
        isConnected,
      };

      expect(result).toEqual(expected);
    });
  });

  it('should not show in-app notification at mount', () => {
    const {showMessage} = require('react-native-flash-message');
    const {Component: ConnectionListener} = require('./connection-listener');

    renderer.create(<ConnectionListener isConnected={false} />);

    expect(showMessage).toHaveBeenCalledTimes(0);
  });

  it('should show in-app notification when connection has been lost', () => {
    const {showMessage} = require('react-native-flash-message');
    const {Component: ConnectionListener} = require('./connection-listener');

    const component = renderer.create(<ConnectionListener isConnected />);

    expect(showMessage).toHaveBeenCalledTimes(0);

    component.update(<ConnectionListener isConnected={false} />);

    expect(showMessage).toHaveBeenCalledTimes(1);
    expect(showMessage).toHaveBeenCalledWith({
      message: translations.connectionLost,
      backgroundColor: theme.colors.negative,
      titleStyle: expect.any(Object),
    });
  });

  it('should show in-app notification when connection has been restored', () => {
    const {showMessage} = require('react-native-flash-message');
    const {Component: ConnectionListener} = require('./connection-listener');

    const component = renderer.create(<ConnectionListener isConnected={false} />);

    expect(showMessage).toHaveBeenCalledTimes(0);

    component.update(<ConnectionListener isConnected />);

    expect(showMessage).toHaveBeenCalledTimes(1);
    expect(showMessage).toHaveBeenCalledWith({
      message: translations.connectionRestored,
      backgroundColor: theme.colors.positive,
      titleStyle: expect.any(Object),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
