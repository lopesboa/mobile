// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import LevelEnd from './level-end';

// eslint-disable-next-line no-console
const handleButtonPress = () => console.log('Clicked');

storiesOf('LevelEnd', module)
  .add('Error', () => <LevelEnd isCorrect={false} onButtonPress={handleButtonPress} />)
  .add('Success', () => <LevelEnd isCorrect onButtonPress={handleButtonPress} />);
