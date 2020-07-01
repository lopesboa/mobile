import * as React from 'react';
import {StyleSheet} from 'react-native';

import theme from '../modules/theme';
import {AUTHOR_TYPE} from '../const';
import type {AuthorType} from '../types';
import Text from './text';

interface Props {
  type: AuthorType;
  name?: string;
  size?: 'cover' | 'hero';
  testID: string;
}

const styles = StyleSheet.create({
  text: {
    color: theme.colors.white,
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowRadius: 2,
    textAlign: 'center',
  },
  bold: {
    fontWeight: theme.fontWeight.extraBold,
  },
});

const CatalogItemAuthor = ({type, name = '', size, testID}: Props) => {
  const fontSize =
    (size && (size === 'hero' ? theme.fontSize.medium : theme.fontSize.small)) ||
    theme.fontSize.extraSmall;
  const textStyle = {
    fontSize,
  };
  const letterSpacingStyle = {
    letterSpacing: fontSize * 0.1875,
  };

  return (
    <Text
      testID={`author-${testID}`}
      style={[styles.text, type === AUTHOR_TYPE.COORP && letterSpacingStyle, textStyle]}
    >
      {type === AUTHOR_TYPE.COORP ? (
        <React.Fragment>
          COORP <Text style={styles.bold}>ORIGINAL</Text>
        </React.Fragment>
      ) : null}
      {type === AUTHOR_TYPE.MARKETPLACE && name && name.toUpperCase()}
      {type === AUTHOR_TYPE.CUSTOM ? (
        <React.Fragment>{name && name.toUpperCase()} CREATION</React.Fragment>
      ) : null}
    </Text>
  );
};

export default CatalogItemAuthor;
