import * as React from 'react';
import {View, ViewStyle} from 'react-native';
import {NovaCompositionNavigationArrowLeft as BackIcon} from '@coorpacademy/nova-icons';

import theme from '../modules/theme';

interface Props {
  color?: string;
  height?: number;
  width?: number;
  style?: ViewStyle;
}

const HeaderBackIcon = ({
  color = theme.colors.gray.dark,
  height = 16,
  width = 16,
  style,
}: Props) => (
  <View style={style}>
    <BackIcon color={color} height={height} width={width} />
  </View>
);

export default HeaderBackIcon;
