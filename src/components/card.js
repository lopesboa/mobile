// @flow

import * as React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import theme from '../modules/theme';

export type CardType = 'deckSwipe' | 'contain' | 'default';

export type Props = {|
  children: React.Node,
  style?: ViewStyleProp,
  shadowStyle?: ViewStyleProp,
  testID?: string,
  type?: CardType
|};

export const LAYOUT: {[key: string]: CardType} = {
  DECK_SWIPE: 'deckSwipe',
  CONTAIN: 'contain',
  DEFAULT: 'default'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: theme.radius.card
  },
  deckSwipe: {
    ...Platform.select({
      ios: {
        overflow: 'hidden'
      }
    })
  },
  overflowHidden: {
    overflow: 'hidden'
  }
});

const Card = ({children, style, testID, type = LAYOUT.DEFAULT, shadowStyle}: Props) => {
  switch (type) {
    case LAYOUT.DECK_SWIPE:
      /* istanbul ignore next */
      return (
        (Platform.OS === 'ios' && (
          <View style={[style, styles.container, styles.deckSwipe]}>
            <View style={[styles.container]} testID={testID}>
              {children}
            </View>
          </View>
        )) || (
          <View style={[style, styles.container, styles.deckSwipe]} testID={testID}>
            {children}
          </View>
        )
      );
    case LAYOUT.CONTAIN:
      return (
        <View style={shadowStyle} testID={testID}>
          <View style={style}>{children}</View>
        </View>
      );
    case LAYOUT.DEFAULT:
      return (
        <View style={[styles.container, shadowStyle]} testID={testID}>
          <View style={[style, styles.overflowHidden]}>{children}</View>
        </View>
      );
    default:
      return null;
  }
};

export default Card;
