import * as React from 'react';
import {ViewStyle} from 'react-native';
import {Placeholder as PlaceholderBase} from 'rn-placeholder';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Placeholder = ({children, style}: Props) => (
  <PlaceholderBase style={style}>{children}</PlaceholderBase>
);

export default Placeholder;
