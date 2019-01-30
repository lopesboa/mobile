// @flow strict

import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import type {QuestionChoiceItem, QuestionType, Media} from '../types';
import theme from '../modules/theme';
import Image from '../containers/image-scalable';
import translations from '../translations';
import Text from './text';
import QuestionChoices from './question-choices';
import QuestionTitle from './question-title';
import Space from './space';
import Button from './button';

export type Props = {|
  type: QuestionType,
  header: string,
  explanation: string,
  choices: Array<QuestionChoiceItem>,
  media?: Media,
  onChoicePress: (item: QuestionChoiceItem) => void,
  onButtonPress: () => void
|};

export type State = {|
  imageWidth?: number
|};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.base,
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  choicesContainer: {
    paddingHorizontal: theme.spacing.small
  },
  explanation: {
    color: theme.colors.gray.medium,
    fontSize: 15,
    textAlign: 'center'
  },
  questionContainer: {
    paddingHorizontal: theme.spacing.xlarge
  },
  image: {
    alignSelf: 'center'
  },
  validateButton: {
    paddingHorizontal: theme.spacing.base
  }
});

const Question = ({
  type,
  header,
  explanation,
  choices,
  media,
  onChoicePress,
  onButtonPress
}: Props) => {
  const oneChoiceSelected = choices.some(({selected = false}) => selected);

  return (
    <View testID="question" style={styles.container}>
      <View style={styles.questionContainer}>
        <QuestionTitle>{header}</QuestionTitle>
        <Space type="small" />
        <Text style={styles.explanation} testID="explanation">
          {explanation}
        </Text>
      </View>
      <Space type="base" />
      {media && (
        <View>
          <Image
            source={media.source}
            maxHeight={150}
            testID="question-image"
            style={styles.image}
          />
          <Space type="base" />
        </View>
      )}
      <View style={styles.choicesContainer}>
        <QuestionChoices type={type} items={choices} onItemPress={onChoicePress} />
      </View>
      <Space type="base" />
      <Space type="tiny" />
      <View style={styles.validateButton}>
        <Button onPress={onButtonPress} isDisabled={!oneChoiceSelected} testID="button-validate">
          {translations.validate}
        </Button>
      </View>
    </View>
  );
};

export default Question;
