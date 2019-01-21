// @flow strict

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import theme from '../modules/theme';
import translations from '../translations';
import Button from './button';
import Text from './text';
import Space from './space';

type Props = {|
  isCorrect: boolean,
  onButtonPress: () => void
|};

const PADDING_WIDTH = theme.spacing.base;
export const POSITIVE_COLOR = theme.colors.positive;
export const NEGATIVE_COLOR = theme.colors.negative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  positive: {
    backgroundColor: theme.colors.positive
  },
  negative: {
    backgroundColor: theme.colors.negative
  },
  mainTitle: {
    color: theme.colors.white,
    fontSize: 28,
    fontWeight: theme.fontWeight.bold
  },
  subTitle: {
    fontSize: 17,
    color: theme.colors.white
  },
  header: {
    position: 'absolute',
    paddingHorizontal: PADDING_WIDTH,
    paddingTop: PADDING_WIDTH
  },
  footer: {
    paddingHorizontal: PADDING_WIDTH,
    paddingBottom: PADDING_WIDTH
  }
});

const LevelEnd = ({isCorrect, onButtonPress}: Props) => {
  const title = (isCorrect && translations.congratulations) || translations.gameOver;

  return (
    <View
      style={[styles.container, isCorrect ? styles.positive : styles.negative]}
      testID={`level-end-${isCorrect ? 'success' : 'error'}`}
    >
      <View style={styles.header}>
        <Text style={styles.mainTitle} testID="level-end-title">
          {title}
        </Text>
        {!isCorrect && (
          <Text style={styles.subTitle} testID="level-end-subtitle">
            {translations.outOfLives}
          </Text>
        )}
      </View>
      <Space type="base" />
      <View style={styles.footer}>
        <Button
          isInverted
          onPress={onButtonPress}
          testID={`button-${isCorrect ? 'next' : 'retry'}-level`}
        >
          {(isCorrect && translations.nextLevel) || translations.retryLevel}
        </Button>
      </View>
    </View>
  );
};

export default LevelEnd;
