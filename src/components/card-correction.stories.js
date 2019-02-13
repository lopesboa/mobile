// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {answers} from '../__fixtures__/answers';
import CardCorrection from './card-correction';

const question = 'Where is Waldo ?';

storiesOf('CardCorrection', module)
  .add('Default', () => (
    <CardCorrection question={question} answers={answers} userAnswers={answers} isCorrect={false} />
  ))
  .add('Correct answer', () => (
    <CardCorrection question={question} answers={answers} userAnswers={answers} isCorrect />
  ))
  .add('With plenty of users answers ', () => {
    const plentyOfUserAnswers = answers.concat(answers);

    return (
      <CardCorrection
        question={question}
        answers={answers}
        userAnswers={plentyOfUserAnswers}
        isCorrect
      />
    );
  })
  .add('With one expected answer', () => (
    <CardCorrection
      question={question}
      answers={[answers[0]]}
      userAnswers={[answers[0]]}
      isCorrect
    />
  ));
