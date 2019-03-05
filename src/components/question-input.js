// @flow strict

import * as React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import type {Choice} from '@coorpacademy/progression-engine';

import theme from '../modules/theme';
import translations from '../translations';
import type {QuestionChoiceInputType} from '../types';
import {QUESTION_CHOICE_INPUT_TYPE} from '../const';
import {BrandThemeContext} from './brand-theme-provider';
import Select from './select';

type Props = {|
  isDisabled?: boolean,
  type: QuestionChoiceInputType,
  items?: $PropertyType<Choice, 'items'>,
  value?: string,
  onChange: (value: string) => void,
  testID?: string
|};

const PLACEHOLDER_COLOR = theme.colors.gray.medium;
export const ROW_SPACE = theme.spacing.tiny;

const styles = StyleSheet.create({
  input: {
    padding: theme.spacing.small,
    borderWidth: 1,
    borderColor: theme.colors.gray.lightMedium,
    borderRadius: theme.radius.common,
    backgroundColor: theme.colors.white,
    color: PLACEHOLDER_COLOR,
    fontWeight: theme.fontWeight.bold,
    fontSize: 13,
    minWidth: 120
  },
  spaced: {
    paddingBottom: ROW_SPACE
  }
});

const QuestionInput = ({
  isDisabled = false,
  type,
  items = [],
  value,
  onChange,
  testID = 'question-input'
}: Props) => {
  const disabledSuffix = isDisabled ? '-disabled' : '';
  const selectedSuffix = value ? '-selected' : '';

  return (
    <BrandThemeContext.Consumer>
      {brandTheme => {
        const selectedStyle = {
          borderColor: brandTheme.colors.primary,
          color: brandTheme.colors.primary
        };

        if (type === QUESTION_CHOICE_INPUT_TYPE.TEXT) {
          return (
            <View style={styles.spaced} testID={testID}>
              <TextInput
                style={[styles.input, value && selectedStyle]}
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
            <View style={styles.spaced} testID={testID}>
              <Select
                isDisabled={isDisabled}
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
};

export default QuestionInput;
