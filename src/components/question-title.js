// @flow

import * as React from 'react';
import {StyleSheet} from 'react-native';

import theme from '../modules/theme';
import Text from './text';

type Props = {|
  children: string
|};

const styles = StyleSheet.create({
  text: {
    color: theme.colors.black,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: theme.fontWeight.bold
  }
});

const QuestionTitle = ({children}: Props) => (
  <Text style={styles.text} testID="question-title">
    {children}
  </Text>
);

export default QuestionTitle;
