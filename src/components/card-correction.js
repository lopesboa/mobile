// @flow strict

import {StyleSheet, View} from 'react-native';
import * as React from 'react';

import theme from '../modules/theme';
import type {Answer} from '../types';
import translations from '../translations';
import Text from './text';
import Space from './space';

type Props = {|
  question: string,
  userAnswers: Array<Answer>,
  answers: Array<Answer>,
  isCorrect: boolean
|};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    color: theme.colors.gray.dark,
    fontSize: 15,
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

const CardCorrection = ({question, userAnswers, answers, isCorrect}: Props) => (
  <View style={styles.container}>
    <Text style={styles.text}>{question}</Text>
    <Space type="tiny" />
    {answers.map((answer, index) => (
      <Text style={[styles.text, styles.correctAnswer]} key={`answer-${index}`}>
        {answer}
      </Text>
    ))}
    <Space type="base" />
    <Text style={[styles.text, styles.userAnswer]}>
      {userAnswers.length > 1 ? translations.yourAnswers : translations.yourAnswer}
    </Text>
    <Space type="tiny" />
    {userAnswers.map((userAnswer, index) => (
      <Text style={styles.text} key={`user-answer-${index}`}>
        {userAnswer}
      </Text>
    ))}
  </View>
);

export default CardCorrection;
