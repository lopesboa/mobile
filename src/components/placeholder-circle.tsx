import * as React from 'react';
import {View} from 'react-native';

import theme from '../modules/theme';

interface Props {
  testID?: string;
  width: number;
  color?: string;
}

const PlaceholderCircle = ({testID, color = theme.colors.gray.light, width}: Props) => (
  <View
    style={[{borderRadius: width, height: width, width, backgroundColor: color}]}
    testID={testID}
  />
);

export default PlaceholderCircle;
