// @flow

import * as React from 'react';
import {View, StyleSheet, Platform} from 'react-native';

import theme from '../modules/theme';

export type Props = {|
  children: React.Node,
  testID?: string
|};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: theme.radius.card,
    ...Platform.select({
      ios: {
        overflow: 'hidden'
      }
    })
  }
});

const DeckCard = ({children, testID}: Props) => (
  <View style={styles.container} testID={testID}>
    {children}
  </View>
);

export default DeckCard;
