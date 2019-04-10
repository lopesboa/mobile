// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import theme from '../modules/theme';
import FlippableCard from '../containers/card-flippable';
import ClueFrontItem from './clue-front-item';
import Html from './html';
import QuestionTitle from './question-title';

export type Props = {|
  header: string,
  clue: string,
  slideId: string,
  starsDiff: number,
  onPress: () => void,
  testID?: string
|};

const styles: GenericStyleProp = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.base + theme.spacing.tiny,
    paddingBottom: theme.spacing.base,
    flexGrow: 1
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.fontSize.large
  },
  buttonText: {
    fontSize: theme.fontSize.large
  },
  header: {
    color: theme.colors.black,
    textAlign: 'center',
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.bold
  },
  questionContainer: {
    paddingHorizontal: theme.spacing.base
  }
});

const Clue = ({header, clue, slideId, starsDiff, onPress, testID}: Props) => (
  <View style={styles.container} testID={testID}>
    <View style={styles.questionContainer}>
      <QuestionTitle isTextCentered>{header}</QuestionTitle>
    </View>
    <FlippableCard
      frontItem={ClueFrontItem}
      starsDiff={starsDiff}
      slideId={slideId}
      onPress={onPress}
    >
      <Html fontSize={theme.fontSize.extraLarge} style={styles.text} isTextCentered>
        {clue}
      </Html>
    </FlippableCard>
  </View>
);

export default Clue;
