// @flow

import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Color from 'color';

type Props = {|
  color: string,
  height: number
|};

const Gradient = ({color, height}: Props) => {
  const {r, g, b} = Color(color).object();
  const style: GenericStyleProp = {height};

  return <LinearGradient colors={[`rgba(${r}, ${g}, ${b}, 0)`, color, color]} style={style} />;
};

export default Gradient;
