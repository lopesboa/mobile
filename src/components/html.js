// @flow

import * as React from 'react';
import {View, Text} from 'react-native';
import HtmlBase from 'react-native-render-html';

import theme from '../modules/theme';

type Props = {|
  children: string,
  fontSize: number,
  onLinkPress?: () => void,
  containerStyle?: GenericStyleProp,
  anchorTextColor?: string,
  imageStyle?: GenericStyleProp,
  style?: GenericStyleProp,
  testID?: string,
  isTextCentered?: boolean
|};

// Don't use StyleSheet there, it's not a react style
const styles = {
  p: {
    marginVertical: 0,
    textAlign: 'center'
  },
  u: {
    textDecorationLine: 'underline'
  },
  i: {
    fontStyle: 'italic'
  },
  b: {
    fontWeight: theme.fontWeight.semiBold
  },
  s: {
    textDecorationLine: 'line-through'
  }
};

const Html = ({
  children,
  fontSize,
  containerStyle,
  imageStyle,
  style,
  onLinkPress,
  testID,
  anchorTextColor,
  isTextCentered
}: Props) => {
  const tagsStyles = {
    ...styles,
    h1: {fontSize},
    h2: {fontSize},
    h3: {fontSize},
    h4: {fontSize},
    h5: {fontSize},
    h6: {fontSize},
    a: {color: anchorTextColor},
    img: imageStyle
  };

  const renderers = {
    // eslint-disable-next-line react/display-name
    font: (htmlAttribs, componentChildren) => {
      return (
        <Text
          key={1}
          style={{
            color: htmlAttribs.color
          }}
        >
          {componentChildren}
        </Text>
      );
    }
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
    <View testID={testID} style={containerStyle}>
      <HtmlBase
        // to text-align center on android
        // we have to encapsulate between <p> tag
        // and use custom style define on <p>
        // definition in component style doesn't work
        html={isTextCentered ? `<p>${children}</p>` : `${children}`}
        tagsStyles={tagsStyles}
        baseFontStyle={baseFontStyle}
        onLinkPress={onLinkPress}
        renderers={renderers}
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
