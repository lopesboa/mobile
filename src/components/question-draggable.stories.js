// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import type {Choice} from '@coorpacademy/progression-engine';
import renderer from 'react-test-renderer';

import {__TEST__} from '../modules/environment';
import {choices} from '../__fixtures__/question-choices';
import {handleFakePress} from '../utils/tests';
import QuestionDraggable, {extractSelectedChoices} from './question-draggable';

const upgradedChoices = [
  ...choices,
  {
    _id: '6666',
    label:
      'Hodor hodor. Hodor? Hodor hodor. Hodor? Hodor, hodor. Hodor. Hodor. Hodor? Hodor? Hodor, hodor. Hodor. Hodor. Hodor hodor HODOR! Hodor. Hodor! Hodor hodor. Hodor? Hodor hodor! Hodor... Hodor hodor. Hodor, hodor. Hodor. Hodor hodor. Hodor? Hodor! Hodor hodor',
    value: 'hodorHodr'
  }
];

const choicesWithoutValue = upgradedChoices.map(item => ({
  ...item,
  value: undefined
}));

const userChoices = upgradedChoices.slice(0, 2).map(item => item.label);

storiesOf('QuestionDraggable', module)
  .add('Default', () => (
    <QuestionDraggable
      choices={upgradedChoices}
      userChoices={userChoices}
      onPress={handleFakePress}
    />
  ))
  .add('With No SelectedChoics', () => (
    <QuestionDraggable
      choices={upgradedChoices}
      userChoices={userChoices}
      onPress={handleFakePress}
    />
  ))
  .add('With choice without value', () => (
    <QuestionDraggable
      choices={choicesWithoutValue}
      userChoices={userChoices}
      onPress={handleFakePress}
    />
  ));

if (__TEST__) {
  describe('QuestionDraggable', () => {
    it('should handle onItemPress callback', () => {
      const handleItemPress = jest.fn();
      const component = renderer.create(
        <QuestionDraggable userChoices={userChoices} choices={choices} onPress={handleItemPress} />
      );
      const questionItem = component.root.find(el => {
        return el.props.testID === `choice-4-unselected`;
      });
      questionItem.props.onPress();
      expect(handleItemPress.mock.calls.length).toBe(1);
      expect(handleItemPress.mock.calls[0]).toEqual([choices[3]]);
    });

    describe('extractSelectedChoices', () => {
      it('should return the selected choices ordered according to the given user choice order', () => {
        const label1 = 'bar baz';
        const label2 = 'foo bar';
        const label3 = 'toto tata';
        const label4 = 'foo bar baz';

        const choice1: Choice = {
          _id: '1',
          label: label1,
          value: 'barbaz'
        };

        const choice2: Choice = {
          _id: '2',
          label: label2,
          value: 'foobar'
        };

        const choice3: Choice = {
          _id: '3',
          label: label3,
          value: 'tototata'
        };

        const _userChoices = [label2, label1, label4];
        const _choices: Array<Choice> = [choice1, choice3, choice2];
        const expectedResult = [[choice2, choice1], [choice3]];
        const result = extractSelectedChoices(_choices, _userChoices);

        expect(result).toEqual(expectedResult);
      });
    });
  });
}
