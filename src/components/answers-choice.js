// @flow strict

import * as React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import theme from '../modules/theme';
import Text from './text';

type Props = {|
  selected?: boolean,
  onPress: () => void,
  children: string,
|};

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    color: theme.colors.black,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  selectedText: {
    color: theme.colors.white,
  },
  container: {
    borderRadius: 3,
    backgroundColor: theme.colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.colors.gray.extra,
  },
  selected: {
    backgroundColor: theme.colors.primary.default,
  },
});

const AnswersChoice = ({children, selected = false, onPress}: Props) => (
  <TouchableOpacity onPress={onPress}>
    <View testID="answerChoice" style={[styles.container, selected && styles.selected]}>
      <Text style={[styles.text, selected && styles.selectedText]}>{children}</Text>
    </View>
  </TouchableOpacity>
);

export default AnswersChoice;
