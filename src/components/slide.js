// @flow strict

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import Question from './question';
import type {Props as QuestionProps} from './question';

export type Props = {|
  question: QuestionProps,
|};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
});

const Slide = (props: Props) => {
  const {type, header, explanation, choices, media, onChoicePress, onButtonPress} = props.question;

  return (
    <View style={styles.container}>
      <Question
        type={type}
        header={header}
        explanation={explanation}
        choices={choices}
        media={media}
        onChoicePress={onChoicePress}
        onButtonPress={onButtonPress}
      />
    </View>
  );
};

export default Slide;
