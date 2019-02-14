// @flow strict

import * as React from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';
import type {Media, QuestionType, Choice} from '@coorpacademy/progression-engine';

import theme from '../modules/theme';
import {getCleanUri} from '../modules/uri';
import translations from '../translations';
import Html from './html';
import QuestionChoices from './question-choices';
import QuestionTitle from './question-title';
import Space from './space';
import Button from './button';

export type Props = {|
  type: QuestionType,
  header: string,
  explanation: string,
  choices: Array<Choice>,
  userChoices: Array<string>,
  media?: Media,
  isValidating: boolean,
  onChoicePress: (item: Choice) => void,
  onButtonPress: () => void,
  isValidating?: boolean
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
    textAlign: 'center'
  },
  questionContainer: {
    paddingHorizontal: theme.spacing.xlarge
  },
  image: {
    alignSelf: 'center',
    height: 200,
    width: '100%'
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
  userChoices,
  onChoicePress,
  onButtonPress,
  isValidating
}: Props) => {
  const oneChoiceSelected = userChoices.length > 0;
  const mediaUri = media && media.url && getCleanUri(media.url);

  return (
    <View testID="question" style={styles.container}>
      <View style={styles.questionContainer}>
        <QuestionTitle>{header}</QuestionTitle>
        <Space type="small" />
        <Html fontSize={15} style={styles.explanation} testID="explanation">
          {explanation}
        </Html>
      </View>
      <Space type="base" />
      {mediaUri && (
        <View>
          <ImageBackground
            source={{uri: mediaUri}}
            style={styles.image}
            resizeMode="contain"
            testID="question-image"
          />
          <Space type="base" />
        </View>
      )}
      <View style={styles.choicesContainer}>
        <QuestionChoices
          type={type}
          items={choices}
          userChoices={userChoices}
          onItemPress={onChoicePress}
          isDisabled={isValidating}
        />
      </View>
      <Space type="base" />
      <View style={styles.validateButton}>
        <Button
          onPress={onButtonPress}
          isDisabled={!oneChoiceSelected || isValidating}
          isLoading={isValidating}
          testID="button-validate"
        >
          {translations.validate}
        </Button>
      </View>
    </View>
  );
};

export default Question;
