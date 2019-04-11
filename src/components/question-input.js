// @flow strict

import * as React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import type {Choice, QuestionType} from '@coorpacademy/progression-engine';

import theme from '../modules/theme';
import translations from '../translations';
import type {AnalyticsEventType, QuestionChoiceInputType} from '../types';
import {ANALYTICS_EVENT_TYPE, QUESTION_CHOICE_INPUT_TYPE} from '../const';
import withAnalytics from '../containers/with-analytics';
import type {WithAnalyticsProps} from '../containers/with-analytics';
import {BrandThemeContext} from './brand-theme-provider';
import Select from './select';

type Props = {|
  ...WithAnalyticsProps,
  isDisabled?: boolean,
  questionType: QuestionType,
  type: QuestionChoiceInputType,
  items?: $PropertyType<Choice, 'items'>,
  value?: string,
  onChange: (value: string) => void,
  testID?: string,
  fullWitdh?: boolean
|};

const PLACEHOLDER_COLOR = theme.colors.gray.medium;
export const ROW_SPACE = theme.spacing.tiny;

const styles = StyleSheet.create({
  input: {
    padding: theme.spacing.tiny,
    borderWidth: 1,
    borderColor: theme.colors.gray.lightMedium,
    borderRadius: theme.radius.common,
    backgroundColor: theme.colors.white,
    color: PLACEHOLDER_COLOR,
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.regular,
    minWidth: 175,
    textAlign: 'center'
  },
  spaced: {
    paddingVertical: ROW_SPACE
  },
  fullWitdh: {
    width: '100%'
  }
});

class QuestionInput extends React.PureComponent<Props> {
  props: Props;

  logEvent = (event: AnalyticsEventType) => {
    const {analytics, type, questionType} = this.props;
    const analyticsID = `question-input-${type}`;

    analytics &&
      analytics.logEvent(event, {
        id: analyticsID,
        questionType
      });
  };

  handleFocus = () => {
    this.logEvent(ANALYTICS_EVENT_TYPE.INPUT_FOCUS);
  };

  handleBlur = () => {
    this.logEvent(ANALYTICS_EVENT_TYPE.INPUT_BLUR);
  };

  render() {
    const {
      isDisabled = false,
      type,
      questionType,
      items = [],
      value,
      onChange,
      fullWitdh = false,
      testID = 'question-input'
    } = this.props;

    const disabledSuffix = isDisabled ? '-disabled' : '';
    const selectedSuffix = value ? '-selected' : '';
    const analyticsID = `question-input-${type}`;

    return (
      <BrandThemeContext.Consumer>
        {brandTheme => {
          const selectedStyle = {
            borderColor: brandTheme.colors.primary,
            color: brandTheme.colors.primary
          };

          if (type === QUESTION_CHOICE_INPUT_TYPE.TEXT) {
            return (
              <View style={[styles.spaced, fullWitdh && styles.fullWitdh]} testID={testID}>
                <TextInput
                  style={[styles.input, value && selectedStyle]}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  onChangeText={onChange}
                  placeholder={translations.typeHere}
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  value={value}
                  testID={`${testID}-text${selectedSuffix}${disabledSuffix}`}
                  editable={!isDisabled}
                  selectTextOnFocus={!isDisabled}
                />
              </View>
            );
          }

          if (type === QUESTION_CHOICE_INPUT_TYPE.SELECT) {
            return (
              <View style={[styles.spaced, fullWitdh && styles.fullWitdh]} testID={testID}>
                <Select
                  analyticsID={analyticsID}
                  isDisabled={isDisabled}
                  questionType={questionType}
                  values={items}
                  value={value}
                  placeholder={translations.selectAnAnswer}
                  onChange={onChange}
                  style={[styles.input, value && selectedStyle]}
                  color={value && brandTheme.colors.primary}
                  testID={`${testID}-select${selectedSuffix}${disabledSuffix}`}
                />
              </View>
            );
          }

          return null;
        }}
      </BrandThemeContext.Consumer>
    );
  }
}

export {QuestionInput as Component};
export default withAnalytics(QuestionInput);
