// @flow

import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Color from 'color';

type Props = {|
  children?: React.Node,
  colors: Array<string>,
  height?: number,
  style?: GenericStyleProp,
  testID?: string
|};

const Gradient = ({children, colors, height, style, testID}: Props) => {
  let calculatedColors = colors;
  if (colors.length === 1) {
    const {r, g, b} = Color(colors[0]).object();
    calculatedColors = [`rgba(${r}, ${g}, ${b}, 0)`, colors[0], colors[0]];
  }
  const gradientStyle: GenericStyleProp = {...style, height};

  return (
    <LinearGradient colors={calculatedColors} style={gradientStyle} testID={testID}>
      {children}
    </LinearGradient>
  );
};

export default Gradient;
