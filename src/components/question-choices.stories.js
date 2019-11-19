// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {__TEST__} from '../modules/environment';
import {QUESTION_TYPE} from '../const';
import {choices, choicesWithImage} from '../__fixtures__/question-choices';
import {handleFakePress, TestContextProvider} from '../utils/tests';
import QuestionChoices from './question-choices';
import {
  template,
  items as templateItems,
  userChoices as templateUserChoices
} from './question-template.stories';

const answers = choices.filter((choice, index) => index === 1).map(choice => choice.label);

storiesOf('QuestionChoices', module)
  .add('QCM', () => (
    <QuestionChoices
      type={QUESTION_TYPE.QCM}
      items={choices}
      onInputValueChange={handleFakePress}
      userChoices={answers}
      onItemPress={handleFakePress}
      onSliderChange={handleFakePress}
      onItemInputChange={handleFakePress}
    />
  ))
  .add('QCM Graphic', () => (
    <TestContextProvider>
      <QuestionChoices
        type={QUESTION_TYPE.QCM_GRAPHIC}
        items={choicesWithImage.slice(0, 3)}
        onInputValueChange={handleFakePress}
        userChoices={answers}
        onItemPress={handleFakePress}
        onItemInputChange={handleFakePress}
        onSliderChange={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Template', () => (
    <TestContextProvider>
      <QuestionChoices
        type={QUESTION_TYPE.TEMPLATE}
        template={template}
        onInputValueChange={handleFakePress}
        items={templateItems}
        userChoices={templateUserChoices}
        onItemPress={handleFakePress}
        onSliderChange={handleFakePress}
        onItemInputChange={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Template (empty)', () => (
    <QuestionChoices
      type={QUESTION_TYPE.TEMPLATE}
      onInputValueChange={handleFakePress}
      items={[]}
      userChoices={[]}
      onItemPress={handleFakePress}
      onItemInputChange={handleFakePress}
      onSliderChange={handleFakePress}
    />
  ))
  .add('Slider', () => (
    <QuestionChoices
      // $FlowFixMe its only to test
      type="slider"
      isDisabled={false}
      items={choices}
      userChoices={answers}
      onItemPress={handleFakePress}
      onSliderChange={handleFakePress}
      min={0}
      max={20}
      unit="°C"
      value={8}
      step={2}
      onItemInputChange={handleFakePress}
      onInputValueChange={handleFakePress}
    />
  ))
  .add('Slider (empty)', () => (
    <QuestionChoices
      // $FlowFixMe its only to test
      type="slider"
      isDisabled={false}
      items={choices}
      userChoices={answers}
      onItemPress={handleFakePress}
      onSliderChange={handleFakePress}
      value={8}
      step={2}
      onItemInputChange={handleFakePress}
      onInputValueChange={handleFakePress}
    />
  ))
  .add('QCM Drag', () => (
    <QuestionChoices
      isDisabled={false}
      onInputValueChange={handleFakePress}
      userChoices={answers}
      type={QUESTION_TYPE.DRAG_DROP}
      items={choices}
      onItemPress={handleFakePress}
      onItemInputChange={handleFakePress}
      onSliderChange={handleFakePress}
    />
  ))
  .add('QCM Basic', () => (
    <QuestionChoices
      isDisabled={false}
      onInputValueChange={handleFakePress}
      userChoices={answers}
      type={QUESTION_TYPE.BASIC}
      items={choices}
      onItemPress={handleFakePress}
      onItemInputChange={handleFakePress}
      onSliderChange={handleFakePress}
    />
  ))
  .add('Unsupported question type', () => (
    <QuestionChoices
      // $FlowFixMe  only for testing purpose
      type="SomethingElse"
      items={choices}
      onInputValueChange={handleFakePress}
      userChoices={answers}
      onItemPress={handleFakePress}
      onSliderChange={handleFakePress}
      onItemInputChange={handleFakePress}
    />
  ));

if (__TEST__) {
  describe('QuestionChoices', () => {
    it('should handle onItemPress callback', () => {
      const handleItemPress = jest.fn();
      const component = renderer.create(
        <QuestionChoices
          type={QUESTION_TYPE.QCM}
          onInputValueChange={handleFakePress}
          items={choices}
          userChoices={answers}
          onItemPress={handleItemPress}
          onSliderChange={handleFakePress}
          onItemInputChange={handleFakePress}
        />
      );
      const questionChoice = component.root.find(el => el.props.testID === 'question-choice-1');
      questionChoice.props.onPress();
      expect(handleItemPress.mock.calls.length).toBe(1);
      expect(handleItemPress.mock.calls[0]).toEqual([choices[0]]);
    });

    it('should handle onItemInputChange callback', () => {
      const handleItemInputChange = jest.fn();
      const component = renderer.create(
        <TestContextProvider>
          <QuestionChoices
            type={QUESTION_TYPE.TEMPLATE}
            onInputValueChange={handleFakePress}
            template={template}
            items={templateItems}
            userChoices={templateUserChoices}
            onItemPress={handleFakePress}
            onItemInputChange={handleItemInputChange}
            onSliderChange={handleFakePress}
          />
        </TestContextProvider>
      );
      const questionInput = component.root.find(el => el.props.testID === 'question-part-2');
      questionInput.props.onChange('Foobarbaz');
      expect(handleItemInputChange.mock.calls.length).toBe(1);
      expect(handleItemInputChange.mock.calls[0]).toEqual([templateItems[0], 'Foobarbaz']);
    });

    it('should handle onInputValueChange callback', () => {
      const onInputValueChange = jest.fn();
      const component = renderer.create(
        <QuestionChoices
          type={QUESTION_TYPE.BASIC}
          onInputValueChange={onInputValueChange}
          template={template}
          items={templateItems}
          userChoices={templateUserChoices}
          onItemPress={handleFakePress}
          onItemInputChange={handleFakePress}
          onSliderChange={handleFakePress}
        />
      );
      const questionInput = component.root.find(el => el.props.testID === 'question-input-text');

      questionInput.props.onChangeText();
      expect(onInputValueChange.mock.calls.length).toBe(1);
    });
  });
}
