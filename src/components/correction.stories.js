// @flow

import * as React from 'react';
import {View, Dimensions} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import {answers} from '../__fixtures__/answers';
import type {Layout} from '../containers/with-layout';
import {handleFakePress} from '../utils/tests';
import {Component as Correction} from './correction';

// eslint-disable-next-line no-console

const question = 'Where is Waldo ?';

const window = Dimensions.get('window');
const fakeLayout: Layout = {
  width: window.width,
  height: window.height - 60
};

storiesOf('Correction', module)
  .add('Bad answer', () => (
    <View style={fakeLayout}>
      <Correction
        answers={answers}
        userAnswers={answers.concat(['Anything else'])}
        tip={
          "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you"
        }
        isCorrect={false}
        title="Oops..."
        onButtonPress={handleFakePress}
        question={question}
        subtitle="Bad Answer"
        keyPoint="The KEY POINT"
        layout={fakeLayout}
        isFinished={false}
        lives={3}
      />
    </View>
  ))
  .add('Good answer', () => (
    <View style={fakeLayout}>
      <Correction
        answers={answers}
        userAnswers={answers}
        tip={
          "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
        }
        title="Good job!"
        isCorrect
        onButtonPress={handleFakePress}
        question={question}
        subtitle="Good Answer"
        keyPoint="The KEY POINT"
        layout={fakeLayout}
        isFinished={false}
        lives={2}
      />
    </View>
  ))
  .add('With plenty of user answers and questions', () => {
    const plentyOfUserAnswers = answers.concat(answers);
    return (
      <View style={fakeLayout}>
        <Correction
          answers={answers}
          userAnswers={plentyOfUserAnswers}
          tip={
            "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
          }
          title="Oops..."
          isCorrect={false}
          onButtonPress={handleFakePress}
          question={question}
          subtitle="Bad Answer"
          keyPoint="The KEY POINT"
          layout={fakeLayout}
          isFinished={false}
          lives={2}
        />
      </View>
    );
  })
  .add('With only one answer', () => (
    <View style={fakeLayout}>
      <Correction
        answers={[answers[0]]}
        userAnswers={[answers[0]]}
        tip={
          "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
        }
        title="Good job!"
        isCorrect
        onButtonPress={handleFakePress}
        question={question}
        subtitle="Good Answer"
        keyPoint="The KEY POINT"
        layout={fakeLayout}
        isFinished={false}
        lives={3}
      />
    </View>
  ))
  .add('Last bad answer', () => (
    <View style={fakeLayout}>
      <Correction
        answers={answers}
        userAnswers={answers.concat(['Anything else'])}
        tip={
          "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you"
        }
        isCorrect={false}
        title="Oops..."
        onButtonPress={handleFakePress}
        question={question}
        subtitle="Bad Answer"
        keyPoint="The KEY POINT"
        layout={fakeLayout}
        isFinished
        lives={0}
      />
    </View>
  ))
  .add('Last good answer', () => (
    <View style={fakeLayout}>
      <Correction
        answers={answers}
        userAnswers={answers}
        tip={
          "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
        }
        title="Good job!"
        isCorrect
        onButtonPress={handleFakePress}
        question={question}
        subtitle="Good Answer"
        keyPoint="The KEY POINT"
        layout={fakeLayout}
        isFinished
        lives={1}
      />
    </View>
  ))
  .add('Bad answer without lives', () => (
    <View style={fakeLayout}>
      <Correction
        answers={answers}
        userAnswers={answers.concat(['Anything else'])}
        tip={
          "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you"
        }
        isCorrect={false}
        title="Oops..."
        onButtonPress={handleFakePress}
        question={question}
        subtitle="Bad Answer"
        keyPoint="The KEY POINT"
        layout={fakeLayout}
        isFinished={false}
      />
    </View>
  ))
  .add('Good answer without lives', () => (
    <View style={fakeLayout}>
      <Correction
        answers={answers}
        userAnswers={answers}
        tip={
          "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
        }
        title="Good job!"
        isCorrect
        onButtonPress={handleFakePress}
        question={question}
        subtitle="Good Answer"
        keyPoint="The KEY POINT"
        layout={fakeLayout}
        isFinished={false}
      />
    </View>
  ))
  .add('Last good answer without lives', () => (
    <View style={fakeLayout}>
      <Correction
        answers={answers}
        userAnswers={answers}
        tip={
          "The greatest tip of your life after what daddy said yesterday : don't drink what a stranger has given to you without checking it on Wikipedia before"
        }
        title="Good job!"
        isCorrect
        onButtonPress={handleFakePress}
        question={question}
        subtitle="Good Answer"
        keyPoint="The KEY POINT"
        layout={fakeLayout}
        isFinished
      />
    </View>
  ));
