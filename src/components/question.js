// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import type {Media, QuestionType, Choice} from '@coorpacademy/progression-engine';

import {getMediaUrl, getMediaPoster, getMediaType} from '../modules/media';
import theme from '../modules/theme';
import translations from '../translations';
import {QUESTION_TYPE, RESOURCE_TYPE} from '../const';
import {useDarkMode} from '../containers/with-dark-mode';
import Resource from './resource';
import Html from './html';
import QuestionChoices from './question-choices';
import type {Props as QuestionChoicesProps} from './question-choices';
import QuestionTitle from './question-title';
import PlaceholderLine from './placeholder-line';
import Space from './space';
import Button from './button';

export type Props = {|
  type?: QuestionType,
  header?: string,
  explanation?: string,
  template?: string,
  choices: Array<Choice>,
  userChoices: Array<string>,
  media?: Media,
  // @todo mutualize the callback ?
  onChoicePress: (item: Choice) => void,
  onSliderChange: $PropertyType<QuestionChoicesProps, 'onSliderChange'>,
  onChoiceInputChange: (item: Choice, value: string) => void,
  onInputValueChange: (value: string) => void,
  onButtonPress: () => void,
  min?: $PropertyType<QuestionChoicesProps, 'min'>,
  max?: $PropertyType<QuestionChoicesProps, 'max'>,
  unit?: $PropertyType<QuestionChoicesProps, 'unit'>,
  value?: $PropertyType<QuestionChoicesProps, 'value'>,
  step?: $PropertyType<QuestionChoicesProps, 'step'>,
  testID?: string
|};

export type State = {|
  imageWidth?: number
|};

const PLACEHOLDER_COLOR = theme.colors.gray.light;

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.base + theme.spacing.tiny,
    paddingBottom: theme.spacing.base,
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  containerPlaceholder: {
    paddingTop: theme.spacing.large
  },
  placeholder: {
    alignItems: 'center'
  },
  choicesContainer: {
    paddingHorizontal: theme.spacing.small
  },
  explanation: {
    color: theme.colors.gray.medium
  },
  explanationDarkMode: {
    color: theme.colors.white
  },
  questionContainer: {
    paddingHorizontal: theme.spacing.base
  },
  image: {
    alignSelf: 'center',
    height: 200,
    width: '100%'
  },
  footer: {
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
  min,
  max,
  unit,
  step,
  value,
  testID
}: Props) => {
  const isDarkModeActivated = useDarkMode();
  if (!type || !header || !explanation) {
    return (
      <View style={styles.containerPlaceholder}>
        <View>
          <PlaceholderLine color={PLACEHOLDER_COLOR} width="45%" style={styles.placeholder} />
          <Space />
          <PlaceholderLine color={PLACEHOLDER_COLOR} width="70%" style={styles.placeholder} />
        </View>
      </View>
    );
  }

  const oneChoiceSelected =
    type === QUESTION_TYPE.TEMPLATE
      ? choices.length === userChoices.filter(choice => choice).length
      : userChoices.length > 0;

  let mediaUrl;
  let mediaType = media && getMediaType(media);
  let mediaPoster;

  if (media && [RESOURCE_TYPE.IMG, RESOURCE_TYPE.VIDEO].includes(mediaType)) {
    mediaUrl = getMediaUrl(media);
    mediaPoster = getMediaPoster(media);
  }

  return (
    <View testID={testID} style={styles.container}>
      <View>
        <View style={styles.questionContainer}>
          <QuestionTitle>{header}</QuestionTitle>
          <Space type="small" />
          <Html
            fontSize={theme.fontSize.regular}
            style={[styles.explanation, isDarkModeActivated && styles.explanationDarkMode]}
            isTextCentered
            testID="explanation"
          >
            {explanation}
          </Html>
        </View>
        <Space type="base" />
        {mediaUrl && mediaType && (
          <View>
            <Resource
              type={mediaType}
              url={mediaUrl}
              // $FlowFixMe incomplete media type
              videoId={media.videoId}
              // $FlowFixMe incomplete media type
              mimeType={media.mimeType}
              thumbnail={mediaPoster}
              resizeMode={mediaType === RESOURCE_TYPE.VIDEO ? 'cover' : 'contain'}
              testID="question-resource"
            />
            <Space type="base" />
          </View>
        )}
      </View>

      <Space type="base" />

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
          min={min}
          max={max}
          unit={unit}
          step={step}
          value={value}
        />
      </View>
      <Space type="base" />
      <View style={styles.footer}>
        <Button
          onPress={onButtonPress}
          isDisabled={!oneChoiceSelected}
          testID="button-validate"
          analyticsID="button-validate"
          analyticsParams={{questionType: type}}
        >
          {translations.validate}
        </Button>
      </View>
    </View>
  );
};

export default Question;
