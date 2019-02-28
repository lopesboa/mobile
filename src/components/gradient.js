// @flow

import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Color from 'color';

type Props = {|
  color: string,
  height: number,
  style?: GenericStyleProp
|};

const Gradient = ({color, height, style}: Props) => {
  const {r, g, b} = Color(color).object();
  const gradientStyle: GenericStyleProp = {...style, height};

  return (
    <LinearGradient colors={[`rgba(${r}, ${g}, ${b}, 0)`, color, color]} style={gradientStyle} />
  );
};

export default Gradient;
