// @flow

import * as React from 'react';
import {View} from 'react-native';
import HtmlBase from 'react-native-render-html';

import theme from '../modules/theme';

type Props = {|
  children: string,
  fontSize: number,
  style?: GenericStyleProp,
  testID?: string
|};

// Don't use StyleSheet there, it's not a react style
const styles = {
  p: {
    marginVertical: 0
  }
};

const Html = ({children, fontSize, style, testID}: Props) => {
  const tagsStyles = {
    ...styles,
    h1: {fontSize},
    h2: {fontSize},
    h3: {fontSize},
    h4: {fontSize},
    h5: {fontSize},
    h6: {fontSize}
  };
  let baseFontStyle = {fontSize, color: theme.colors.black};
  if (style) {
    if (Array.isArray(style)) {
      const styleObject = style.reduce((result, child) => ({
        ...result,
        ...child
      }));
      baseFontStyle = {
        ...baseFontStyle,
        ...styleObject
      };
    } else {
      baseFontStyle = {
        ...baseFontStyle,
        ...style
      };
    }
  }

  return (
    <View testID={testID}>
      <HtmlBase html={`${children}`} tagsStyles={tagsStyles} baseFontStyle={baseFontStyle} />
    </View>
  );
};

export default Html;
