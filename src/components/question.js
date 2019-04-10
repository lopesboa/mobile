// @flow

import * as React from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import type {Media, QuestionType, Choice} from '@coorpacademy/progression-engine';

import theme from '../modules/theme';
import {getCleanUri} from '../modules/uri';
import translations from '../translations';
import {QUESTION_TYPE} from '../const';
import Html from './html';
import QuestionChoices from './question-choices';
import type {Props as QuestionChoicesProps} from './question-choices';
import QuestionTitle from './question-title';
import Space from './space';
import Button from './button';

export type Props = {|
  type: QuestionType,
  header: string,
  explanation: string,
  template?: string,
  choices: Array<Choice>,
  userChoices: Array<string>,
  media?: Media,
  isValidating: boolean,
  // @todo mutualize the callback ?
  onChoicePress: (item: Choice) => void,
  onSliderChange: $PropertyType<QuestionChoicesProps, 'onSliderChange'>,
  onChoiceInputChange: (item: Choice, value: string) => void,
  onInputValueChange: (value: string) => void,
  onButtonPress: () => void,
  isValidating?: boolean,
  min?: $PropertyType<QuestionChoicesProps, 'min'>,
  max?: $PropertyType<QuestionChoicesProps, 'max'>,
  value?: $PropertyType<QuestionChoicesProps, 'value'>,
  step?: $PropertyType<QuestionChoicesProps, 'step'>
|};

export type State = {|
  imageWidth?: number
|};

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.base + theme.spacing.tiny,
    paddingBottom: theme.spacing.base,
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  choicesContainer: {
    paddingHorizontal: theme.spacing.small
  },
  explanation: {
    color: theme.colors.gray.medium
  },
  questionContainer: {
    paddingHorizontal: theme.spacing.base
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
  template,
  choices,
  media,
  userChoices,
  onChoicePress,
  onSliderChange,
  onChoiceInputChange,
  onInputValueChange,
  onButtonPress,
  isValidating,
  min,
  max,
  step,
  value
}: Props) => {
  const oneChoiceSelected =
    type === QUESTION_TYPE.TEMPLATE
      ? choices.length === userChoices.filter(choice => choice).length
      : userChoices.length > 0;
  const mediaUri = media && media.url && getCleanUri(media.url);
  return (
    <KeyboardAwareScrollView
      testID="question"
      contentContainerStyle={styles.container}
      enableOnAndroid
    >
      <View style={styles.questionContainer}>
        <QuestionTitle>{header}</QuestionTitle>
        <Space type="small" />
        <Html
          fontSize={theme.fontSize.regular}
          style={styles.explanation}
          isTextCentered
          testID="explanation"
        >
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
          template={template}
          items={choices}
          onInputValueChange={onInputValueChange}
          userChoices={userChoices}
          onItemPress={onChoicePress}
          onSliderChange={onSliderChange}
          onItemInputChange={onChoiceInputChange}
          isDisabled={isValidating}
          min={min}
          max={max}
          step={step}
          value={value}
        />
      </View>
      <Space type="base" />
      <View style={styles.validateButton}>
        <Button
          onPress={onButtonPress}
          isDisabled={!oneChoiceSelected || isValidating}
          isLoading={isValidating}
          testID="button-validate"
          analyticsID="button-validate"
          analyticsParams={{questionType: type}}
        >
          {translations.validate}
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Question;
