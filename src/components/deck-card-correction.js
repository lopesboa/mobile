// @flow strict

import {StyleSheet, View} from 'react-native';
import * as React from 'react';

import theme from '../modules/theme';
import translations from '../translations';
import Text from './text';
import Html from './html';
import Space from './space';

type Props = {|
  question: string,
  userAnswers: Array<string>,
  answers: Array<string>,
  isCorrect: boolean
|};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  text: {
    color: theme.colors.gray.dark,
    fontSize: theme.fontSize.regular,
    fontWeight: theme.fontWeight.regular
  },
  correctAnswer: {
    color: theme.colors.positive,
    fontWeight: theme.fontWeight.bold
  },
  userAnswer: {
    fontWeight: theme.fontWeight.bold
  }
});

const DeckCardCorrection = ({question, userAnswers, answers, isCorrect}: Props) => (
  <View style={styles.container}>
    <Html fontSize={theme.fontSize.regular} style={styles.text}>
      {question}
    </Html>
    <Space type="tiny" />
    {answers.map((answer, index) => (
      <Html
        fontSize={theme.fontSize.regular}
        style={[styles.text, styles.correctAnswer]}
        key={`answer-${index}`}
      >
        {answer}
      </Html>
    ))}
    <Space type="base" />
    <Text style={[styles.text, styles.userAnswer]}>
      {userAnswers.length > 1 ? translations.yourAnswers : translations.yourAnswer}
    </Text>
    <Space type="tiny" />
    {userAnswers.map((userAnswer, index) => (
      <Html fontSize={theme.fontSize.regular} style={styles.text} key={`user-answer-${index}`}>
        {userAnswer}
      </Html>
    ))}
  </View>
);

export default DeckCardCorrection;
