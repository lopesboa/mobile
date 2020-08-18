import * as React from 'react';
import renderer from 'react-test-renderer';
import {View} from 'react-native';
import {withBackHandler, useBackHandler} from './with-backhandler';

class DummyComponent extends React.Component {
  static handleBackPress = (navigation): boolean => {
    navigation.goBack();
    return true;
  };

  render() {
    return <View />;
  }
}

const DummyComponentFC = () => {
  function handleBackPress(navigation): boolean {
    navigation.goBack();
    return true;
  }
  useBackHandler(handleBackPress);
  return <View />;
};

describe('Back Handler', () => {
  it('should handle system back button press (useBackHandler)', () => {
    const {BackHandler} = require('react-native');
    renderer.create(<DummyComponentFC />);
    expect(BackHandler.addEventListener).toHaveBeenCalledTimes(1);
  });

  it('should handle system back button press (withBackHandler)', () => {
    const {BackHandler} = require('react-native');
    const DummyComp = withBackHandler(DummyComponent, DummyComponent.handleBackPress);
    renderer.create(<DummyComp />);
    expect(BackHandler.addEventListener).toHaveBeenCalledTimes(2);
  });
});
