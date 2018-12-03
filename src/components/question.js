// @flow strict

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import type {QuestionChoiceItem, QuestionType} from '../types';
import theme from '../modules/theme';
import Text from './text';
import QuestionChoices from './question-choices';
import Space from './space';
import Button from './button';

type Props = {|
  type: QuestionType,
  question: string,
  explanation: string,
  choices: Array<QuestionChoiceItem>,
  onChoicePress: (item: QuestionChoiceItem) => void,
  onButtonPress: () => void,
|};

const styles = StyleSheet.create({
  choicesContainer: {
    paddingHorizontal: theme.spacing.small,
  },
  explanation: {
    color: theme.colors.gray.medium,
    fontSize: 16,
    textAlign: 'center',
  },
  explanationContainer: {
    paddingHorizontal: theme.spacing.xlarge,
  },
  question: {
    color: theme.colors.black,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  questionContainer: {
    paddingHorizontal: theme.spacing.large,
  },
  validateButton: {
    paddingHorizontal: theme.spacing.xlarge,
  },
});

const Question = ({type, question, explanation, choices, onChoicePress, onButtonPress}: Props) => {
  const oneChoiceSelected = choices.some(({selected = false}) => selected);

  return (
    <View testID="question">
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question}</Text>
      </View>
      <Space type="small" />
      <View style={styles.explanationContainer}>
        <Text style={styles.explanation}>{explanation}</Text>
      </View>
      <Space type="large" />
      <View style={styles.choicesContainer}>
        <QuestionChoices type={type} items={choices} onItemPress={onChoicePress} />
      </View>
      <Space type="base" />
      <Space type="tiny" />
      <View style={styles.validateButton}>
        <Button onPress={onButtonPress} isDisabled={!oneChoiceSelected}>
          Validate
        </Button>
      </View>
    </View>
  );
};

export default Question;
