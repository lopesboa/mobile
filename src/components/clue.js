// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import theme from '../modules/theme';
import FlippableCard from '../containers/card-flippable';
import ClueFrontItem from './clue-front-item';
import Html from './html';
import Space from './space';
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
    paddingVertical: theme.spacing.base,
    flexGrow: 1
  },
  text: {
    color: theme.colors.white,
    fontSize: 22,
    textAlign: 'center'
  },
  buttonText: {
    fontSize: 17
  },
  header: {
    color: theme.colors.black,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: theme.fontWeight.bold
  },
  questionContainer: {
    paddingHorizontal: theme.spacing.xlarge
  }
});

const Clue = ({header, clue, slideId, starsDiff, onPress, testID}: Props) => (
  <View style={styles.container} testID={testID}>
    <View style={styles.questionContainer}>
      <QuestionTitle>{header}</QuestionTitle>
    </View>
    <Space type="base" />
    <FlippableCard
      frontItem={ClueFrontItem}
      starsDiff={starsDiff}
      slideId={slideId}
      onPress={onPress}
    >
      <Html fontSize={22} style={styles.text}>
        {clue}
      </Html>
    </FlippableCard>
  </View>
);

export default Clue;
