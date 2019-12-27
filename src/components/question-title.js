// @flow

import * as React from 'react';
import {StyleSheet} from 'react-native';

import {useDarkMode} from '../containers/with-dark-mode';
import theme from '../modules/theme';

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
  const isDarkModeActivated = useDarkMode();
  return (
    <Html
      fontSize={theme.fontSize.large}
      style={[styles.text, isDarkModeActivated && styles.textDarkMode]}
      isTextCentered
      testID="question-title"
    >
      {children}
    </Html>
  );
};

export default QuestionTitle;
