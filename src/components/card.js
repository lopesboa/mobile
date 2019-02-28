// @flow

import * as React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import theme from '../modules/theme';

export type Props = {|
  children: React.Node,
  style?: GenericStyleProp,
  shadowStyle?: GenericStyleProp,
  testID?: string,
  isDeckCard?: boolean
|};

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

const Card = ({children, style, testID, isDeckCard, shadowStyle}: Props) => {
  if (isDeckCard) {
    return (
      <View style={[style, styles.container, styles.overflowHiddeniOS]}>
        <View style={[styles.container]} testID={testID}>
          {children}
        </View>
      </View>
    );
  } else {
    return (
      <View style={[shadowStyle]} testID={testID}>
        <View style={[style, styles.overflowHidden]}>{children}</View>
      </View>
    );
  }
};

export default Card;
