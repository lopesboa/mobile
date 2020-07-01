import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {__TEST__} from '../modules/environment';
import Lives from './lives';

const HEIGHT = 180;

storiesOf('Lives', module)
  .add('Default', () => <Lives height={HEIGHT} />)
  .add('With value', () => <Lives count={3} height={HEIGHT} />)
  .add('Bigger height', () => <Lives count={3} height={HEIGHT * 2} />)
  .add('God mode', () => <Lives count={3} height={HEIGHT} isGodModeEnabled />)
  .add('Fast slide', () => <Lives count={3} height={HEIGHT} isFastSlideEnabled />)
  .add('God mode + fast slide', () => (
    <Lives count={3} height={HEIGHT} isGodModeEnabled isFastSlideEnabled />
  ))
  .add('Losing life', () => <Lives animationDirection="bottom" count={3} height={HEIGHT} />)
  .add('Winning life', () => <Lives animationDirection="top" count={3} height={HEIGHT} />);

if (__TEST__) {
  describe('Lives', () => {
    it('should handle update', () => {
      const handleAnimate = jest.fn();
      const component = renderer.create(
        <Lives animationDirection="bottom" count={2} height={HEIGHT} onAnimate={handleAnimate} />,
      );

      const broken = component.root.find((el) => el.props.testID === 'lives-2-broken');
      expect(broken).toBeDefined();
      expect(handleAnimate).toHaveBeenCalledTimes(1);
      expect(handleAnimate).toHaveBeenCalledWith('bottom');

      component.update(
        <Lives animationDirection="top" count={2} height={HEIGHT} onAnimate={handleAnimate} />,
      );

      const notBroken = component.root.find((el) => el.props.testID === 'lives-2');
      expect(notBroken).toBeDefined();
      expect(handleAnimate).toHaveBeenCalledTimes(2);
      expect(handleAnimate).toHaveBeenCalledWith('top');

      component.update(
        <Lives animationDirection="top" count={2} height={HEIGHT} onAnimate={handleAnimate} />,
      );

      expect(handleAnimate).toHaveBeenCalledTimes(2);
    });
  });
}
