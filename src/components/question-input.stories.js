// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {QUESTION_CHOICE_INPUT_TYPE} from '../const';
import {createSelectChoice} from '../__fixtures__/question-choices';
import {handleFakePress} from '../utils/tests';
import QuestionInput from './question-input';

const select = createSelectChoice({name: 'sel456'});

storiesOf('QuestionInput', module)
  .add('Text', () => (
    <QuestionInput type={QUESTION_CHOICE_INPUT_TYPE.TEXT} onChange={handleFakePress} />
  ))
  .add('Text (not empty)', () => (
    <QuestionInput
      type={QUESTION_CHOICE_INPUT_TYPE.TEXT}
      value="Foo bar baz"
      onChange={handleFakePress}
    />
  ))
  .add('Text (disabled)', () => (
    <QuestionInput type={QUESTION_CHOICE_INPUT_TYPE.TEXT} onChange={handleFakePress} isDisabled />
  ))
  .add('Input (full width)', () => (
    <QuestionInput
      type={QUESTION_CHOICE_INPUT_TYPE.TEXT}
      items={select.items}
      onChange={handleFakePress}
      fullWitdh
    />
  ))
  .add('Select', () => (
    <QuestionInput
      type={QUESTION_CHOICE_INPUT_TYPE.SELECT}
      items={select.items}
      onChange={handleFakePress}
    />
  ))
  .add('Select (not empty)', () => (
    <QuestionInput
      type={QUESTION_CHOICE_INPUT_TYPE.SELECT}
      items={select.items}
      value={select.items && select.items[1] && select.items[1].text}
      onChange={handleFakePress}
    />
  ))
  .add('Select (disabled)', () => (
    <QuestionInput
      type={QUESTION_CHOICE_INPUT_TYPE.SELECT}
      items={select.items}
      onChange={handleFakePress}
      isDisabled
    />
  ))
  .add('Select (full width)', () => (
    <QuestionInput
      type={QUESTION_CHOICE_INPUT_TYPE.SELECT}
      items={select.items}
      onChange={handleFakePress}
      fullWitdh
    />
  ))
  .add('Not supported', () => (
    <QuestionInput
      // $FlowFixMe only for test
      type="Foobarbaz"
      items={select.items}
      onChange={handleFakePress}
      isDisabled
    />
  ));
