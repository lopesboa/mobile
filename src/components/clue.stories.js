// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import Clue from './clue';

storiesOf('Clue', module).add('Default', () => (
  <Clue
    header="What is the online Apple application store called?"
    clue="This is a clue"
    slideId="sli_someId934"
    starsDiff={2}
    onPress={handleFakePress}
  />
));
