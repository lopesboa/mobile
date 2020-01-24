// @flow

import * as React from 'react';
import {View, StyleSheet, Platform} from 'react-native';

import theme from '../modules/theme';
import {STYLE as BOX_STYLE} from './box';

export type CardType = 'deckSwipe' | 'contain';

export type Props = {|
  children: React.Node,
  style?: ViewStyleProp,
  testID?: string,
  type?: CardType
|};

export const LAYOUT: {[key: string]: CardType} = {
  DECK_SWIPE: 'deckSwipe',
  CONTAIN: 'contain'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: theme.radius.card
  },
  overflowHidden: {
    overflow: 'hidden'
  }
});

const Card = ({children, style, testID, type}: Props) => {
  switch (type) {
    case LAYOUT.DECK_SWIPE:
      /* istanbul ignore next */
      return (Platform.OS === 'ios' ? (
        <View style={[style, styles.container, styles.overflowHidden]}>
          <View style={[styles.container]} testID={testID}>
            {children}
          </View>
        </View>
      ) : null) ? (
        <View style={[style, styles.container]} testID={testID}>
          {children}
        </View>
      ) : null;
    case LAYOUT.CONTAIN:
      return (
        <View style={BOX_STYLE} testID={testID}>
          <View style={style}>{children}</View>
        </View>
      );
    default:
      return (
        <View style={[styles.container, BOX_STYLE]} testID={testID}>
          <View style={[style, styles.overflowHidden]}>{children}</View>
        </View>
      );
  }
};

export default Card;
