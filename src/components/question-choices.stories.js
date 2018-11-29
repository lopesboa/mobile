// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import type {QuestionChoiceItem} from '../types';
import QuestionChoices from './question-choices';

const choices: Array<QuestionChoiceItem> = [
  {
    label: 'Option 1',
    value: 'ref_1',
  },
  {
    label: 'Option 2',
    value: 'ref_2',
  },
  {
    label: 'Option 3',
    value: 'ref_3',
    selected: true,
  },
  {
    label: 'Option 4',
    value: 'ref_4',
  },
];

// eslint-disable-next-line no-console
const handleClick = (item: QuestionChoiceItem) => console.log('Clicked', item);

storiesOf('QuestionChoices', module).add('QCM', () => (
  <QuestionChoices type="qcm" items={choices} onItemPress={handleClick} />
));
