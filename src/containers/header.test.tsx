import * as React from 'react';
import renderer from 'react-test-renderer';

import translations from '../translations';

jest.useFakeTimers();

describe('Header', () => {
  describe('onSearchToggle', () => {
    it('handles press event', () => {
      const {Component: Header} = require('./header');

      const fakeCallback = jest.fn();
      const onSearchPress = jest.fn();

      const component = renderer.create(
        <Header onSearchPress={onSearchPress} signOut={fakeCallback} height={42} />,
      );

      const header = component.root.find((el) => el.props.testID === 'header');
      header.props.onSearchPress();

      expect(onSearchPress).toHaveBeenCalledTimes(1);
    });
  });
  describe('onSettingsToggle', () => {
    it('handles press event', () => {
      const {Component: Header} = require('./header');

      const fakeCallback = jest.fn();
      const onSettingsPress = jest.fn();

      const component = renderer.create(
        <Header
          onSearchPress={fakeCallback}
          onSettingsPress={onSettingsPress}
          signOut={fakeCallback}
          height={42}
        />,
      );

      const header = component.root.find((el) => el.props.testID === 'header');
      header.props.onSettingsPress();

      expect(onSettingsPress).toHaveBeenCalledTimes(1);
    });
  });

  it('handles onLogoLongPress', () => {
    const {Alert} = require('react-native');
    const alert = jest.spyOn(Alert, 'alert');

    const {Component: Header} = require('./header');

    const fakeCallback = jest.fn();
    const signOut = jest.fn();

    const component = renderer.create(
      <Header signOut={signOut} onSearchPress={fakeCallback} height={42} />,
    );

    alert.mockImplementationOnce((title, message, buttons) => {
      expect(title).toEqual(translations.logOut);
      expect(message).toBeNil;
      expect(buttons).toEqual([
        {
          text: translations.cancel,
        },
        {
          text: translations.ok,
          onPress: expect.any(Function),
        },
      ]);

      const {onPress} = buttons[1];

      onPress();

      expect(signOut).toHaveBeenCalledTimes(1);
    });

    const header = component.root.find((el) => el.props.testID === 'header');
    header.props.onLogoLongPress();

    expect(alert).toHaveBeenCalledTimes(1);
  });
});
