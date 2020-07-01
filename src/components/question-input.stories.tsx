import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import renderer from 'react-test-renderer';
import {ANALYTICS_EVENT_TYPE, QUESTION_TYPE, QUESTION_CHOICE_INPUT_TYPE} from '../const';
import {createSelectChoice} from '../__fixtures__/question-choices';
import {createFakeAnalytics, handleFakePress, TestContextProvider} from '../utils/tests';
import {__TEST__} from '../modules/environment';
import {Component as QuestionInput} from './question-input';

const select = createSelectChoice({name: 'sel456'});

storiesOf('QuestionInput', module)
  .add('Text', () => (
    <QuestionInput
      questionType={QUESTION_TYPE.TEMPLATE}
      type={QUESTION_CHOICE_INPUT_TYPE.TEXT}
      onChange={handleFakePress}
      id="foo"
    />
  ))
  .add('Text (not empty)', () => (
    <QuestionInput
      questionType={QUESTION_TYPE.TEMPLATE}
      type={QUESTION_CHOICE_INPUT_TYPE.TEXT}
      value="Foo bar baz"
      onChange={handleFakePress}
      id="foo"
    />
  ))
  .add('Text (disabled)', () => (
    <QuestionInput
      questionType={QUESTION_TYPE.TEMPLATE}
      type={QUESTION_CHOICE_INPUT_TYPE.TEXT}
      onChange={handleFakePress}
      isDisabled
      id="foo"
    />
  ))
  .add('Input (full width)', () => (
    <QuestionInput
      questionType={QUESTION_TYPE.TEMPLATE}
      type={QUESTION_CHOICE_INPUT_TYPE.TEXT}
      items={select.items}
      onChange={handleFakePress}
      fullWitdh
      id="foo"
    />
  ))
  .add('Select', () => (
    <TestContextProvider>
      <QuestionInput
        questionType={QUESTION_TYPE.TEMPLATE}
        type={QUESTION_CHOICE_INPUT_TYPE.SELECT}
        items={select.items}
        onChange={handleFakePress}
        id="foo"
      />
    </TestContextProvider>
  ))
  .add('Select (not empty)', () => (
    <TestContextProvider>
      <QuestionInput
        questionType={QUESTION_TYPE.TEMPLATE}
        type={QUESTION_CHOICE_INPUT_TYPE.SELECT}
        items={select.items}
        value={select.items && select.items[1] && select.items[1].text}
        onChange={handleFakePress}
        id="foo"
      />
    </TestContextProvider>
  ))
  .add('Select (disabled)', () => (
    <TestContextProvider>
      <QuestionInput
        questionType={QUESTION_TYPE.TEMPLATE}
        type={QUESTION_CHOICE_INPUT_TYPE.SELECT}
        items={select.items}
        onChange={handleFakePress}
        isDisabled
        id="foo"
      />
    </TestContextProvider>
  ))
  .add('Select (full width)', () => (
    <TestContextProvider>
      <QuestionInput
        questionType={QUESTION_TYPE.TEMPLATE}
        type={QUESTION_CHOICE_INPUT_TYPE.SELECT}
        items={select.items}
        onChange={handleFakePress}
        fullWitdh
        id="foo"
      />
    </TestContextProvider>
  ))
  .add('Not supported', () => (
    <QuestionInput
      questionType={QUESTION_TYPE.TEMPLATE}
      // @ts-ignore only for test
      type="Foobarbaz"
      items={select.items}
      onChange={handleFakePress}
      isDisabled
      id="foo"
    />
  ));

if (__TEST__) {
  describe('QuestionInput', () => {
    it('should handle focus', () => {
      const analytics = createFakeAnalytics();
      const questionType = QUESTION_TYPE.TEMPLATE;

      const component = renderer.create(
        <QuestionInput
          analytics={analytics}
          questionType={questionType}
          type={QUESTION_CHOICE_INPUT_TYPE.TEXT}
          onChange={handleFakePress}
          id="foo"
        />,
      );

      const item = component.root.find((el) => el.props.testID === 'question-input-text');
      item.props.onFocus();

      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.INPUT_FOCUS, {
        id: 'question-input-text',
        questionType,
      });
    });

    it('should handle blur', () => {
      const analytics = createFakeAnalytics();
      const questionType = QUESTION_TYPE.TEMPLATE;

      const component = renderer.create(
        <QuestionInput
          analytics={analytics}
          questionType={questionType}
          type={QUESTION_CHOICE_INPUT_TYPE.TEXT}
          onChange={handleFakePress}
          id="foo"
        />,
      );

      const item = component.root.find((el) => el.props.testID === 'question-input-text');
      item.props.onBlur();

      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.INPUT_BLUR, {
        id: 'question-input-text',
        questionType,
      });
    });
  });
}
