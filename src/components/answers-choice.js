// @flow

import * as React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Text from './text';

type Props = {|
  selected?: boolean,
  onPress: () => void,
  children: string,
|};

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    color: '#14171a',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  selectedText: {
    color: '#ffffff',
  },
  container: {
    borderRadius: 3,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#fafafa',
  },
  selected: {
    backgroundColor: '#00b0ff',
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
