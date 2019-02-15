// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import {handleFakePress} from '../utils/tests';
import ClueFrontItem from './clue-front-item';

storiesOf('ClueFrontItem', module).add('Default', () => (
  <ClueFrontItem onPress={handleFakePress} starsDiff={2} />
));
