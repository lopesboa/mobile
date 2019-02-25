// @flow

import * as React from 'react';
import {View} from 'react-native';
import HtmlBase from 'react-native-render-html';

import theme from '../modules/theme';

type Props = {|
  children: string,
  fontSize: number,
  onLinkPress?: () => void,
  imageStyle?: GenericStyleProp,
  style?: GenericStyleProp,
  testID?: string
|};

// Don't use StyleSheet there, it's not a react style
const styles = {
  p: {
    marginVertical: 0
  }
};

const Html = ({children, fontSize, imageStyle, style, onLinkPress, testID}: Props) => {
  const tagsStyles = {
    ...styles,
    h1: {fontSize},
    h2: {fontSize},
    h3: {fontSize},
    h4: {fontSize},
    h5: {fontSize},
    h6: {fontSize},
    img: imageStyle
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
      <HtmlBase
        html={`${children}`}
        tagsStyles={tagsStyles}
        baseFontStyle={baseFontStyle}
        onLinkPress={onLinkPress}
        // this is exceptionally for the onboarding course
        // is the only course that has a gif in the context but the img tag
        // comes with width & height attr and these makes this lib do not render the gif
        // so to avoid it, we decided to ignore these attr
        ignoredStyles={['width', 'height']}
      />
    </View>
  );
};

export default Html;
