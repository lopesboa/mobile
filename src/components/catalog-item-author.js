// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import theme from '../modules/theme';
import Text from './text';

type Props = {|
  authorType: string,
  testID: string,
  style?: GenericStyleProp
|};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    margin: theme.spacing.small + theme.spacing.micro,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  author: {
    color: theme.colors.white,
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowRadius: 2
  },
  bold: {fontWeight: theme.fontWeight.bold}
});

const CatalogItemAuthor = ({authorType, style, testID}: Props) => {
  if (authorType === 'coorp') {
    return (
      <View style={styles.container}>
        <Text testID={`author-${testID}`} style={[styles.author, style]}>
          COORP <Text style={styles.bold}>ORIGINAL</Text>
        </Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text testID={`author-${testID}`} style={[styles.author, style]}>
          {authorType && authorType.toUpperCase()}
        </Text>
      </View>
    );
  }
};

export default CatalogItemAuthor;
