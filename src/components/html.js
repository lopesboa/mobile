// @flow

import * as React from 'react';
import {View} from 'react-native';
import HtmlBase from 'react-native-render-html';

import theme from '../modules/theme';
import withVibration from '../containers/with-vibration';
import type {WithVibrationProps} from '../containers/with-vibration';
import withDarkMode from '../containers/with-dark-mode';
import type {WithDarkModeProps} from '../containers/with-dark-mode';
import Text, {DEFAULT_STYLE as DEFAULT_TEXT_STYLE} from './text';

type Props = {|
  ...WithVibrationProps,
  ...WithDarkModeProps,
  children: string,
  fontSize: number,
  onLinkPress?: (url: string) => void,
  containerStyle?: ViewStyleProp,
  anchorTextColor?: string,
  imageStyle?: ImageStyleProp,
  style?: TextStyleProp,
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
    fontWeight: theme.fontWeight.bold
  },
  s: {
    textDecorationLine: 'line-through'
  }
};

class Html extends React.PureComponent<Props> {
  props: Props;

  // eslint-disable-next-line flowtype/no-weak-types
  handleLinkPress = (_: any, url: string) => {
    const {onLinkPress, vibration} = this.props;

    vibration.vibrate();

    onLinkPress && onLinkPress(url);
  };

  render() {
    const {
      children,
      fontSize,
      containerStyle,
      imageStyle,
      style,
      testID,
      anchorTextColor,
      isTextCentered,
      isDarkModeActivated
    } = this.props;

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

    let textBaseColor = (isDarkModeActivated && theme.colors.white) || theme.colors.black;
    let baseFontStyle = {...DEFAULT_TEXT_STYLE, fontSize, color: textBaseColor};
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

    const renderers = {
      // eslint-disable-next-line react/display-name
      font: (htmlAttribs, componentChildren) => (
        <Text
          key={1}
          style={{
            ...baseFontStyle,
            color: htmlAttribs.color
          }}
        >
          {componentChildren}
        </Text>
      )
    };

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
          onLinkPress={this.handleLinkPress}
          renderers={renderers}
          // this is exceptionally for the onboarding course
          // is the only course that has a gif in the context but the img tag
          // comes with width & height attr and these makes this lib do not render the gif
          // so to avoid it, we decided to ignore these attr
          ignoredStyles={['width', 'height']}
          testID="html-base"
        />
      </View>
    );
  }
}

export {Html as Component};
export default withDarkMode(withVibration(Html));
