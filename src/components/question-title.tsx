import * as React from 'react';
import {StyleSheet} from 'react-native';

import theme from '../modules/theme';
import Html from './html';

interface Props {
  children: string;
  isTextCentered?: boolean;
}

const styles = StyleSheet.create({
  text: {
    color: theme.colors.black,
    fontWeight: theme.fontWeight.bold,
  },
});

const QuestionTitle = ({children, isTextCentered}: Props) => {
  return (
    <Html
      fontSize={theme.fontSize.large}
      style={styles.text}
      isTextCentered
      testID="question-title"
    >
      {children}
    </Html>
  );
};

export default QuestionTitle;
