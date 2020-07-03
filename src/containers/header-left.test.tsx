import * as React from 'react';
import renderer from 'react-test-renderer';
import {handleFakePress, createFakeVibration} from '../utils/tests';

describe('HeaderLeft', () => {
  it('should handle Android BackHandler', () => {
    const {Component: HeaderLeft} = require('./header-left');
    const {BackHandler} = require('../modules/back-handler');
    const component = renderer.create(
      <HeaderLeft vibration={createFakeVibration()} onPress={handleFakePress} />,
    );
    // simulate a press on button by calling the cb function
    BackHandler.addEventListener.mock.calls[0][1]();
    component.unmount();

    expect(BackHandler.addEventListener).toHaveBeenCalledTimes(1);
    expect(BackHandler.addEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function),
    );
    expect(BackHandler.removeEventListener).toHaveBeenCalledTimes(1);
    expect(BackHandler.removeEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function),
    );
  });
});
