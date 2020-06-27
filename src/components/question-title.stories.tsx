import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import QuestionTitle from './question-title';

storiesOf('QuestionTitle', module).add('Default', () => (
  <QuestionTitle>What was the nationality of Steve Jobs?</QuestionTitle>
));
