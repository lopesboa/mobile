// @flow

import * as React from 'react';
import {StyleSheet} from 'react-native';

import {useColorScheme} from 'react-native-appearance';
import theme from '../modules/theme';
import {THEME_PREFERENCE} from '../const';
import Html from './html';

type Props = {|
  children: string,
  isTextCentered?: boolean
|};

const styles = StyleSheet.create({
  text: {
    color: theme.colors.black,
    fontWeight: theme.fontWeight.bold
  },
  textDarkMode: {
    color: theme.colors.white
  }
});

const QuestionTitle = ({children, isTextCentered}: Props) => {
  const isDarkModeActived = useColorScheme() === THEME_PREFERENCE.DARK;
  return (
    <Html
      fontSize={theme.fontSize.large}
      style={[styles.text, isDarkModeActived && styles.textDarkMode]}
      isTextCentered
      testID="question-title"
    >
      {children}
    </Html>
  );
};

export default QuestionTitle;
