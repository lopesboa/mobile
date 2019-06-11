// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import theme from '../modules/theme';
import {AUTHOR_TYPE} from '../const';
import type {AuthorType} from '../types';

import Text from './text';

type Props = {|
  authorType: AuthorType,
  authorName: string,
  testID: string,
  style?: TextStyleProp
|};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginVertical: theme.spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  author: {
    color: theme.colors.white,
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowRadius: 2,
    textAlign: 'center'
  },
  bold: {fontWeight: theme.fontWeight.bold}
});

const CatalogItemAuthor = ({authorType, authorName, style, testID}: Props) => {
  return (
    <View style={styles.container}>
      <Text testID={`author-${testID}`} style={[styles.author, style]}>
        {authorType === AUTHOR_TYPE.COORP && (
          <React.Fragment>
            COORP <Text style={styles.bold}>ORIGINAL</Text>
          </React.Fragment>
        )}
        {authorType === AUTHOR_TYPE.MARKETPLACE && authorName && authorName.toUpperCase()}
        {authorType === AUTHOR_TYPE.CUSTOM && (
          <React.Fragment>{authorName && authorName.toUpperCase()} CREATION</React.Fragment>
        )}
      </Text>
    </View>
  );
};

export default CatalogItemAuthor;
