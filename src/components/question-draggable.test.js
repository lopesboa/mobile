// @flow

import type {Choice} from '@coorpacademy/progression-engine';
import {extractSelectedChoices} from './question-draggable';

describe('question draggable test', () => {
  it('should return the selected choices ordered according to the given user choice order', () => {
    const label1 = 'bar baz';
    const label2 = 'foo bar';
    const label3 = 'toto tata';

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

    const userChoices = [label2, label1];

    const choices: Array<Choice> = [choice1, choice3, choice2];

    const expectedResult = [[choice2, choice1], [choice3]];

    const result = extractSelectedChoices(choices, userChoices);

    expect(result).toEqual(expectedResult);
  });
});
