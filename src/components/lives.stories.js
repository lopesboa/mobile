// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {__TEST__} from '../modules/environment';
import {Component as Lives} from './lives';

const HEIGHT = 180;

storiesOf('Lives', module)
  .add('Default', () => <Lives height={HEIGHT} isDarkModeActivated={false} />)
  .add('With value', () => <Lives count={3} height={HEIGHT} isDarkModeActivated />)
  .add('Bigger height', () => <Lives count={3} height={HEIGHT * 2} isDarkModeActivated />)
  .add('God mode', () => (
    <Lives count={3} height={HEIGHT} isGodModeEnabled isDarkModeActivated={false} />
  ))
  .add('Fast slide', () => (
    <Lives count={3} height={HEIGHT} isFastSlideEnabled isDarkModeActivated={false} />
  ))
  .add('God mode + fast slide', () => (
    <Lives count={3} height={HEIGHT} isGodModeEnabled isFastSlideEnabled isDarkModeActivated />
  ))
  .add('Losing life', () => (
    <Lives animationDirection="bottom" count={3} height={HEIGHT} isDarkModeActivated={false} />
  ))
  .add('Winning life', () => (
    <Lives animationDirection="top" count={3} height={HEIGHT} isDarkModeActivated={false} />
  ));

if (__TEST__) {
  describe('Lives', () => {
    it('should handle update', () => {
      const handleAnimate = jest.fn();
      const component = renderer.create(
        <Lives
          animationDirection="bottom"
          count={2}
          height={HEIGHT}
          onAnimate={handleAnimate}
          isDarkModeActivated={false}
        />
      );

      const broken = component.root.find(el => el.props.testID === 'lives-2-broken');
      expect(broken).toBeDefined();
      expect(handleAnimate).toHaveBeenCalledTimes(1);
      expect(handleAnimate).toHaveBeenCalledWith('bottom');

      component.update(
        <Lives
          animationDirection="top"
          count={2}
          height={HEIGHT}
          onAnimate={handleAnimate}
          isDarkModeActivated={false}
        />
      );

      let notBroken = component.root.find(el => el.props.testID === 'lives-2');
      expect(notBroken).toBeDefined();
      expect(handleAnimate).toHaveBeenCalledTimes(2);
      expect(handleAnimate).toHaveBeenCalledWith('top');

      component.update(
        <Lives
          animationDirection="top"
          count={2}
          height={HEIGHT}
          onAnimate={handleAnimate}
          isDarkModeActivated={false}
        />
      );

      expect(handleAnimate).toHaveBeenCalledTimes(2);
    });
  });
}
