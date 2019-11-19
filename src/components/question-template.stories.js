// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {createSelectChoice, createInputChoice} from '../__fixtures__/question-choices';
import {handleFakePress, TestContextProvider} from '../utils/tests';
import QuestionTemplate from './question-template';

const field1 = createInputChoice({name: 'inp1'});
const field2 = createSelectChoice({name: 'sel1'});
const field3 = createInputChoice({name: 'inp2'});
const field4 = createSelectChoice({name: 'sel2'});

export const template =
  'My app {{inp1}} <s> NOT on</s> {{sel1}}, but {{inp2}}   <i>is on</i> {{sel2}}';
export const items = [field1, field2, field3, field4];
export const userChoices = [
  '',
  '',
  'Waze',
  (field4.items && field4.items[1] && field4.items[1].text) || ''
];

storiesOf('QuestionTemplate', module)
  .add('Default', () => (
    <TestContextProvider>
      <QuestionTemplate
        template={template}
        items={items}
        userChoices={userChoices}
        onInputChange={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Disabled', () => (
    <TestContextProvider>
      <QuestionTemplate
        isDisabled
        template={template}
        items={items}
        userChoices={userChoices}
        onInputChange={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Incorrect items', () => (
    <TestContextProvider>
      <QuestionTemplate
        template={template}
        items={[
          {...field1, name: 'inp123456789'},
          {...field2, type: undefined},
          {...field3, name: undefined}
        ]}
        userChoices={[]}
        onInputChange={handleFakePress}
      />
    </TestContextProvider>
  ));

export default {
  template,
  items,
  userChoices
};
