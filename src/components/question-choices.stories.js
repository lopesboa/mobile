// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {QUESTION_TYPE} from '../const';
import {choices, choicesWithImage} from '../__fixtures__/question-choices';
import {handleFakePress} from '../utils/tests';
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
      userChoices={answers}
      onItemPress={handleFakePress}
      onItemInputChange={handleFakePress}
    />
  ))
  .add('QCM Graphic', () => (
    <QuestionChoices
      type={QUESTION_TYPE.QCM_GRAPHIC}
      items={choicesWithImage.slice(0, 3)}
      userChoices={answers}
      onItemPress={handleFakePress}
      onItemInputChange={handleFakePress}
    />
  ))
  .add('Template', () => (
    <QuestionChoices
      type={QUESTION_TYPE.TEMPLATE}
      template={template}
      items={templateItems}
      userChoices={templateUserChoices}
      onItemPress={handleFakePress}
      onItemInputChange={handleFakePress}
    />
  ))
  .add('Template (empty)', () => (
    <QuestionChoices
      type={QUESTION_TYPE.TEMPLATE}
      items={[]}
      userChoices={[]}
      onItemPress={handleFakePress}
      onItemInputChange={handleFakePress}
    />
  ))
  .add('QCM Drag', () => (
    <QuestionChoices
      isDisabled={false}
      userChoices={answers}
      type={QUESTION_TYPE.DRAG_DROP}
      items={choices}
      onItemPress={handleFakePress}
      onItemInputChange={handleFakePress}
    />
  ))
  .add('Unsupported question type', () => (
    <QuestionChoices
      // $FlowFixMe  only for testing purpose
      type="SomethingElse"
      items={choices}
      userChoices={answers}
      onItemPress={handleFakePress}
      onItemInputChange={handleFakePress}
    />
  ));

if (process.env.NODE_ENV === 'test') {
  describe('QuestionChoices', () => {
    it('should handle onItemPress callback', () => {
      const handleItemPress = jest.fn();
      const component = renderer.create(
        <QuestionChoices
          type={QUESTION_TYPE.QCM}
          items={choices}
          userChoices={answers}
          onItemPress={handleItemPress}
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
        <QuestionChoices
          type={QUESTION_TYPE.TEMPLATE}
          template={template}
          items={templateItems}
          userChoices={templateUserChoices}
          onItemPress={handleFakePress}
          onItemInputChange={handleItemInputChange}
        />
      );
      const questionInput = component.root.find(el => el.props.testID === 'question-part-2');
      questionInput.props.onChange('Foobarbaz');
      expect(handleItemInputChange.mock.calls.length).toBe(1);
      expect(handleItemInputChange.mock.calls[0]).toEqual([templateItems[0], 'Foobarbaz']);
    });
  });
}
