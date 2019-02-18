// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {QUESTION_TYPE} from '../const';
import {choices, choicesWithImage} from '../__fixtures__/question-choices';
import {answers} from '../__fixtures__/answers';
import {handleFakePress} from '../utils/tests';
import QuestionChoices from './question-choices';

storiesOf('QuestionChoices', module)
  .add('QCM', () => (
    <QuestionChoices
      type={QUESTION_TYPE.QCM}
      isDisabled={false}
      items={choices}
      userChoices={answers}
      onItemPress={handleFakePress}
    />
  ))
  .add('QCM Graphic', () => (
    <QuestionChoices
      isDisabled={false}
      userChoices={answers}
      type={QUESTION_TYPE.QCM_GRAPHIC}
      items={choicesWithImage.slice(0, 3)}
      onItemPress={handleFakePress}
    />
  ))
  .add('Unsupported question type', () => (
    <QuestionChoices
      // $FlowFixMe its only to test
      type="SomethingElse"
      isDisabled={false}
      items={choices}
      userChoices={answers}
      onItemPress={handleFakePress}
    />
  ));

if (process.env.NODE_ENV === 'test') {
  describe('QuestionChoices', () => {
    it('should handle onItemPress callback', () => {
      const handleItemPress = jest.fn();
      const component = renderer.create(
        <QuestionChoices
          type={QUESTION_TYPE.QCM}
          isDisabled={false}
          items={choices}
          userChoices={answers}
          onItemPress={handleItemPress}
        />
      );
      const questionChoice = component.root.find(el => el.props.testID === 'question-choice-1');
      questionChoice.props.onPress();
      expect(handleItemPress.mock.calls.length).toBe(1);
      expect(handleItemPress.mock.calls[0]).toEqual([choices[0]]);
    });
  });
}
