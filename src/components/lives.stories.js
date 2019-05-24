// @flow

import * as React from 'react';
import {Animated} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import Lives from './lives';

const textTranslate = new Animated.Value(0);
Animated.timing(textTranslate, {toValue: 0, duration: 0});
const textTranslateY = textTranslate.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 1]
});

storiesOf('Lives', module)
  .add('Default', () => <Lives winningLife={false} count={3} height={60} isGodMode={false} />)
  .add('Broken', () => (
    <Lives winningLife={false} count={2} isBroken height={60} isGodMode={false} />
  ))
  .add('Bigger height', () => (
    <Lives winningLife={false} count={3} height={120} isGodMode={false} />
  ))
  .add('God mode', () => <Lives winningLife={false} count={3} height={120} isGodMode />)
  .add('Winning life', () => <Lives winningLife count={3} height={120} isGodMode />)
  .add('Losing life', () => <Lives winningLife={false} count={3} height={120} isGodMode />)
  .add('with text translate interpolation', () => (
    <Lives textTranslateY={textTranslateY} winningLife={false} count={3} height={120} isGodMode />
  ));
