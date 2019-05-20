// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import {View} from 'react-native';
import image from '../__fixtures__/assets/landscape-1.jpg';
import portrait7 from '../__fixtures__/assets/portrait-7-with-text.jpg';
import ImageGradient from './image-gradient';

storiesOf('Image Gradient', module)
  .add('Default', () => (
    <ImageGradient testID="image-gradient" image={image} minHeight={250}>
      <View />
    </ImageGradient>
  ))
  .add('Custom Gradient', () => (
    <ImageGradient
      testID="image-gradient"
      gradient={[
        'rgba(0, 0,155, 0.8)',
        'rgba(155, 0,0, 0)',
        'rgba(155, 0,0, 0)',
        'rgba(0, 0,155, 0.8)'
      ]}
      image={image}
      minHeight={250}
    >
      <View />
    </ImageGradient>
  ))
  .add('Extrem Gradient', () => (
    <ImageGradient testID="image-gradient" image={portrait7} minHeight={250}>
      <View />
    </ImageGradient>
  ));
