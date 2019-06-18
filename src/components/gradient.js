// @flow

import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Color from 'color';

type Props = {|
  children?: React.Node,
  colors: Array<string>,
  transparencyPosition?: 'top' | 'bottom',
  height?: number,
  style?: ViewStyleProp,
  testID?: string,
  pointerEvents?: string
|};

const Gradient = ({
  children,
  colors,
  transparencyPosition = 'top',
  height,
  style,
  testID,
  pointerEvents
}: Props) => {
  let calculatedColors = colors;
  if (colors.length === 1) {
    const {r, g, b} = Color(colors[0]).object();
    calculatedColors =
      transparencyPosition === 'top'
        ? [`rgba(${r}, ${g}, ${b}, 0)`, colors[0], colors[0]]
        : [colors[0], colors[0], `rgba(${r}, ${g}, ${b}, 0)`];
  }

  return (
    <LinearGradient
      colors={calculatedColors}
      style={[style, height && {height}]}
      pointerEvents={pointerEvents}
      testID={testID}
    >
      {children}
    </LinearGradient>
  );
};

export default Gradient;
