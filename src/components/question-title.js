// @flow

import * as React from 'react';
import {StyleSheet} from 'react-native';

import theme from '../modules/theme';
import Html from './html';

type Props = {|
  children: string
|};

const styles = StyleSheet.create({
  text: {
    color: theme.colors.black,
    textAlign: 'center',
    fontWeight: theme.fontWeight.bold
  }
});

const QuestionTitle = ({children}: Props) => (
  <Html fontSize={17} style={styles.text} testID="question-title">
    {children}
  </Html>
);

export default QuestionTitle;
