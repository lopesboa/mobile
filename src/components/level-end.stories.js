// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import LevelEnd from './level-end';

storiesOf('LevelEnd', module)
  .add('Error', () => <LevelEnd isSuccess={false} onButtonPress={handleFakePress} />)
  .add('Success', () => <LevelEnd isSuccess onButtonPress={handleFakePress} />);
