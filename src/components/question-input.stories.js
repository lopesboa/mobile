// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import renderer from 'react-test-renderer';
import {ANALYTICS_EVENT_TYPE, QUESTION_CHOICE_INPUT_TYPE} from '../const';
import {createSelectChoice} from '../__fixtures__/question-choices';
import {createFakeAnalytics, handleFakePress} from '../utils/tests';
import {__TEST__} from '../modules/environment';
import {Component as QuestionInput} from './question-input';

const select = createSelectChoice({name: 'sel456'});

storiesOf('QuestionInput', module)
  .add('Text', () => (
    <QuestionInput
      questionType="template"
      type={QUESTION_CHOICE_INPUT_TYPE.TEXT}
      onChange={handleFakePress}
    />
  ))
  .add('Text (not empty)', () => (
    <QuestionInput
      questionType="template"
      type={QUESTION_CHOICE_INPUT_TYPE.TEXT}
      value="Foo bar baz"
      onChange={handleFakePress}
    />
  ))
  .add('Text (disabled)', () => (
    <QuestionInput
      questionType="template"
      type={QUESTION_CHOICE_INPUT_TYPE.TEXT}
      onChange={handleFakePress}
      isDisabled
    />
  ))
  .add('Input (full width)', () => (
    <QuestionInput
      questionType="template"
      type={QUESTION_CHOICE_INPUT_TYPE.TEXT}
      items={select.items}
      onChange={handleFakePress}
      fullWitdh
    />
  ))
  .add('Select', () => (
    <QuestionInput
      questionType="template"
      type={QUESTION_CHOICE_INPUT_TYPE.SELECT}
      items={select.items}
      onChange={handleFakePress}
    />
  ))
  .add('Select (not empty)', () => (
    <QuestionInput
      questionType="template"
      type={QUESTION_CHOICE_INPUT_TYPE.SELECT}
      items={select.items}
      value={select.items && select.items[1] && select.items[1].text}
      onChange={handleFakePress}
    />
  ))
  .add('Select (disabled)', () => (
    <QuestionInput
      questionType="template"
      type={QUESTION_CHOICE_INPUT_TYPE.SELECT}
      items={select.items}
      onChange={handleFakePress}
      isDisabled
    />
  ))
  .add('Select (full width)', () => (
    <QuestionInput
      questionType="template"
      type={QUESTION_CHOICE_INPUT_TYPE.SELECT}
      items={select.items}
      onChange={handleFakePress}
      fullWitdh
    />
  ))
  .add('Not supported', () => (
    <QuestionInput
      questionType="template"
      // $FlowFixMe only for test
      type="Foobarbaz"
      items={select.items}
      onChange={handleFakePress}
      isDisabled
    />
  ));

if (__TEST__) {
  describe('Select tracking', () => {
    it('should track handleFocus', () => {
      const analytics = createFakeAnalytics();

      const component = renderer.create(
        <QuestionInput
          analytics={analytics}
          questionType="template"
          type={QUESTION_CHOICE_INPUT_TYPE.TEXT}
          onChange={handleFakePress}
        />
      );

      const item = component.root.find(el => el.props.testID === 'question-input-text');
      item.props.onFocus();

      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.INPUT_FOCUS, {
        id: 'question-input-text',
        questionType: 'template'
      });
    });

    it('should track handleBlur', () => {
      const analytics = createFakeAnalytics();

      const component = renderer.create(
        <QuestionInput
          analytics={analytics}
          questionType="template"
          type={QUESTION_CHOICE_INPUT_TYPE.TEXT}
          onChange={handleFakePress}
        />
      );

      const item = component.root.find(el => el.props.testID === 'question-input-text');
      item.props.onBlur();

      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.INPUT_BLUR, {
        id: 'question-input-text',
        questionType: 'template'
      });
    });
  });
}
