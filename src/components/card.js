// @flow

import * as React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import theme from '../modules/theme';

export type CardType = 'deckSwipe' | 'contain' | 'default';

export type Props = {|
  children: React.Node,
  style?: GenericStyleProp,
  shadowStyle?: GenericStyleProp,
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
  overflowHiddeniOS: {
    ...Platform.select({
      ios: {
        overflow: 'hidden'
      }
    })
  },
  overflowHidden: {overflow: 'hidden'}
});

const Card = ({children, style, testID, type = LAYOUT.DEFAULT, shadowStyle}: Props) => {
  switch (type) {
    case LAYOUT.DECK_SWIPE:
      return (
        <View style={[style, styles.container, styles.overflowHiddeniOS]}>
          <View style={[styles.container]} testID={testID}>
            {children}
          </View>
        </View>
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
  }
};

export default Card;
