// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {createAnswer} from '../__fixtures__/answers';
import DeckCardCorrection from './deck-card-correction';

const question = 'Where is Waldo ?';
const answers = createAnswer({});

storiesOf('DeckCardCorrection', module)
  .add('Default', () => (
    <DeckCardCorrection
      question={question}
      answers={answers}
      userAnswers={answers}
      isCorrect={false}
    />
  ))
  .add('Correct answer', () => (
    <DeckCardCorrection question={question} answers={answers} userAnswers={answers} isCorrect />
  ))
  .add('With plenty of users answers ', () => {
    const plentyOfUserAnswers = answers.concat(answers);

    return (
      <DeckCardCorrection
        question={question}
        answers={answers}
        userAnswers={plentyOfUserAnswers}
        isCorrect
      />
    );
  })
  .add('With one expected answer', () => (
    <DeckCardCorrection
      question={question}
      answers={[answers[0]]}
      userAnswers={[answers[0]]}
      isCorrect
    />
  ));
