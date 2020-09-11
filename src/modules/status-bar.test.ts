import {Platform} from 'react-native';

jest.mock('react-native-status-bar-height', () => ({
  getStatusBarHeight: jest.fn(() => 42),
  getHeaderHeight: jest.fn(() => 60),
}));

describe('StatusBar', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should return fake height', () => {
    jest.mock('./environment', () => ({
      __STORYBOOK__: true,
    }));
    const {getStatusBarHeight: _getStatusBarHeight} = require('react-native-status-bar-height');

    const {getStatusBarHeight} = require('./status-bar');

    const result = getStatusBarHeight();
    const expected = 0;
    expect(result).toEqual(expected);
    expect(_getStatusBarHeight).not.toHaveBeenCalled();
  });

  it('should return height provided by the lib', () => {
    jest.mock('./environment', () => ({
      __STORYBOOK__: false,
    }));
    const {getStatusBarHeight: _getStatusBarHeight} = require('react-native-status-bar-height');

    const {getStatusBarHeight} = require('./status-bar');

    const result = getStatusBarHeight();
    const expected = 42;
    expect(result).toEqual(expected);
    expect(_getStatusBarHeight).toHaveBeenCalled();
  });

  it('should return header height', () => {
    Platform.OS = 'android';

    jest.mock('./environment', () => ({
      __STORYBOOK__: false,
    }));
    const {getStatusBarHeight: _getStatusBarHeight} = require('react-native-status-bar-height');

    const {getHeaderHeight} = require('./status-bar');

    const result = getHeaderHeight();
    const expected = 60;
    expect(result).toEqual(expected);
    expect(_getStatusBarHeight).toHaveBeenCalledTimes(0);
  });

  it('should return header height + statusBarHeight on iOS', () => {
    Platform.OS = 'ios';

    jest.mock('./environment', () => ({
      __STORYBOOK__: false,
    }));

    const {getStatusBarHeight: _getStatusBarHeight} = require('react-native-status-bar-height');

    const {getHeaderHeight} = require('./status-bar');

    const result = getHeaderHeight();
    const expected = 60 + 42;
    expect(result).toEqual(expected);
    expect(_getStatusBarHeight).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
