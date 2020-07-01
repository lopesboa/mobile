jest.mock('react-native-status-bar-height', () => ({
  getStatusBarHeight: jest.fn(() => 42),
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

  afterEach(() => {
    jest.resetAllMocks();
  });
});
