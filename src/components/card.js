// @flow strict

import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';

import theme from '../modules/theme';
import type {CardType} from '../types';
import {CARD_TYPE} from '../const';
import Gradient from './gradient';

export type Props = {|
  type: CardType,
  title: string,
  children: React.Node,
  style?: GenericStyleProp,
  testID?: string
|};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.white
  },
  header: {
    padding: theme.spacing.base,
    borderTopLeftRadius: theme.radius.card,
    borderTopRightRadius: theme.radius.card
  },
  headerText: {
    color: theme.colors.gray.dark,
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  headerTip: {
    backgroundColor: '#fff8c5'
  },
  headerKeyPoint: {
    backgroundColor: '#ffded4'
  },
  headerCorrection: {
    backgroundColor: '#d3f1e2'
  },
  content: {
    flex: 1,
    paddingTop: theme.spacing.base,
    paddingHorizontal: theme.spacing.base,
    borderBottomLeftRadius: theme.radius.card,
    borderBottomRightRadius: theme.radius.card,
    overflow: 'hidden'
  }
});

const Card = ({type, title, children, style, testID}: Props) => (
  <View style={[styles.container, style]} testID={testID}>
    <View
      style={[
        styles.header,
        type === CARD_TYPE.TIP && styles.headerTip,
        type === CARD_TYPE.KEY_POINT && styles.headerKeyPoint,
        type === CARD_TYPE.CORRECTION && styles.headerCorrection
      ]}
    >
      <Text style={styles.headerText} numberOfLines={1}>
        {title}
      </Text>
    </View>
    <View style={styles.content}>
      {children}
      <Gradient height={theme.spacing.large} color={theme.colors.white} />
    </View>
  </View>
);

export default Card;
