// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import LevelEnd from './level-end';

storiesOf('LevelEnd', module)
  .add('Error', () => <LevelEnd isCorrect={false} onButtonPress={handleFakePress} />)
  .add('Success', () => <LevelEnd isCorrect onButtonPress={handleFakePress} />);
